import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DONOR'); // Default role
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Pass requested role to login to simulate validation
      const user = await login(email, password, role);
      navigate(`/dashboard/${user.role.toLowerCase()}`);
    } catch (err) {
      setError('Invalid credentials for this role. Check system settings.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-20 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 lg:p-12 border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">System Access</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic mb-8">HemoLink Enterprise v2.4</p>
          
          {/* Role Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
             {['DONOR', 'HOSPITAL', 'ADMIN'].map(r => (
               <button
                 key={r}
                 onClick={() => setRole(r)}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   role === r ? 'bg-white text-red-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {r}
               </button>
             ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Secure Email</label>
            <input 
              type="email" 
              required
              placeholder="name@domain.com"
              className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-red-500 transition-all outline-none font-bold text-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Access Key</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-red-500 transition-all outline-none font-bold text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 text-sm uppercase tracking-widest group active:scale-[0.98]"
          >
            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /> 
            Enter {role} Portal
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            New to the Network? <Link to="/signup" className="text-red-600 hover:underline">Register Node</Link>
          </p>
          <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-300">
             <span>JPA SECURED</span>
             <span>•</span>
             <span>SSL TUNNEL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
