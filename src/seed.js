import { db } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const sampleNotes = [
  {
    title: "Quantum Physics: Wave-Particle Duality",
    subject: "Physics",
    semester: "5th",
    description: "Detailed notes on Schrodinger's equation and photon behavior.",
    fileURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    uploadedBy: "Prof. Einstein",
    uploadDate: "Mar 2026",
    downloads: 1450,
    uploadedByUid: "system_generated"
  },
  {
    title: "Data Structures & Algorithms in C++",
    subject: "Computer Science",
    semester: "3rd",
    description: "Complete guide to Trees, Graphs, and Hashmaps with complexity analysis.",
    fileURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    uploadedBy: "Ankur Mishra",
    uploadDate: "Apr 2026",
    downloads: 890,
    uploadedByUid: "system_generated"
  },
  {
    title: "Organic Chemistry: Synthesis Mechanisms",
    subject: "Chemistry",
    semester: "4th",
    description: "Reaction pathways for aromatic compounds and nucleophilic substitutions.",
    fileURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    uploadedBy: "Dr. Sharma",
    uploadDate: "Feb 2026",
    downloads: 320,
    uploadedByUid: "system_generated"
  },
  {
    title: "Blockchain & Decentralized Apps",
    subject: "Computer Science",
    semester: "7th",
    description: "How Ethereum works, smart contracts, and Web3 architecture.",
    fileURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    uploadedBy: "CryptoKing",
    uploadDate: "Jan 2026",
    downloads: 2100,
    uploadedByUid: "system_generated"
  },
  {
    title: "Advanced Statistics for Data Science",
    subject: "Mathematics",
    semester: "6th",
    description: "Probability distributions, hypothesis testing, and regression models.",
    fileURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    uploadedBy: "StatMaster",
    uploadDate: "May 2026",
    downloads: 560,
    uploadedByUid: "system_generated"
  }
];

export const seedDatabase = async () => {
  console.log("Seeding database...");
  for (const note of sampleNotes) {
    try {
      await addDoc(collection(db, "notes"), note);
      console.log(`Added: ${note.title}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  console.log("Seeding complete!");
};
