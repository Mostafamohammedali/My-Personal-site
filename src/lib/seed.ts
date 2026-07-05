import { collection, getDocs, doc, setDoc, deleteDoc, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Project, Skill, Service, PortfolioSettings } from '../types';

const defaultSettings: PortfolioSettings = {
  name: "Mustafa Mohammed",
  title: "Information Technology Specialist & Developer",
  intro: "I specialize in building high-quality software applications, responsive websites, and robust database systems using clean, efficient code.",
  bio: "I am an Information Technology specialist with hands-on experience in developing software applications and websites, designing databases, and solving complex problems through clean and efficient code. I possess foundational knowledge of cybersecurity, strong analytical skills, and the ability to learn quickly and work effectively under pressure in collaborative environments.",
  specialties: [
    "Full-Stack Software & Web Development",
    "Database System Design & SQL Optimization",
    "Cybersecurity & Secure Systems",
    "RESTful API & Computer Vision Solutions"
  ],
  country: "Yemen",
  location: "Sana'a, Al-Zubairi Street",
  phone: "+967 772-459-066",
  email: "moqobaty323@gmail.com",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com/in/mustafa-mohammed-78871433b",
  twitterUrl: "https://twitter.com",
  resumeUrl: "#", // triggers CV modal
  yearsOfExperience: 4,
  completedProjects: 2,
  masteredTechs: 14,
  careerGoals: "Eager to leverage my technical expertise, contribute to innovative IT projects, and build a successful career in the technology industry."
};

const defaultSkills: Omit<Skill, 'id'>[] = [
  // Languages
  { name: "Python", category: "languages", level: 95 },
  { name: "JavaScript", category: "languages", level: 88 },
  { name: "SQL", category: "languages", level: 95 },
  { name: "HTML5", category: "languages", level: 95 },
  { name: "CSS3", category: "languages", level: 92 },
  { name: "C#", category: "languages", level: 75 },
  { name: "Java", category: "languages", level: 70 },

  // Frameworks & Libraries
  { name: "React", category: "frontend", level: 86 },
  { name: "Django", category: "backend", level: 94 },
  { name: "Django REST Framework", category: "backend", level: 91 },
  { name: "Flask", category: "backend", level: 85 },

  // Databases
  { name: "PostgreSQL", category: "databases", level: 88 },
  { name: "MySQL", category: "databases", level: 82 },
  { name: "SQLite", category: "databases", level: 88 },

  // Tools & Technologies
  { name: "Git", category: "tools", level: 90 },
  { name: "GitHub", category: "tools", level: 92 },
  { name: "REST APIs", category: "tools", level: 94 },
  { name: "VS Code", category: "tools", level: 95 },
  { name: "Linux OS", category: "tools", level: 82 },
  { name: "Windows OS", category: "tools", level: 90 },

  // Security (using cybersecurity category)
  { name: "Cybersecurity Foundations", category: "cybersecurity", level: 84 },
  { name: "Secure Systems & Database Auditing", category: "cybersecurity", level: 80 }
];

const defaultServices: Omit<Service, 'id'>[] = [
  {
    title: "Python & Django Backend Development",
    description: "Architecting high-performance backend platforms, RESTful APIs, and secure server applications utilizing Django and Flask.",
    features: ["Django & Flask architectures", "Custom RESTful API engineering", "Token-based OAuth & security design", "Structured clean code patterns"]
  },
  {
    title: "Frontend Web Development",
    description: "Crafting beautiful, modern, and lightning-fast user interfaces using React, Tailwind CSS, and semantic modern standards.",
    features: ["React component architecture", "Mobile-first responsive layouts", "Tailwind styling optimization", "State management with Redux/Context"]
  },
  {
    title: "Database Design & Optimization",
    description: "Designing robust, normalized schemas and writing high-efficiency SQL queries for transactional and analytical loads.",
    features: ["PostgreSQL & MySQL schemas", "Advanced database queries", "Relational constraints & indexes", "SQLite lightweight configurations"]
  },
  {
    title: "Computer Vision & AI Integration",
    description: "Integrating smart computer vision engines and machine learning capabilities into real-world server environments.",
    features: ["OpenCV image processing workflows", "Python-based analysis models", "Interactive camera stream captures", "Intelligent recommendation systems"]
  }
];

