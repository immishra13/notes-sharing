import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, "notes"), orderBy("uploadDate", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(notesData);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filters = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Business'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || note.subject === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container dashboard">
      <header className="dash-header">
        <div className="welcome-text">
          <h1>Student <span className="gradient-text">Vault</span></h1>
          <p>Your personalized cloud notes explorer.</p>
        </div>
        <Link to="/upload" className="btn-upload-new neon-glow interactive">
          <Plus size={20} /> Upload New Notes
        </Link>
      </header>

      {/* Stats Section */}
      <section className="stats-row">
        <div className="stat-card glass-card">
          <BookOpen className="stat-icon" />
          <div>
            <h3>1,240</h3>
            <p>Notes Available</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <Clock className="stat-icon" />
          <div>
            <h3>34k</h3>
            <p>Downloads Today</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <TrendingUp className="stat-icon" />
          <div>
            <h3>Top</h3>
            <p>AI & ML Notes</p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="controls-row">
        <div className="search-box glass-card">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, subject, or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filters-list">
          {filters.map(f => (
            <button 
              key={f}
              className={`filter-chip ${selectedFilter === f ? 'active' : ''} glass-card interactive`}
              onClick={() => setSelectedFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="big-loader"
          />
          <p>Scanning Cloud Database...</p>
        </div>
      ) : (
        <section className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
          {filteredNotes.length === 0 && (
            <div className="empty-state">
              <p>No notes found matching your criteria.</p>
            </div>
          )}
        </section>
      )}

      <style jsx>{`
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 50px;
        }
        .welcome-text h1 { font-size: 2.5rem; margin-bottom: 8px; }
        .welcome-text p { color: var(--text-dim); font-size: 1.1rem; }

        .btn-upload-new {
          padding: 12px 24px;
          background: var(--primary);
          color: var(--bg-dark);
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: var(--transition);
        }
        .btn-upload-new:hover { transform: translateY(-3px) scale(1.05); }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 50px;
        }
        .stat-card {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .stat-icon { color: var(--primary); width: 32px; height: 32px; }
        .stat-card h3 { font-size: 1.5rem; color: var(--text-main); }
        .stat-card p { font-size: 0.8rem; color: var(--text-dim); }

        .controls-row {
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .search-box {
          display: flex;
          align-items: center;
          padding: 5px 20px;
          border-radius: 15px;
        }
        .search-icon { color: var(--text-dim); }
        .search-box input {
          width: 100%;
          padding: 15px;
          background: none;
          border: none;
          color: white;
          font-size: 1rem;
          outline: none;
        }
        .filters-list {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 10px;
        }
        .filter-chip {
          padding: 8px 20px;
          white-space: nowrap;
          border-radius: 50px;
          font-size: 0.9rem;
          color: var(--text-dim);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .filter-chip.active {
          background: var(--primary);
          color: var(--bg-dark);
          border-color: var(--primary);
          font-weight: 700;
        }

        .loader-container {
          text-align: center;
          padding: 100px 0;
          color: var(--text-dim);
        }
        .big-loader {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 242, 254, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          margin: 0 auto 20px;
        }
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px;
          color: var(--text-dim);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
