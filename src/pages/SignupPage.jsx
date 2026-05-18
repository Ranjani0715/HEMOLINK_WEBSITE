import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import axios from 'axios';

export default function SignupPage() {
  const location = useLocation();
  const defaultRole = location.state?.defaultRole || 'DONOR';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: defaultRole,
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    city: '',
    weight: '',
    medicalHistory: '',
    license: ''
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (step === 1 && (formData.role === 'DONOR' || formData.role === 'HOSPITAL')) {
      setStep(step + 1);
      return;
    }
    try {
      alert(`Account registered as ${formData.role}. Proceed to Login.`);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 lg:p-16 border border-slate-50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">
            {step === 1 ? 'Join the Network' : formData.role === 'HOSPITAL' ? 'Facility Registration' : 'Medical Profile'}
          </h1>
          <p className="text-slate-500 font-medium italic">
            {step === 1 ? 'Select your role to begin saving lives.' : 'Verification data required for JPA validation.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-8 relative z-10">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name / Hospital Name</label>
                  <input 
                    type="text" required
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-red-500 transition-all outline-none font-bold"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Email</label>
                  <input 
                    type="email" required
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-red-500 transition-all outline-none font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                  <input 
                    type="password" required
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-red-500 transition-all outline-none font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Global Role</label>
                  <select 
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-red-500 transition-all outline-none font-bold appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="DONOR">Private Donor Node</option>
                    <option value="HOSPITAL">Medical Facility / Bank</option>
                    <option value="RECIPIENT">Requesting Recipient</option>
                  </select>
                </div>
              </div>
            </div>
          ) : formData.role === 'HOSPITAL' ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-8">
                 Hospital License & Infrastructure Verification
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Facility License #</label>
                    <input 
                      type="text" required placeholder="HOSP-XXXX-XXXX"
                      className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold"
                      value={formData.license}
                      onChange={(e) => setFormData({...formData, license: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City Headquarters</label>
                    <input 
                      type="text" required
                      className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Emergency Capacity Statement</label>
                  <textarea 
                    placeholder="Describe your current donor capacity or unit requirements..."
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold h-24"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                  />
               </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-[10px] font-black text-red-600 uppercase tracking-widest mb-8">
                 Donor Health & Eligibility Profile
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Blood Group</label>
                    <select 
                      className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-white outline-none font-bold"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
                    <input 
                      type="number" required
                      className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Weight (kg)</label>
                    <input 
                      type="number" required
                      className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Medical Disclosures</label>
                  <textarea 
                    placeholder="List existing conditions or recent surgeries..."
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold h-24"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                  />
               </div>
            </motion.div>
          )}
          
          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 text-sm uppercase tracking-widest group active:scale-[0.98]"
          >
            {step === 1 && (formData.role === 'DONOR' || formData.role === 'HOSPITAL') ? 'Verify Security Context' : (
              <><UserPlus size={22} className="group-hover:rotate-12 transition-transform" /> Register System Node</>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-black text-slate-400 mt-10 uppercase tracking-widest">
          Node already active? <Link to="/login" className="text-red-600 hover:underline underline-offset-4 decoration-2">Secure Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
