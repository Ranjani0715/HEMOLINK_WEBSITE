import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Droplet, MapPin, History, Award, 
  Bell, Activity, Settings, LogOut, Menu, X, 
  Users, Hospital, ShieldCheck, Heart, Zap, Search,
  Package, BarChart3, Radio, ShieldAlert
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const donorLinks = [
    { name: 'Dashboard', path: '/dashboard/donor', icon: LayoutDashboard },
    { name: 'Emergency SOS', path: '/dashboard/donor/emergencies', icon: ShieldAlert },
    { name: 'Match Center', path: '/dashboard/donor/matches', icon: Radio },
    { name: 'Donation History', path: '/dashboard/donor/history', icon: History },
    { name: 'Nearby Radar', path: '/dashboard/donor/nearby', icon: MapPin },
    { name: 'Health Analytics', path: '/dashboard/donor/health', icon: Activity },
    { name: 'Rewards', path: '/dashboard/donor/rewards', icon: Award },
    { name: 'Settings', path: '/dashboard/donor/settings', icon: Settings },
  ];

  const hospitalLinks = [
    { name: 'Hospital Hub', path: '/dashboard/hospital', icon: LayoutDashboard },
    { name: 'Create Request', path: '/request-blood', icon: ShieldAlert },
    { name: 'Donor Responses', path: '/dashboard/hospital/responses', icon: Users },
    { name: 'Blood Inventory', path: '/dashboard/hospital/inventory', icon: Package },
    { name: 'Live Tracking', path: '/dashboard/hospital/tracking', icon: Radio },
    { name: 'Analytics', path: '/dashboard/hospital/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/dashboard/hospital/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Console', path: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Verification Queue', path: '/dashboard/admin/verify', icon: ShieldCheck },
    { name: 'User Management', path: '/dashboard/admin/users', icon: Users },
    { name: 'System Logs', path: '/dashboard/admin/logs', icon: Activity },
    { name: 'Global Analytics', path: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/dashboard/admin/settings', icon: Settings },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'DONOR': return donorLinks;
      case 'HOSPITAL': return hospitalLinks;
      case 'ADMIN': return adminLinks;
      case 'RECIPIENT': return donorLinks; // Standardizing recipient for now
      default: return [];
    }
  };

  const currentLinks = getLinks();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed inset-y-0 left-0 bg-slate-900 text-white z-50 flex flex-col shadow-2xl"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/50">
              <Droplet className="text-white" size={24} />
            </div>
            {isSidebarOpen && (
              <span className="font-black text-xl tracking-tighter">HEMOLINK</span>
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {currentLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative group ${
                  isActive 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} className={isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{link.name}</span>}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-6 bg-white/30 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl overflow-hidden">
             <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center flex-shrink-0 font-black text-xs">
                {user?.displayName?.[0] || 'U'}
             </div>
             {isSidebarOpen && (
               <div className="flex-1 min-w-0">
                  <div className="text-xs font-black truncate">{user?.displayName || 'User Session'}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase truncate">{user?.role}</div>
               </div>
             )}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}
      >
        {/* Top Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest hidden md:block">
                 Network Latency: <span className="text-green-500 font-black">12ms</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <button className="p-2 text-slate-400 hover:text-red-600 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
               </button>
               <div className="h-8 w-px bg-slate-100"></div>
               <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-black text-slate-900">{user?.displayName}</div>
                    <div className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Verified {user?.role}</div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 p-1">
                     <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-400"></div>
                  </div>
               </div>
            </div>
        </header>

        <div className="p-8">
           {children}
        </div>
      </main>
    </div>
  );
}

