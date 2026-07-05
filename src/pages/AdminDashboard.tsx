import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Briefcase, 
  Code, 
  Mail, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Check, 
  X, 
  ArrowUpRight,
  User,
  Sliders,
  Sparkles,
  Inbox
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { auth } from '../lib/firebase';
import { Project, Skill, Service, PortfolioSettings, SkillCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    settings, 
    projects, 
    skills, 
    services, 
    messages, 
    loading, 
    user, 
    authLoading,
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
    fetchMessages,
    removeMessage
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'settings' | 'projects' | 'skills' | 'messages'>('settings');

  // Form State trackers
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Settings Temp Form State
  const [settingsForm, setSettingsForm] = useState<PortfolioSettings | null>(null);

  // Projects Modals/Forms State
  const [projectEditorOpen, setProjectEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null); // Null if creating
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    image: '',
    technologies: '',
    features: '',
    challenges: '',
    liveUrl: 'https://github.com',
    codeUrl: 'https://github.com',
    featured: true
  });

  // Skills Temp State
  const [newSkillForm, setNewSkillForm] = useState({ name: '', category: 'frontend' as SkillCategory, level: 80 });
  
  // Services Temp State
  const [newServiceForm, setNewServiceForm] = useState({ title: '', description: '', features: '' });

  // Guard routing
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Sync settings form once settings load
  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  // Sync messages
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    setSaveStatus("saving");
    try {
      await updateSettings(settingsForm);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Projects Operations
  const openNewProjectForm = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      category: 'Web Applications Development',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      technologies: 'React, TypeScript, Tailwind, Node',
      features: 'Modular Layout, Responsive design, Theme configs',
      challenges: 'Optimizing high-frequency render triggers on client canvas.',
      liveUrl: 'https://github.com',
      codeUrl: 'https://github.com',
      featured: true
    });
    setProjectEditorOpen(true);
  };

  const openEditProjectForm = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      image: proj.image,
      technologies: proj.technologies.join(', '),
      features: proj.features.join(', '),
      challenges: proj.challenges || '',
      liveUrl: proj.liveUrl,
      codeUrl: proj.codeUrl,
      featured: proj.featured
    });
    setProjectEditorOpen(true);
  };

  const handleProjectFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      title: projectForm.title,
      description: projectForm.description,
      category: projectForm.category,
      image: projectForm.image,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
      features: projectForm.features.split(',').map(f => f.trim()).filter(Boolean),
      challenges: projectForm.challenges,
      liveUrl: projectForm.liveUrl,
      codeUrl: projectForm.codeUrl,
      featured: projectForm.featured
    };

    try {
      if (editingProject) {
        await editProject(editingProject.id, formatted);
      } else {
        await createProject(formatted);
      }
      setProjectEditorOpen(false);
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  // Skills Operations
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillForm.name) return;
    try {
      await createSkill(newSkillForm);
      setNewSkillForm({ name: '', category: 'frontend', level: 80 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkillLevelUpdate = async (id: string, newLevel: number) => {
    try {
      await editSkill(id, { level: newLevel });
    } catch (err) {
      console.error(err);
    }
  };

  // Services Operations
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.title) return;
    try {
      const splitFeatures = newServiceForm.features.split(',').map(f => f.trim()).filter(Boolean);
      await createService({
        title: newServiceForm.title,
        description: newServiceForm.description,
        features: splitFeatures
      });
      setNewServiceForm({ title: '', description: '', features: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || (loading && !settingsForm)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#0084FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* DASHBOARD NAVIGATION COLUMN (SIDEBAR) */}
      <div className="w-full md:w-64 bg-neutral-50 border-b md:border-b-0 md:border-r border-black/5 flex flex-col justify-between p-6 shrink-0 text-left pt-24 md:pt-10">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-sans font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0084FF]" />
              <span>SaaS Control</span>
            </h2>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-1 block font-bold">Owner Workspace</span>
          </div>

          <nav className="flex flex-col gap-1 text-sm">
            {/* Settings Tab */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 rounded-xl font-bold flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-[#0084FF] text-white shadow-md' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
              }`}
            >
              <SettingsIcon className="w-4.5 h-4.5" />
              <span>General Settings</span>
            </button>

            {/* Projects Tab */}
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-3 rounded-xl font-bold flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'projects' 
                  ? 'bg-[#0084FF] text-white shadow-md' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
              }`}
            >
              <Briefcase className="w-4.5 h-4.5" />
              <span>Projects Portfolio</span>
            </button>

            {/* Skills / Services Tab */}
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-3 rounded-xl font-bold flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'skills' 
                  ? 'bg-[#0084FF] text-white shadow-md' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
              }`}
            >
              <Code className="w-4.5 h-4.5" />
              <span>Skills & Services</span>
            </button>

            {/* Messages Tab */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-3 rounded-xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'messages' 
                  ? 'bg-[#0084FF] text-white shadow-md' 
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5" />
                <span>Inbox Messages</span>
              </div>
              {messages.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {messages.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* User Info & Signout */}
        <div className="border-t border-black/5 pt-6 mt-6 flex flex-col gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#0084FF]/5 border border-[#0084FF]/10 flex items-center justify-center text-[#0084FF] font-bold font-mono text-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-800 tracking-tight">Admin System</span>
              <span className="text-[9px] font-mono text-emerald-600 mt-0.5 font-bold">Secure Session</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-black/5 hover:bg-red-500/5 text-neutral-600 hover:text-red-600 text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-black/5 hover:border-red-500/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Control</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD CONTENT WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 text-left overflow-y-auto pt-10 md:pt-20">
        
        {/* TAB 1: GENERAL SETTINGS */}
        {activeTab === 'settings' && settingsForm && (
          <div className="max-w-3xl flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-display font-black text-neutral-900 tracking-tight">General Website Settings</h1>
              <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest font-bold">Update biography, phone, emails, and statistics</p>
            </div>

            <form onSubmit={handleSettingsSave} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full name */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Owner Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>

                {/* Professional Title */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Professional Title</label>
                  <input
                    type="text"
                    value={settingsForm.title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>

                {/* Country */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Country Location</label>
                  <input
                    type="text"
                    value={settingsForm.country}
                    onChange={(e) => setSettingsForm({ ...settingsForm, country: e.target.value })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>

                {/* City HQ location */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Operational Location</label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Direct Email Address</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Direct Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>
              </div>

              {/* Intro summary */}
              <div className="flex flex-col gap-1 text-xs">
                <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Landing Hero Intro Short</label>
                <input
                  type="text"
                  value={settingsForm.intro}
                  onChange={(e) => setSettingsForm({ ...settingsForm, intro: e.target.value })}
                  className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                />
              </div>

              {/* Biography long text */}
              <div className="flex flex-col gap-1 text-xs">
                <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Biography Description (Long)</label>
                <textarea
                  rows={4}
                  value={settingsForm.bio}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                  className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] resize-none font-semibold"
                />
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-black/5">
                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Experience years</label>
                  <input
                    type="number"
                    value={settingsForm.yearsOfExperience}
                    onChange={(e) => setSettingsForm({ ...settingsForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Completed Projects</label>
                  <input
                    type="number"
                    value={settingsForm.completedProjects}
                    onChange={(e) => setSettingsForm({ ...settingsForm, completedProjects: parseInt(e.target.value) || 0 })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Mastered Stacks</label>
                  <input
                    type="number"
                    value={settingsForm.masteredTechs}
                    onChange={(e) => setSettingsForm({ ...settingsForm, masteredTechs: parseInt(e.target.value) || 0 })}
                    className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                  />
                </div>
              </div>

              {/* Career Goals */}
              <div className="flex flex-col gap-1 text-xs border-t border-black/5 pt-4">
                <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Career Focus & Goals (Resume)</label>
                <textarea
                  rows={3}
                  value={settingsForm.careerGoals}
                  onChange={(e) => setSettingsForm({ ...settingsForm, careerGoals: e.target.value })}
                  className="px-4 py-3 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] resize-none font-semibold"
                />
              </div>

              {/* Submit panel */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="px-6 py-3 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold text-sm transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveStatus === "saving" ? "Saving..." : "Save Settings"}</span>
                </button>

                {saveStatus === "success" && (
                  <span className="text-emerald-600 font-mono text-xs flex items-center gap-1.5 animate-pulse font-bold">
                    <Check className="w-4.5 h-4.5" />
                    <span>Settings deployed successfully!</span>
                  </span>
                )}
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: PROJECTS PORTFOLIO */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-display font-black text-neutral-900 tracking-tight">Manage Projects Portfolio</h1>
                <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest font-bold">Create, update, and remove structural projects</p>
              </div>

              <button
                onClick={openNewProjectForm}
                className="px-4 py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* List of projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 bg-neutral-50 border border-black/5 rounded-2xl flex items-start justify-between gap-4 group hover:border-[#0084FF]/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#0084FF] tracking-wider block font-bold">
                        {proj.category}
                      </span>
                      <h3 className="text-base font-sans font-black text-neutral-800 tracking-tight mt-1">
                        {proj.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-black/5 text-[9px] font-mono text-neutral-500 rounded font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditProjectForm(proj)}
                      className="p-2 text-neutral-400 hover:text-[#0084FF] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                      title="Edit Specifications"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                      title="Remove Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Creator/Editor Drawer Overlay */}
            {projectEditorOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-2xl bg-white border border-black/5 rounded-2xl p-6 md:p-8 relative shadow-2xl"
                >
                  <button
                    onClick={() => setProjectEditorOpen(false)}
                    className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-display font-black text-neutral-900 tracking-tight mb-6">
                    {editingProject ? "Edit Project Specifications" : "Create New Project Deployment"}
                  </h3>

                  <form onSubmit={handleProjectFormSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Category</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] font-semibold"
                        >
                          <option value="Web Development">Web Development</option>
                          <option value="Web Applications Development">Web Applications Development</option>
                          <option value="System Development">System Development</option>
                          <option value="Database Design">Database Design</option>
                          <option value="UI Development">UI Development</option>
                          <option value="AI Integration">AI Integration</option>
                          <option value="Automation Solutions">Automation Solutions</option>
                          <option value="Technical Consulting">Technical Consulting</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Cover Image Link</label>
                        <input
                          type="text"
                          required
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Technologies (Comma Separated)</label>
                        <input
                          type="text"
                          required
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                          className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] font-semibold"
                          placeholder="React, Redux, Node"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Project Description</label>
                      <textarea
                        rows={3}
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] resize-none font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Features Implemented (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        value={projectForm.features}
                        onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                        className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] font-semibold"
                        placeholder="Offline mode, Websocket stream"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Challenges Solved (Long description)</label>
                      <textarea
                        rows={2}
                        value={projectForm.challenges}
                        onChange={(e) => setProjectForm({ ...projectForm, challenges: e.target.value })}
                        className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] resize-none font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Live Demo Link</label>
                        <input
                          type="text"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-neutral-500 uppercase tracking-wider font-bold">Code Repository Link</label>
                        <input
                          type="text"
                          value={projectForm.codeUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, codeUrl: e.target.value })}
                          className="px-3 py-2.5 bg-black/5 border border-black/5 rounded-xl text-neutral-800 focus:outline-none focus:border-[#0084FF] font-semibold"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-left">
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={projectForm.featured}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        className="w-4 h-4 rounded bg-black/5 border border-black/10 accent-[#0084FF] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="featured-check" className="font-mono text-neutral-600 uppercase tracking-wider cursor-pointer select-none font-bold">
                        Display in Home Featured Section
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
                      <button
                        type="button"
                        onClick={() => setProjectEditorOpen(false)}
                        className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-black/5 text-neutral-800 rounded-xl cursor-pointer font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold rounded-xl cursor-pointer"
                      >
                        {editingProject ? "Update Specifications" : "Deploy Project"}
                      </button>
                    </div>

                  </form>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SKILLS AND SERVICES */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-300">
            
            {/* Column Left: Manage Skills */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-display font-black text-neutral-900 tracking-tight">Technical Skills</h1>
                <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest font-bold">Adjust level slider or add new core competencies</p>
              </div>

              {/* Skill Creator Form */}
              <form onSubmit={handleAddSkill} className="p-5 bg-neutral-50 border border-black/5 rounded-2xl flex flex-col gap-4 text-xs">
                <span className="font-mono text-neutral-400 uppercase tracking-widest block pb-2 border-b border-black/5 font-bold">Register New Competency</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Skill Name</label>
                    <input
                      type="text"
                      required
                      value={newSkillForm.name}
                      onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
                      className="px-3 py-2 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                      placeholder="e.g. Docker"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Category</label>
                    <select
                      value={newSkillForm.category}
                      onChange={(e) => setNewSkillForm({ ...newSkillForm, category: e.target.value as SkillCategory })}
                      className="px-3 py-2 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-bold"
                    >
                      <option value="languages">Languages</option>
                      <option value="frontend">Frontend Stack</option>
                      <option value="backend">Backend Stack</option>
                      <option value="databases">Databases</option>
                      <option value="ai">AI Technologies</option>
                      <option value="cloud">Cloud / Infrastructure</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="tools">Development Tools</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-left mt-2">
                  <div className="flex justify-between font-mono text-[10px] text-neutral-500 uppercase font-bold">
                    <span>Expertise Level</span>
                    <span>{newSkillForm.level}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={newSkillForm.level}
                    onChange={(e) => setNewSkillForm({ ...newSkillForm, level: parseInt(e.target.value) || 80 })}
                    className="w-full accent-[#0084FF] cursor-pointer h-1.5 bg-black/10 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Competency</span>
                </button>
              </form>

              {/* Skills Sliders Inventory */}
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 bg-neutral-50 border border-black/5 rounded-xl flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-neutral-800 tracking-tight">{skill.name}</span>
                        <span className="text-[9px] font-mono uppercase text-neutral-400 ml-2 font-bold">({skill.category})</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-[#0084FF] font-bold">{skill.level}%</span>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skill.level}
                      onChange={(e) => handleSkillLevelUpdate(skill.id, parseInt(e.target.value) || 80)}
                      className="w-full h-1 bg-black/10 rounded-lg accent-[#0084FF] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Column Right: Manage Services */}
            <div className="flex flex-col gap-6 text-left">
              <div>
                <h1 className="text-2xl font-display font-black text-neutral-900 tracking-tight">Provided Services</h1>
                <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest font-bold">Register services offered or adjust scope descriptions</p>
              </div>

              {/* Service Creator Form */}
              <form onSubmit={handleAddService} className="p-5 bg-neutral-50 border border-black/5 rounded-2xl flex flex-col gap-4 text-xs">
                <span className="font-mono text-neutral-400 uppercase tracking-widest block pb-2 border-b border-black/5 font-bold">Register New Service Offer</span>
                
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Service Title</label>
                  <input
                    type="text"
                    required
                    value={newServiceForm.title}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                    className="px-3 py-2 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                    placeholder="e.g. AI Integration"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newServiceForm.description}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                    className="px-3 py-2 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] resize-none font-semibold"
                    placeholder="Describe service outcomes..."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Scope Deliverables (Comma Separated)</label>
                  <input
                    type="text"
                    required
                    value={newServiceForm.features}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, features: e.target.value })}
                    className="px-3 py-2 bg-black/5 border border-black/5 rounded-xl text-neutral-800 text-sm focus:outline-none focus:border-[#0084FF] font-semibold"
                    placeholder="e.g. Token tracking, Semantic vectors"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-bold flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Service Offer</span>
                </button>
              </form>

              {/* Services List Grid */}
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {services.map((serv) => (
                  <div
                    key={serv.id}
                    className="p-5 bg-neutral-50 border border-black/5 rounded-xl flex justify-between items-start gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm tracking-tight">{serv.title}</h4>
                      <p className="text-neutral-500 text-xs mt-1 leading-relaxed font-semibold">{serv.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {serv.features.map((f, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-black/5 text-[9px] text-neutral-500 font-mono rounded font-bold">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => removeService(serv.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors p-1 shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: INBOX MESSAGES */}
        {activeTab === 'messages' && (
          <div className="max-w-4xl flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-display font-black text-neutral-900 tracking-tight">Inbox Messages</h1>
              <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest font-bold">Review incoming inquiries, requests, and consulting briefs</p>
            </div>

            {messages.length > 0 ? (
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-6 bg-neutral-50 border border-black/5 rounded-2xl flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-black/5 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-neutral-800 text-sm tracking-tight">{msg.name}</span>
                          <span className="text-[10px] font-mono text-[#0084FF] bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 uppercase font-bold">
                            {msg.subject}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500 font-sans block mt-1 font-semibold">{msg.email} | {msg.phone || "No Phone"}</span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs font-mono text-neutral-400 shrink-0 font-bold">
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                        <button
                          onClick={() => removeMessage(msg.id)}
                          className="p-1.5 bg-black/5 border border-black/5 hover:border-red-500/20 text-neutral-400 hover:text-red-500 rounded-lg transition-all cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line font-sans font-semibold">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-neutral-50 border border-black/5 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3">
                <Inbox className="w-10 h-10 text-neutral-400" />
                <span className="text-neutral-500 font-sans text-sm font-semibold">Inbox is empty. No messages registered.</span>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};
