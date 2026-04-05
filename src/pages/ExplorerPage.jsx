import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Grid, List, Sparkles } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const ExplorerPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const q = query(collection(db, "notes"), orderBy("uploadDate", "desc"));
        const snapshot = await getDocs(q);
        setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllNotes();
  }, []);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container explorer-page">
      <div className="explorer-hero">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="explorer-title-box"
        >
          <Compass className="explorer-icon neon-glow" size={32} />
          <h1>Global <span className="gradient-text">Explorer</span></h1>
          <p>Uncover the best knowledge shared by students around the globe.</p>
        </motion.div>

        <div className="search-bar-wrap glass-card">
          <Search className="search-icon" size={24} />
          <input 
            type="text" 
            placeholder="What would you like to learn today? (e.g. Physics, 5th Sem...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-search-glow">Search</button>
        </div>
      </div>

      <div className="explorer-controls">
        <div className="view-modes">
          <button className="btn-view active"><Grid size={18} /></button>
          <button className="btn-view"><List size={18} /></button>
        </div>
        <div className="result-count">
          <Sparkles size={16} /> <span>Found {filteredNotes.length} matching repositories</span>
        </div>
      </div>

      {loading ? (
        <div className="explorer-loading">
          <div className="dna-loader"></div>
          <p>Decrypting Cloud Data...</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="notes-grid"
        >
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </motion.div>
      )}

      <style jsx>{`
        .explorer-hero {
          text-align: center;
          padding: 60px 0;
          margin-bottom: 40px;
        }
        .explorer-title-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin-bottom: 40px;
        }
        .explorer-icon { color: var(--primary); }
        .explorer-hero h1 { font-size: 3rem; margin-bottom: 15px; }
        .explorer-hero p { color: var(--text-dim); font-size: 1.1rem; }

        .search-bar-wrap {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          padding: 8px 10px 8px 25px;
          border-radius: 20px;
        }
        .search-icon { color: var(--text-dim); }
        .search-bar-wrap input {
          flex: 1;
          background: none;
          border: none;
          padding: 15px;
          color: white;
          font-size: 1.1rem;
          outline: none;
        }
        .btn-search-glow {
          background: var(--primary);
          color: var(--bg-dark);
          padding: 12px 30px;
          border-radius: 12px;
          font-weight: 700;
          box-shadow: 0 0 15px var(--primary);
          transition: var(--transition);
        }
        .btn-search-glow:hover { transform: scale(1.05); }

        .explorer-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 0 10px;
        }
        .view-modes { display: flex; gap: 10px; }
        .btn-view {
          background: rgba(255,255,255,0.05);
          color: var(--text-dim);
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .btn-view.active {
          background: var(--primary);
          color: var(--bg-dark);
        }
        .result-count {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--primary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .explorer-loading {
          text-align: center;
          padding: 80px 0;
          color: var(--text-dim);
        }
        /* Custom Loader */
        .dna-loader {
          width: 40px;
          height: 40px;
          border: 4px solid var(--primary);
          border-right-color: transparent;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { from {transform: rotate(0deg)} to {transform: rotate(360deg)} }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
      `}</style>
    </div>
  );
};

export default ExplorerPage;
