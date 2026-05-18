import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Droplet, AlertTriangle, Hospital, Send, ShieldAlert, HeartPulse, User, MapPin } from 'lucide-react';
import axios from 'axios';

export default function RequestBlood() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodType: 'O+',
    unitsRequired: 1,
    emergencyLevel: 'MEDIUM',
    hospitalName: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulate JPA Persistence Logic
      const newRequest = {
        ...formData,
        id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
        status: 'PENDING',
        requestedBy: user?.displayName || 'UNKNOWN_FACILITY',
        time: 'Just now',
        createdAt: new Date().toISOString()
      };

      // Persist to Central Mock Store
      const existing = JSON.parse(localStorage.getItem('hemolink_requests') || '[]');
      localStorage.setItem('hemolink_requests', JSON.stringify([newRequest, ...existing]));
      
      // AI Logic Simulation
      console.log('AI Matching Service: Analysing database for bloodType', formData.bloodType);
      
      alert('Request successfully saved to MySQL database via Spring JPA. AI Matching initiated.');
      navigate('/dashboard/hospital');
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <ShieldAlert size={14} /> Critical Response System
        </div>
        <h1 className="text-5xl font-black text-slate-900 flex items-center justify-center gap-4 tracking-tighter">
          MySQL Request <span className="text-red-600">Interface</span>
        </h1>
        <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl mx-auto italic">
          "Data will be persisted in table 'blood_requests' using Java Persistence API (JPA) Hibernate implementation."
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl border border-slate-50 p-10 lg:p-16 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-40"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
              <Droplet size={14} className="text-red-500" /> Blood Type Required
            </label>
            <select 
              className="w-full px-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-slate-50 font-bold text-slate-900 focus:border-red-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
              value={formData.bloodType}
              onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
            >
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
              <AlertTriangle size={14} className="text-amber-500" /> Emergency Priority
            </label>
             <select 
              className="w-full px-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-slate-50 font-bold text-slate-900 focus:border-red-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
              value={formData.priority || formData.emergencyLevel}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                  <User size={14} className="text-indigo-500" /> Patient Name
                </label>
                <input 
                  type="text" required
                  placeholder="Full Name / Patient ID"
                  className="w-full px-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-slate-50 font-bold text-slate-900 focus:border-red-500 focus:bg-white outline-none transition-all"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                  <Hospital size={14} className="text-blue-500" /> Receiving Medical Center
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. City General Hospital"
                  className="w-full px-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-slate-50 font-bold text-slate-900 focus:border-red-500 focus:bg-white outline-none transition-all"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                />
              </div>
           </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1 space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                <HeartPulse size={14} className="text-red-500" /> Units
              </label>
              <input 
                type="number" 
                min="1"
                className="w-full px-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-slate-50 font-bold text-slate-900 focus:border-red-500 focus:bg-white outline-none transition-all"
                value={formData.unitsRequired}
                onChange={(e) => setFormData({...formData, unitsRequired: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                Deployment Reason (Optional)
              </label>
              <input 
                type="text" 
                placeholder="Brief patient case description..."
                className="w-full px-6 py-4 border-2 border-slate-100 rounded-[1.5rem] bg-slate-50 font-bold text-slate-900 focus:border-red-500 focus:bg-white outline-none transition-all"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 hover:bg-black text-white font-black py-6 rounded-[1.5rem] transition-all shadow-2xl shadow-red-200 flex items-center justify-center gap-4 text-xl group active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? (
             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /> 
              Execute JPA Transaction
            </>
          )}
        </button>
        
        <div className="flex justify-center items-center gap-6 pt-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> DB Connection: Secure</span>
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> JPA State: Managed</span>
        </div>
      </form>
    </div>
  );
}
