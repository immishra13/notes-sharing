import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cloud, Upload, Download, Users, ArrowRight } from 'lucide-react';
import NoteCard from '../components/NoteCard';

const LandingPage = () => {
  const featuredNotes = [
    { title: 'Data Structures 101', subject: 'Computer Science', semester: '3rd', uploadedBy: 'Ankur', uploadDate: 'Mar 2026', downloads: 124, fileURL: '#' },
    { title: 'Neural Networks Basics', subject: 'AI & ML', semester: '6th', uploadedBy: 'Smit', uploadDate: 'Feb 2026', downloads: 89, fileURL: '#' },
    { title: 'Modern Web Arch', subject: 'Cloud Computing', semester: '5th', uploadedBy: 'Raj', uploadDate: 'Jan 2026', downloads: 256, fileURL: '#' },
  ];

  const features = [
    { icon: <Upload size={32} />, title: "Quick Upload", desc: "Share your knowledge with the community in seconds." },
    { icon: <Download size={32} />, title: "Instant Download", desc: "Access premium notes from top students across campus." },
    { icon: <Users size={32} />, title: "Community Driven", desc: "Join thousands of students learning together." },
  ];

  return (
    <div className="page-container landing">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <div className="badge neon-glow">The Future of Learning</div>
          <h1 className="hero-title">
            Cloud <span className="gradient-text">Notes</span> Hub
          </h1>
          <p className="hero-subtitle">
            Next-generation decentralized student notes ecosystem. 
            Upload, browse, and master your subjects with AI-powered accessibility.
          </p>
          <div className="hero-btns">
            <Link to="/explorer" className="btn-primary interactive">
              Explore Notes <ArrowRight size={20} />
            </Link>
            <Link to="/auth" className="btn-secondary interactive">
              Get Started
            </Link>
          </div>
        </motion.div>

        {/* 3D Floating Elements */}
        <div className="floating-icons">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="icon-orb orb-1"
          ><Cloud size={40} /></motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="icon-orb orb-2"
          ><Download size={30} /></motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-grid">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="feature-card glass-card"
          >
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Notes Section */}
      <section className="featured-notes">
        <h2 className="section-title">Trending <span className="gradient-text">Notes</span></h2>
        <div className="notes-grid">
          {featuredNotes.map((note, i) => (
            <NoteCard key={i} note={note} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
