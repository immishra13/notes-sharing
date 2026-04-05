import React from 'react';
import { Cloud, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer glass-card">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <Cloud size={24} className="logo-icon" />
            <span>Cloud<span className="gradient-text">Notes</span></span>
          </div>
          <p className="footer-desc">
            Empowering students with a futuristic cloud-based note sharing platform.
            Learn, share, and grow together.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/explorer">Explorer</a></li>
            <li><a href="/upload">Upload</a></li>
            <li><a href="/profile">Dashboard</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <div className="social-links">
            <a href="#"><Github size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 CloudNotes Hub. All Rights Reserved.</p>
        <p>Built for the Future of Education.</p>
      </div>
    </footer>
  );
};

export default Footer;
