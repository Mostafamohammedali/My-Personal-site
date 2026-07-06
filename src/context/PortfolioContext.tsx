import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Project, Skill, Service, Message, PortfolioSettings } from '../types';
import { seedDatabaseIfEmpty } from '../lib/seed';

interface PortfolioContextProps {
  settings: PortfolioSettings | null;
  projects: Project[];
  skills: Skill[];
  services: Service[];
  messages: Message[];
  loading: boolean;
  user: User | null;
  authLoading: boolean;
  resumeModalOpen: boolean;
  openResumeModal: () => void;
  closeResumeModal: () => void;
  refreshData: () => Promise<void>;
  updateSettings: (updated: PortfolioSettings) => Promise<void>;
  
  // Projects CRUD
  createProject: (p: Omit<Project, 'id'>) => Promise<void>;
  editProject: (id: string, p: Partial<Project>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  
  // Skills CRUD
  createSkill: (s: Omit<Skill, 'id'>) => Promise<void>;
  editSkill: (id: string, s: Partial<Skill>) => Promise<void>;
  removeSkill: (id: string) => Promise<void>;
  
  // Services CRUD
  createService: (s: Omit<Service, 'id'>) => Promise<void>;
  editService: (id: string, s: Partial<Service>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  
  // Contact Message Action
  submitContactMessage: (m: Omit<Message, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  fetchMessages: () => Promise<void>;
  removeMessage: (id: string) => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeSection: number;
  setActiveSection: (section: number) => void;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // Default theme
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  // Open / Close Resume Modal
  const openResumeModal = () => setResumeModalOpen(true);
  const closeResumeModal = () => setResumeModalOpen(false);

  // Fetch Public Portfolio Data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Run Database Seeder
      await seedDatabaseIfEmpty();

      // Fetch all collections concurrently to maximize speed and remove query-waterfall delays
      const settingsDocRef = doc(db, 'portfolio_settings', 'settings');
      const [settingsSnap, projectsSnap, skillsSnap, servicesSnap] = await Promise.all([
        getDoc(settingsDocRef),
        getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'skills')),
        getDocs(collection(db, 'services'))
      ]);

      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data() as PortfolioSettings);
      }

      const projectsList: Project[] = [];
      projectsSnap.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(projectsList);

      const skillsList: Skill[] = [];
      skillsSnap.forEach((doc) => {
        skillsList.push({ id: doc.id, ...doc.data() } as Skill);
      });
      setSkills(skillsList);

      const servicesList: Service[] = [];
      servicesSnap.forEach((doc) => {
        servicesList.push({ id: doc.id, ...doc.data() } as Service);
      });
      setServices(servicesList);

    } catch (error) {
      console.error("Error loading portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Messages for Admin
  const fetchMessages = async () => {
    if (!user) return;
    try {
      const messagesSnap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
      const messagesList: Message[] = [];
      messagesSnap.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesList);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Track Auth State Change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        fetchMessages();
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Initial Fetch
  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Actions
  const updateSettings = async (updated: PortfolioSettings) => {
    try {
      await setDoc(doc(db, 'portfolio_settings', 'settings'), updated);
      setSettings(updated);
    } catch (err) {
      console.error("Error updating settings:", err);
      throw err;
    }
  };

  const createProject = async (p: Omit<Project, 'id'>) => {
    try {
      const pWithTime = { ...p, createdAt: Date.now() };
      const docRef = await addDoc(collection(db, 'projects'), pWithTime);
      setProjects(prev => [{ id: docRef.id, ...pWithTime } as Project, ...prev]);
    } catch (err) {
      console.error("Error creating project:", err);
      throw err;
    }
  };

  const editProject = async (id: string, p: Partial<Project>) => {
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, p);
      setProjects(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
    } catch (err) {
      console.error("Error editing project:", err);
      throw err;
    }
  };

  const removeProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      throw err;
    }
  };

  const createSkill = async (s: Omit<Skill, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'skills'), s);
      setSkills(prev => [...prev, { id: docRef.id, ...s } as Skill]);
    } catch (err) {
      console.error("Error creating skill:", err);
      throw err;
    }
  };

  const editSkill = async (id: string, s: Partial<Skill>) => {
    try {
      const docRef = doc(db, 'skills', id);
      await updateDoc(docRef, s);
      setSkills(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
    } catch (err) {
      console.error("Error editing skill:", err);
      throw err;
    }
  };

  const removeSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      setSkills(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting skill:", err);
      throw err;
    }
  };

  const createService = async (s: Omit<Service, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'services'), s);
      setServices(prev => [...prev, { id: docRef.id, ...s } as Service]);
    } catch (err) {
      console.error("Error creating service:", err);
      throw err;
    }
  };

  const editService = async (id: string, s: Partial<Service>) => {
    try {
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, s);
      setServices(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
    } catch (err) {
      console.error("Error editing service:", err);
      throw err;
    }
  };

  const removeService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
      throw err;
    }
  };

  const submitContactMessage = async (m: Omit<Message, 'id' | 'createdAt' | 'status'>) => {
    try {
      const fullMessage = {
        ...m,
        createdAt: Date.now(),
        status: 'unread'
      };
      await addDoc(collection(db, 'messages'), fullMessage);
    } catch (err) {
      console.error("Error sending contact message:", err);
      throw err;
    }
  };

  const removeMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider value={{
      settings,
      projects,
      skills,
      services,
      messages,
      loading,
      user,
      authLoading,
      resumeModalOpen,
      openResumeModal,
      closeResumeModal,
      refreshData: fetchData,
      updateSettings,
      createProject,
      editProject,
      removeProject,
      createSkill,
      editSkill,
      removeSkill,
      createService,
      editService,
      removeService,
      submitContactMessage,
      fetchMessages,
      removeMessage,
      theme,
      toggleTheme,
      activeSection,
      setActiveSection
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
