import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, Hospital, ShieldAlert, Package, AlertCircle, Users, 
  Activity, Heart, Search, Zap, MapPin, RefreshCw, ChevronRight, 
  AlertTriangle, Radio, BarChart3, Plus, Settings, LogOut,
  Send, Brain, Compass, Clock, CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import axios from 'axios';

const inventoryData = [
  { group: 'O+', units: 45, status: 'STABLE' },
  { group: 'A+', units: 28, status: 'STABLE' },
  { group: 'B+', units: 12, status: 'LOW' },
  { group: 'O-', units: 4, status: 'CRITICAL' },
  { group: 'AB+', units: 18, status: 'STABLE' },
];

const usageTrend = [
  { day: 'Mon', usage: 12 },
  { day: 'Tue', usage: 19 },
  { day: 'Wed', usage: 15 },
  { day: 'Thu', usage: 22 },
  { day: 'Fri', usage: 30 },
  { day: 'Sat', usage: 10 },
  { day: 'Sun', usage: 8 },
];

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#6366f1'];

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeRequests, setActiveRequests] = useState([]);
  const [showBroadcast, setShowBroadcast] = useState(false);

  useEffect(() => {
    const loadRequests = () => {
      const saved = JSON.parse(localStorage.getItem('hemolink_requests') || '[]');
      // Filter for this hospital's requests or just show all for demo
      setActiveRequests([
        ...saved,
        { id: 'm1', bloodType: 'O-', priority: 'CRITICAL', patientName: 'Unknown (Trauma)', units: 4, arrival: '9m', status: 'EN_ROUTE', isMock: true },
        { id: 'm2', bloodType: 'AB+', priority: 'HIGH', patientName: 'Sarah Miller', units: 2, arrival: '15m', status: 'MATCHED', isMock: true },
      ]);
      setLoading(false);
    };

    loadRequests();
    // Listen for storage changes (for demo purposes if opened in multiple tabs)
    window.addEventListener('storage', loadRequests);
    return () => window.removeEventListener('storage', loadRequests);
  }, []);

  const handleBroadcast = (e) => {
    e.preventDefault();
    const type = e.target.bloodType.value;
    const priority = e.target.priority.value;
    
    const newReq = {
      id: `SOS-${Math.floor(Math.random() * 9000) + 1000}`,
      bloodType: type,
      priority: priority,
      patientName: 'BROADCAST ALERT',
      units: 5,
      arrival: 'SEARCHING',
      status: 'PENDING',
      requestedBy: user?.displayName || 'CENTRAL_COMMAND',
      createdAt: new Date().toISOString()
    };
    
    const saved = JSON.parse(localStorage.getItem('hemolink_requests') || '[]');
    localStorage.setItem('hemolink_requests', JSON.stringify([newReq, ...saved]));
    setActiveRequests(prev => [newReq, ...prev]);
    setShowBroadcast(false);
    alert(`Emergency Broadcast for ${type} sent to all nearby donors!`);
  };

  return (
    <div className="space-y-10">
      <AnimatePresence>
        {showBroadcast && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Radio size={200} />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Emergency <span className="text-red-600">Broadcast</span></h2>
               <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-10">Trigger geo-fenced SOS to all active donors</p>
               
               <form onSubmit={handleBroadcast} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Blood Group</label>
                        <select name="bloodType" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-red-500">
                           {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Level</label>
                        <select name="priority" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-red-500">
                           <option value="CRITICAL">CRITICAL (Mass Alert)</option>
                           <option value="HIGH">HIGH (Standard Match)</option>
                        </select>
                     </div>
                  </div>
                  
                  <button className="w-full py-6 bg-red-600 hover:bg-black text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2">
                     <Radio size={20} className="animate-pulse" /> Launch Broadcast
                  </button>
                  <button type="button" onClick={() => setShowBroadcast(false)} className="w-full text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900">Cancel Action</button>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route index element={<HospitalOverview activeRequests={activeRequests} setShowBroadcast={setShowBroadcast} />} />
        <Route path="responses" element={<DonorResponses />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="analytics" element={<HospitalAnalytics />} />
        <Route path="tracking" element={<LiveTracking activeRequests={activeRequests} />} />
        <Route path="settings" element={<div className="p-20 text-center font-black text-slate-400">Hospital Facility Settings & Nodes</div>} />
      </Routes>
    </div>
  );
}

function HospitalOverview({ activeRequests, setShowBroadcast }) {
  const { user } = useAuth();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 mb-2 uppercase tracking-[0.4em]">
             <Server size={14} className="animate-pulse" /> Command Center: AIS-NODE-01
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">
             Medical <span className="text-red-600 italic font-serif underline decoration-blue-100 underline-offset-8">Unit</span> Control
          </h1>
          <p className="text-slate-400 font-bold text-xs italic">{user?.displayName || 'City General Hospital'}</p>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowBroadcast(true)}
             className="flex items-center gap-3 px-10 py-5 bg-slate-900 hover:bg-red-600 text-white rounded-[2rem] font-black shadow-2xl transition-all active:scale-95 group"
           >
              <Radio size={24} className="group-hover:animate-pulse" />
              GEO BROADCAST
           </button>
           <Link 
             to="/request-blood"
             className="flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-black text-white rounded-[2rem] font-black shadow-2xl shadow-red-200 transition-all active:scale-95 group"
           >
             <ShieldAlert size={24} className="group-hover:rotate-12 transition-transform" />
             TRIGGER CRITICAL SOS
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<ShieldAlert />} label="Active SOS" value={activeRequests.length} sub="Ongoing Emergencies" color="red" />
        <StatCard icon={<Package />} label="Live Stock" value="122" sub="Units in Bank" color="blue" />
        <StatCard icon={<Users />} label="Nearby Donors" value="1,402" sub="Within 5km" color="green" />
        <StatCard icon={<Activity />} label="Success Rate" value="98.2%" sub="System Metric" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Section: Active Emergencies */}
           <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                   <Activity size={24} className="text-red-600" /> Active Emergency Operations
                </h2>
                <Link to="responses" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Monitor Responses</Link>
             </div>
             
             <div className="space-y-4">
                {activeRequests.map(req => (
                   <div key={req.id} className="p-8 bg-slate-50 border-2 border-transparent hover:border-red-500/20 hover:bg-white transition-all rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 group">
                      <div className="flex gap-6 items-center">
                         <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl ${
                            req.priority === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white'
                         }`}>
                           {req.bloodType}
                         </div>
                         <div>
                            <div className="flex items-center gap-3">
                               <h4 className="font-black text-slate-900 text-xl uppercase italic">{req.patientName}</h4>
                               <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                  req.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                               }`}>{req.priority}</span>
                            </div>
                            <div className="flex items-center gap-6 mt-2 text-[10px] font-bold text-slate-400">
                               <span className="flex items-center gap-1.5"><Heart size={12} className="text-red-500" /> {req.units} UNITS</span>
                               <span className="flex items-center gap-1.5"><Clock size={12} /> ETA: {req.arrival}</span>
                               <span className="flex items-center gap-1.5"><MapPin size={12} /> Unit 4B</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <Link to="tracking" className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Track</Link>
                         <button className="px-6 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Manage</button>
                      </div>
                   </div>
                ))}
             </div>
           </section>

           {/* Inventory Snap-view */}
           <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <Package size={150} />
              </div>
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                      <Radio size={24} className="text-blue-500 animate-pulse" /> Inventory Mirror
                    </h3>
                    <Link to="inventory" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Full Stock</Link>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {inventoryData.slice(0, 4).map(item => (
                       <div key={item.group} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all text-center">
                          <div className="text-3xl font-black mb-1">{item.group}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Stock</div>
                          <div className={`text-2xl font-black ${item.status === 'CRITICAL' ? 'text-red-500' : 'text-blue-400'}`}>{item.units} <span className="text-[10px] opacity-30">UNITS</span></div>
                       </div>
                    ))}
                 </div>
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Donor Response Radar</h4>
               <div className="space-y-6">
                  <RadarItem name="David K." status="EN ROUTE" distance="1.2km" active />
                  <RadarItem name="Linda M." status="ACCEPTED" distance="3.4km" />
                  <RadarItem name="Sarah J." status="STANDBY" distance="5.0km" />
               </div>
               <button className="w-full mt-10 py-5 bg-slate-50 rounded-2xl text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                 Live Map View
               </button>
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <Zap size={80} fill="currentColor" />
              </div>
              <h4 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-blue-200">AI Compatibility Factor</h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-white/70">Matching Optimization</span>
                    <span className="text-sm font-black text-white">97.4%</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '97.4%' }} className="h-full bg-blue-300" />
                 </div>
                 <p className="text-[10px] text-blue-100 font-medium leading-relaxed italic">
                    "System successfully reduced response time by 4.2 mins using proximity-weighting."
                 </p>
              </div>
           </div>
        </aside>
      </div>
    </motion.div>
  );
}

