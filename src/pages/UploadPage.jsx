import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(''); // 'success', 'error'
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '1st',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setStatus('');
    } else {
      setFile(null);
      alert('Please select a valid PDF file.');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const storageRef = ref(storage, `notes/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error(error);
        setStatus('error');
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        await addDoc(collection(db, "notes"), {
          ...formData,
          fileURL: downloadURL,
          uploadedBy: auth.currentUser.displayName || auth.currentUser.email,
          uploadedByUid: auth.currentUser.uid,
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          downloads: 0
        });

        setStatus('success');
        setUploading(false);
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    );
  };

  return (
    <div className="page-container upload-page">
      <div className="upload-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="upload-card glass-card"
        >
          <div className="upload-header">
            <div className="icon-box neon-glow">
              <Upload size={32} />
            </div>
            <h2>Publish to <span className="gradient-text">Cloud</span></h2>
            <p>Upload your PDF notes and share them with the world.</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="input-group">
              <label>Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Quantum Computing Lecture 1" 
                required 
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="e.g. Physics" 
                  required 
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Semester</label>
                <select name="semester" onChange={handleChange}>
                  {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea 
                name="description" 
                placeholder="Briefly describe what these notes cover..." 
                rows="3"
                onChange={handleChange}
              />
            </div>

            <div 
              className={`file-drop-zone ${file ? 'has-file' : ''}`}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input 
                type="file" 
                id="fileInput" 
                hidden 
                accept=".pdf" 
                onChange={handleFileChange} 
              />
              {file ? (
                <div className="file-info">
                  <FileText size={40} className="pdf-icon" />
                  <div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="drop-content">
                  <Upload size={40} />
                  <p>Click to select PDF or drag and drop</p>
                  <span>Only PDF files are supported</span>
                </div>
              )}
            </div>

            {uploading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="progress-fill"
                  />
                </div>
                <p>Uploading... {Math.round(progress)}%</p>
              </div>
            )}

            {status === 'success' && (
              <div className="status-box success">
                <CheckCircle size={20} /> Success! Redirecting to vault...
              </div>
            )}
            
            {status === 'error' && (
              <div className="status-box error">
                <AlertCircle size={20} /> Upload failed. Please try again.
              </div>
            )}

            <button 
              type="submit" 
              className="btn-upload-submit interactive"
              disabled={uploading || !file}
            >
              {uploading ? <Loader2 className="spinning" /> : 'Publish Notes'}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .upload-page {
          display: flex;
          justify-content: center;
          padding-top: 120px;
        }
        .upload-container {
          width: 100%;
          max-width: 700px;
        }
        .upload-card {
          padding: 40px;
        }
        .upload-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .icon-box {
          width: 60px;
          height: 60px;
          background: rgba(0, 242, 254, 0.1);
          color: var(--primary);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        label {
          color: var(--text-dim);
          font-size: 0.9rem;
          font-weight: 500;
        }
        input, select, textarea {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 15px;
          border-radius: 10px;
          color: white;
          font-family: inherit;
        }
        .file-drop-zone {
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 40px;
          text-align: center;
          transition: var(--transition);
          cursor: none;
        }
        .file-drop-zone:hover, .file-drop-zone.has-file {
          border-color: var(--primary);
          background: rgba(0, 242, 254, 0.05);
        }
        .drop-content {
          color: var(--text-dim);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .file-info {
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
        }
        .pdf-icon { color: var(--primary); }
        .file-name { font-weight: 600; color: var(--text-main); }
        .file-size { font-size: 0.8rem; color: var(--text-dim); }

        .progress-container {
          margin-top: 10px;
        }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary);
        }

        .status-box {
          padding: 15px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }
        .status-box.success { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .status-box.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .btn-upload-submit {
          padding: 15px;
          background: linear-gradient(45deg, var(--primary), var(--secondary));
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.3);
          display: flex;
          justify-content: center;
        }
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
      `}</style>
    </div>
  );
};

export default UploadPage;