const defaultProjects: Omit<Project, 'id'>[] = [
  {
    title: "CarHistory",
    description: "A Django-based web application designed to provide vehicle history, maintenance records, and transparency for used car buyers through VIN-based tracking.",
    category: "System Development",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    technologies: ["React.js", "Django", "Django REST Framework", "PostgreSQL", "Redux", "NHTSA APIs"],
    features: [
      "Sub-second VIN-based decoding and specification indexing",
      "Detailed accident records and historic service log trackers",
      "Dynamic data visualizer displaying mileage progression and auction histories",
      "Integration with official external Automotive APIs (NHTSA)"
    ],
    challenges: "Resolving inconsistent data response formats from legacy vehicle registry APIs and compiling them into a unified, reliable schema.",
    liveUrl: "https://github.com",
    codeUrl: "https://github.com",
    featured: true
  },
  {
    title: "AI Image Analyzer",
    description: "A Flask-based web application designed to analyze uploaded or captured images using computer vision to provide detailed descriptions and similar content suggestions.",
    category: "AI Integration",
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800",
    technologies: ["Python", "Flask", "OpenCV", "Machine Learning", "HTML5", "CSS3"],
    features: [
      "Dynamic image upload and device camera stream capture integration",
      "Instant computer-vision based object detection and environment mapping",
      "Intelligent content suggestions and high-similarity visual catalogs",
      "Lightweight, eye-safe dark mode responsive canvas styling"
    ],
    challenges: "Optimizing the computer vision processing loop with OpenCV to deliver sub-second analysis responses on high-resolution image uploads.",
    liveUrl: "https://github.com",
    codeUrl: "https://github.com",
    featured: true
  }
];

export async function seedDatabaseIfEmpty() {
  try {
    // Check settings
    const settingsRef = collection(db, 'portfolio_settings');
    const settingsSnap = await getDocs(query(settingsRef, limit(1)));
    
    let isDefaultOrEmpty = settingsSnap.empty;

    if (!settingsSnap.empty) {
      const existingSettings = settingsSnap.docs[0].data() as PortfolioSettings;
      // If name is Alexander Wright, or any key field differs from our default, trigger re-seed to force update
      if (
        existingSettings.name !== defaultSettings.name ||
        existingSettings.phone !== defaultSettings.phone ||
        existingSettings.email !== defaultSettings.email ||
        existingSettings.location !== defaultSettings.location ||
        existingSettings.yearsOfExperience !== defaultSettings.yearsOfExperience ||
        existingSettings.completedProjects !== defaultSettings.completedProjects
      ) {
        console.log("Stale database settings detected. Overwriting with up-to-date Mustafa Mohammed's CV data...");
        isDefaultOrEmpty = true;
        
        // Clear old database collections to prevent duplicate skill/project entries
        const collectionsToClear = ['portfolio_settings', 'skills', 'services', 'projects'];
        for (const colName of collectionsToClear) {
          const snap = await getDocs(collection(db, colName));
          await Promise.all(snap.docs.map(doc => deleteDoc(doc.ref)));
        }
      }
    }

    if (isDefaultOrEmpty) {
      // Seed skills first
      console.log('Seeding skills...');
      await Promise.all(defaultSkills.map(async (skill) => {
        const newDocRef = doc(collection(db, 'skills'));
        await setDoc(newDocRef, skill);
      }));

      // Seed services
      console.log('Seeding services...');
      await Promise.all(defaultServices.map(async (service) => {
        const newDocRef = doc(collection(db, 'services'));
        await setDoc(newDocRef, service);
      }));

      // Seed projects
      console.log('Seeding projects...');
      await Promise.all(defaultProjects.map(async (project) => {
        const newDocRef = doc(collection(db, 'projects'));
        await setDoc(newDocRef, { ...project, createdAt: Date.now() });
      }));

      // Finally, seed portfolio settings to close the security gate
      console.log('Seeding portfolio settings...');
      await setDoc(doc(db, 'portfolio_settings', 'settings'), defaultSettings);

      console.log('Database seeded successfully with Mustafa Mohammed\'s CV data!');
    } else {
      console.log('Database already populated. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
