import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FileText, Download, User, Calendar, BookOpen } from 'lucide-react';

const NoteCard = ({ note }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="note-card glass-card interactive"
    >
      <div className="card-inner" style={{ transform: "translateZ(50px)" }}>
        <div className="card-header">
          <div className="icon-box neon-glow">
            <FileText size={24} />
          </div>
          <span className="semester-tag">{note.semester} Sem</span>
        </div>
        
        <h3 className="note-title">{note.title}</h3>
        <p className="note-subject"><BookOpen size={14} /> {note.subject}</p>
        
        <div className="note-meta">
          <div className="meta-item">
            <User size={14} /> <span>{note.uploadedBy}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} /> <span>{note.uploadDate}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="downloads">
            <Download size={16} /> {note.downloads || 0}
          </span>
          <a href={note.fileURL} target="_blank" rel="noopener noreferrer" className="btn-download">
            View / Download
          </a>
        </div>
      </div>

    </motion.div>
  );
};

export default NoteCard;
