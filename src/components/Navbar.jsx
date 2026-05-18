import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, User, LogOut, Menu, X, Bell, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.id) {
       const fetchNotifications = async () => {
         try {
           const res = await axios.get(`/api/notifications/user/${user.id}`);
           setNotifications(res.data);
         } catch (err) {
           // Simulation
           if (user.role === 'DONOR') {
              setNotifications([
                { id: 1, message: 'Emergency Alert: O+ needed near you!', type: 'EMERGENCY' }
              ]);
           }
         }
       };
       fetchNotifications();
       const interval = setInterval(fetchNotifications, 30000);
       return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <Droplet className="text-white" fill="white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">HemoLink</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-red-600 font-medium transition-colors">Home</Link>
            {user ? (
              <>
                <Link to={`/dashboard/${user.role?.toLowerCase()}`} className="text-slate-600 hover:text-red-600 font-medium transition-colors">Dashboard</Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors relative"
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse border-2 border-white"></span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 overflow-hidden"
                      >
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Recent Alerts</h4>
                         <div className="space-y-2">
                           {notifications.length > 0 ? notifications.map(n => (
                             <div key={n.id} className="p-3 bg-slate-50 rounded-xl flex gap-3 hover:bg-red-50 transition-colors group">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0 self-start">
                                   <ShieldAlert size={14} />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-slate-800 leading-tight mb-1">{n.message}</p>
                                   <button className="text-[10px] font-black text-red-600 uppercase">View Request</button>
                                </div>
                             </div>
                           )) : (
                             <div className="text-center py-6 text-slate-400 text-xs italic">No new notifications</div>
                           )}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User size={16} className="text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{user.displayName || user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-red-600 font-medium transition-colors">Login</Link>
                <Link to="/signup" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 flex flex-col gap-4 shadow-xl"
        >
          <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-red-600 font-medium py-2 border-b border-slate-100">Home</Link>
          {user ? (
            <>
              <Link to={`/dashboard/${user.role?.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-red-600 font-medium py-2 border-b border-slate-100">Dashboard</Link>
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="text-left text-red-600 font-medium py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-red-600 font-medium py-2 border-b border-slate-100">Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-red-600 text-white text-center px-5 py-2 rounded-full font-semibold">Sign Up</Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}
