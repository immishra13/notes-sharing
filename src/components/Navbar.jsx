import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Menu, X, LogIn, User, Upload, Search, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Explorer', path: '/explorer', icon: <Search size={18} /> },
    { name: 'Upload', path: '/upload', icon: <Upload size={18} /> },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Cloud className="logo-icon" size={32} />
          </motion.div>
          <span>Cloud<span className="gradient-text">Notes</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links desktop">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="nav-link">
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          
          {user ? (
            <div className="user-profile-section">
              <Link to="/profile" className="profile-trigger glass-card interactive">
                <div className="avatar-small neon-glow">
                  {user.displayName ? user.displayName[0] : <User size={14} />}
                </div>
                <span className="user-name">{user.displayName || 'Account'}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout-minimal interactive" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-auth interactive">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-nav"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            {user ? (
              <div className="mobile-user-actions">
                <Link to="/profile" className="nav-link" onClick={() => setIsOpen(false)}>
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="btn-logout-mobile">Logout</button>
              </div>
            ) : (
              <Link to="/auth" className="btn-auth mobile" onClick={() => setIsOpen(false)}>
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;