function DonorResponses() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Dynamically load donors who have "accepted" our requests
    const saved = JSON.parse(localStorage.getItem('hemolink_requests') || '[]');
    const accepted = saved.filter(r => r.status === 'MATCHED');
    
    setResponses([
      ...accepted.map(a => ({ name: 'Verified Donor', type: a.bloodType, status: 'EN ROUTE', eta: 'Calculating...', dist: 'Locating...' })),
      { name: 'John Doe', type: 'O-', status: 'EN ROUTE', eta: '8 mins', dist: '1.4km' },
      { name: 'Alice Smith', type: 'AB+', status: 'PREPPING', eta: '22 mins', dist: '4.2km' },
      { name: 'Marcus Ray', type: 'O-', status: 'READY', eta: 'Soon', dist: '0.8km' },
    ]);
  }, []);

  return (
    <div className="space-y-10">
       <div className="flex justify-between items-end">
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active <span className="text-green-600">Responses</span></h2>
             <p className="text-slate-400 font-bold text-sm">Real-time tracking of committed blood donors</p>
          </div>
          <div className="flex gap-2">
             <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Refresh Radar</button>
          </div>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-100 italic">
                <tr className="text-[xs] font-black text-slate-400 uppercase tracking-widest">
                   <th className="px-10 py-6">Volunteer</th>
                   <th className="px-10 py-6">Blood Type</th>
                   <th className="px-10 py-6">Operation Status</th>
                   <th className="px-10 py-6">Distance/ETA</th>
                   <th className="px-10 py-6 text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {responses.map((row, i) => (
                   <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">{row.name[0]}</div>
                            <div className="font-black text-slate-900">{row.name}</div>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-black">{row.type}</span>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-2 text-xs font-black text-blue-600">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> {row.status}
                         </div>
                      </td>
                      <td className="px-10 py-6 text-xs font-bold text-slate-400">
                         {row.dist} • {row.eta}
                      </td>
                      <td className="px-10 py-6 text-right">
                         <button className="px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all">Encrypted Chat</button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function InventoryManagement() {
  return (
    <div className="space-y-10">
       <div className="flex justify-between items-end">
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Stock <span className="text-blue-600 italic">Inventory</span></h2>
             <p className="text-slate-400 font-bold text-sm italic">Direct mirror of MySQL 'inventory_table'</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100">
             <Plus size={18} /> Add Stock Unit
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventoryData.map(item => (
             <div key={item.group} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                {item.status === 'CRITICAL' && (
                   <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rotate-45 -mr-12 -mt-12"></div>
                )}
                <div className="flex justify-between items-start mb-6">
                   <div className="text-4xl font-black text-slate-900">{item.group}</div>
                   <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                      item.status === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                   }`}>{item.status}</div>
                </div>
                <div className="space-y-4">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Reserve</div>
                   <div className="text-4xl font-black text-blue-600">{item.units} <span className="text-xs text-slate-400 font-bold">UNITS</span></div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50 flex gap-4">
                   <button className="flex-1 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all">Update</button>
                   <button className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Order</button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}

function HospitalAnalytics() {
  return (
    <div className="space-y-12">
       <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Network <span className="text-indigo-600 italic underline decoration-slate-200 underline-offset-8">Analytics</span></h2>
          <p className="text-slate-400 font-bold text-sm">JPA-backed usage trends & predictive modeling</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[450px]">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Weekly Blood Usage Units</h4>
             <ResponsiveContainer width="100%" height="80%">
                <BarChart data={usageTrend}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                   <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                   <Bar dataKey="usage" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[450px]">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Stock Distribution (%)</h4>
             <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                   <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="units"
                    nameKey="group"
                   >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                   </Pie>
                   <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-wrap justify-center gap-6 mt-4">
                {inventoryData.map((d, i) => (
                   <div key={d.group} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{d.group}</span>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}

function LiveTracking({ activeRequests }) {
  return (
    <div className="space-y-10">
       <div className="bg-white rounded-[3rem] border border-slate-100 p-10 relative overflow-hidden h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
             <div className="relative">
                {/* Radar Grid Conceptual */}
                {[1, 2, 3, 4].map(i => (
                   <div 
                    key={i}
                    className="absolute border border-slate-200 rounded-full animate-ping"
                    style={{ 
                      width: `${i * 200}px`, 
                      height: `${i * 200}px`, 
                      top: `-${i * 100}px`, 
                      left: `-${i * 100}px`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: '4s'
                    }}
                   />
                ))}
                <div className="w-4 h-4 bg-blue-600 rounded-full relative z-10 shadow-[0_0_20px_blue]"></div>
                
                {/* Mock Donors on Radar */}
                <div className="absolute -top-32 -left-40 group cursor-pointer">
                   <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-xl animate-bounce">O-</div>
                   <div className="absolute top-12 left-0 whitespace-nowrap bg-white px-3 py-1 rounded-full border border-slate-100 text-[8px] font-black uppercase tracking-widest shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Donor: Alex (1.2km)</div>
                </div>
                
                <div className="absolute top-20 left-40 group cursor-pointer">
                   <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-xl scale-75">AB+</div>
                   <div className="absolute top-12 left-0 whitespace-nowrap bg-white px-3 py-1 rounded-full border border-slate-100 text-[8px] font-black uppercase tracking-widest shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Donor: Sarah (3.8km)</div>
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end pointer-events-none">
             <div className="p-6 bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-2xl max-w-sm pointer-events-auto">
                <h4 className="text-xs font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
                   <Compass size={16} className="text-blue-600" /> Active Radar Scan
                </h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Nearest Matching Donor (O-)</span>
                      <span className="text-green-600 font-black">1.2 KM</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Estimated Arrival</span>
                      <span className="text-blue-600 font-black">8.4 MIN</span>
                   </div>
                </div>
             </div>
             <div className="flex flex-col gap-4 pointer-events-auto">
                <button className="p-5 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"><Plus size={24} /></button>
                <button className="p-5 bg-white text-slate-900 rounded-2xl shadow-xl hover:scale-110 transition-transform"><Compass size={24} /></button>
             </div>
          </div>
          
          <div className="absolute top-10 right-10 pointer-events-auto">
             <div className="px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                Live Uplink: Online
             </div>
          </div>
       </div>
    </div>
  );
}

// Minimal helpers
function StatCard({ icon, label, value, sub, color }) {
  const c = color === 'red' ? 'text-red-600 bg-red-50' : 
            color === 'blue' ? 'text-blue-600 bg-blue-50' :
            color === 'green' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50';
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group text-center">
       <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 ${c}`}>
          {icon}
       </div>
       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
       <div className="text-4xl font-black text-slate-900 tracking-tighter">{value}</div>
       <div className="text-[10px] font-bold text-slate-300 mt-1 uppercase italic">{sub}</div>
    </div>
  );
}

function RadarItem({ name, status, distance, active }) {
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            {name[0]}
          </div>
          <div>
             <div className="text-sm font-black text-slate-900">{name}</div>
             <div className="text-[10px] text-slate-400 font-bold">{distance} away</div>
          </div>
       </div>
       <div className="text-right">
          <div className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-red-600 animate-pulse' : 'text-blue-500'}`}>{status}</div>
       </div>
    </div>
  );
}
