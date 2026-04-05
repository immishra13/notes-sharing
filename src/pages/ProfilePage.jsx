import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut, Edit3, Trash2, FileText } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';

const ProfilePage = () => {
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchUserNotes = async () => {
      try {
        const q = query(collection(db, "notes"), where("uploadedByUid", "==", user.uid));
        const snapshot = await getDocs(q);
        setUserNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserNotes();
  }, [user, navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete these notes?")) {
      await deleteDoc(doc(db, "notes", id));
      setUserNotes(userNotes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="page-container profile-page">
      <div className="profile-header glass-card">
        <div className="profile-info">
          <div className="avatar-big neon-glow">
            {user?.displayName ? user.displayName[0] : <User size={40} />}
          </div>
          <div className="info-text">
            <h2>{user?.displayName || 'Cloud User'}</h2>
            <div className="meta-row">
              <span className="meta-item"><Mail size={16} /> {user?.email}</span>
              <span className="meta-item"><Calendar size={16} /> Joined Mar 2026</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-edit glass-card interactive"><Edit3 size={18} /> Edit Profile</button>
          <button onClick={handleLogout} className="btn-logout-alt interactive"><LogOut size={18} /> Logout</button>
        </div>
      </div>

      <section className="user-content">
        <div className="content-header">
          <h3>Your <span className="gradient-text">Uploads</span></h3>
          <p>Manage the knowledge you've contributed.</p>
        </div>

        {loading ? (
          <p>Loading your vault...</p>
        ) : (
          <div className="notes-grid">
            {userNotes.map(note => (
              <div key={note.id} className="note-manage-wrap">
                <NoteCard note={note} />
                <button 
                  onClick={() => handleDelete(note.id)} 
                  className="btn-delete-note interactive"
                  title="Delete Note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {userNotes.length === 0 && (
              <div className="empty-profile glass-card">
                <FileText size={48} className="empty-icon" />
                <p>You haven't uploaded any notes yet.</p>
                <button onClick={() => navigate('/upload')} className="btn-start-upload">Start Sharing</button>
              </div>
            )}
          </div>
        )}
      </section>

      <style jsx>{`
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 40px;
          margin-bottom: 60px;
        }
        .profile-info {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .avatar-big {
          width: 100px;
          height: 100px;
          background: rgba(0, 242, 254, 0.1);
          color: var(--primary);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          font-family: var(--font-hero);
        }
        .info-text h2 { font-size: 2rem; margin-bottom: 10px; }
        .meta-row { display: flex; gap: 20px; color: var(--text-dim); font-size: 0.9rem; }
        .meta-item { display: flex; align-items: center; gap: 8px; }

        .profile-actions { display: flex; gap: 15px; }
        .btn-edit {
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          border-radius: 12px;
          font-weight: 600;
        }
        .btn-logout-alt {
          padding: 12px 24px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          transition: var(--transition);
        }
        .btn-logout-alt:hover { background: #ef4444; color: white; }

        .content-header { margin-bottom: 40px; }
        .content-header h3 { font-size: 1.8rem; margin-bottom: 5px; }
        .content-header p { color: var(--text-dim); }

        .note-manage-wrap {
          position: relative;
        }
        .btn-delete-note {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(239, 68, 68, 0.8);
          color: white;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          opacity: 0;
          transform: scale(0.8);
          transition: var(--transition);
        }
        .note-manage-wrap:hover .btn-delete-note {
          opacity: 1;
          transform: scale(1);
        }

        .empty-profile {
          grid-column: 1 / -1;
          padding: 80px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          color: var(--text-dim);
        }
        .empty-icon { color: var(--primary); opacity: 0.5; }
        .btn-start-upload {
          margin-top: 10px;
          padding: 12px 30px;
          background: var(--primary);
          color: var(--bg-dark);
          border-radius: 10px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
