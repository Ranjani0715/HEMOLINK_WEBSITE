import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  Shield, Users, Activity, BarChart3, LayoutGrid, Server, 
  Database, Globe, Zap, Cpu, Search, CheckCircle2, XCircle,
  AlertTriangle, RefreshCw, ChevronRight, Terminal, Lock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const sysHealthData = [
  { time: '10:00', load: 12, req: 450 },
  { time: '11:00', load: 45, req: 890 },
  { time: '12:00', load: 30, req: 620 },
  { time: '13:00', load: 85, req: 1200 },
  { time: '14:00', load: 40, req: 750 },
  { time: '15:00', load: 25, req: 500 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="verify" element={<VerificationQueue />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="analytics" element={<GlobalAnalytics />} />
        <Route path="logs" element={<div className="p-20 text-center font-black text-slate-400">Log Aggregator - Live Feed</div>} />
        <Route path="settings" element={<div className="p-20 text-center font-black text-slate-400">System Preferences</div>} />
      </Routes>
    </div>
  );
}

function AdminOverview() {
  const [logs, setLogs] = useState([
    { time: '17:42:01', sys: 'AUTH', msg: 'Successful login: admin@hemolink.com', type: 'SEC' },
    { time: '17:40:15', sys: 'JPA', msg: 'Emergency match found for Request #992', type: 'INF' },
    { time: '17:38:22', sys: 'DB', msg: 'Hibernate: Schema update on donors table', type: 'SYS' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const systems = ['AUTH', 'JPA', 'DB', 'API', 'RADAR'];
      const msgs = [
        'Packet received from Node-77',
        'AI Match Score recalculated: 0.982',
        'Schema validation successful',
        'Burst request handled from Hospital-99',
        'Heartbeat: All nodes operational'
      ];
      const newLog = {
        time: new Date().toLocaleTimeString(),
        sys: systems[Math.floor(Math.random() * systems.length)],
        msg: msgs[Math.floor(Math.random() * msgs.length)],
        type: 'SYS'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">
            <Server size={14} /> Node: AIS-GLOBAL-MASTER
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System <span className="italic font-serif text-red-600">Command</span> Center</h1>
          <p className="text-sm font-medium text-slate-400 mt-2">
            Java 21 • Hibernate 6.4 • React 19 • MySQL 8
          </p>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-100">Broadcast Alert</button>
           <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <RefreshCw size={14} /> Reset Cache
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Zap size={20} />} label="API Health" value="Stable" color="text-green-500" />
        <StatCard icon={<Database size={20} />} label="DB Connector" value="98%" color="text-blue-500" />
        <StatCard icon={<Users size={20} />} label="Active Nodes" value="1,402" color="text-purple-500" />
        <StatCard icon={<Shield size={20} />} label="Security" value="Active" color="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 tracking-tight">
                 <BarChart3 size={24} className="text-indigo-600" /> System Load Monitor
              </h2>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sysHealthData}>
                       <defs>
                         <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} fontWeight="600" axisLine={false} tickLine={false} />
                       <YAxis stroke="#94a3b8" fontSize={10} fontWeight="600" axisLine={false} tickLine={false} />
                       <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold' }} />
                       <Area type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={4} fill="url(#colorLoad)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </section>

           <section className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <Terminal size={150} />
              </div>
              <div className="flex items-center gap-3 mb-10 text-[xs] font-bold uppercase tracking-widest text-red-500">
                 <Lock size={16} /> Encrypted System Logs
              </div>
              <div className="space-y-6 max-h-[300px] overflow-y-auto scrollbar-hide font-mono text-[10px]">
                 {logs.map((log, i) => (
                    <div key={i} className="flex gap-4 border-l-2 border-white/5 pl-4 hover:border-red-500 transition-colors py-2">
                        <span className="text-white/30">{log.time}</span>
                        <span className="text-indigo-400 font-bold">[{log.sys}]</span>
                        <span className="text-slate-400">{log.msg}</span>
                    </div>
                 ))}
                 <div className="text-green-500 animate-pulse tracking-widest mt-4 italic">_ STANDBY FOR NEW PACKETS...</div>
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Quick Verification</h4>
              <div className="space-y-6">
                 <VerifySnippet name="Marcus Ray" type="O-" />
                 <VerifySnippet name="Sarah Kent" type="AB+" />
                 <VerifySnippet name="Alex Chen" type="B+" />
              </div>
              <Link to="verify" className="w-full mt-10 py-5 bg-slate-50 flex items-center justify-center gap-2 rounded-2xl text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                Full Queue <ChevronRight size={14} />
              </Link>
           </div>

           <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-10 text-white shadow-xl shadow-red-100">
              <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-4">
                 <AlertTriangle size={14} /> Regional Hotspot
              </h4>
              <h3 className="text-xl font-black mb-4 tracking-tight italic underline decoration-white/20 underline-offset-4">Emergency Spike in Zone 04</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                 Blood demand has increased by 40% in the last 2 hours. AI matching engine is prioritizing all donors within 2km radius.
              </p>
           </div>
        </aside>
      </div>
    </motion.div>
  );
}

function VerificationQueue() {
  const [queue, setQueue] = useState([
    { id: 'H0288', name: 'Dr. John Wilson', role: 'HOSPITAL', status: 'PENDING', bio: 'Licensed Surgery Chief' },
    { id: 'D1022', name: 'David Miller', role: 'DONOR', status: 'PENDING', bio: 'Healthy O- Volunteer' },
    { id: 'R9910', name: 'City Blood Bank', role: 'RECIPIENT', status: 'STALE', bio: 'Inventory Syncing' },
  ]);

  const handleAction = (id, action) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    alert(`${id} has been ${action}. JPA records updated.`);
  };

  return (
    <div className="space-y-10">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verification <span className="text-blue-600">Vault</span></h2>
             <p className="text-slate-400 font-semibold text-sm italic">Reviewing medical authenticity credentials</p>
          </div>
          <button onClick={() => { setQueue([]); alert('Batch Approved.'); }} className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Batch Approve</button>
       </div>

       <div className="space-y-4">
          {queue.length === 0 ? (
            <div className="p-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
               <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
               <p className="font-bold text-slate-400 uppercase tracking-widest">Vault Cleared. No Pending Records.</p>
            </div>
          ) : queue.map((item, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">{item.name[0]}</div>
                   <div>
                      <div className="font-bold text-slate-900 text-lg tracking-tight uppercase">{item.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1">{item.role} • ID: {item.id}</div>
                      <div className="mt-2 text-[10px] text-slate-500 font-medium italic">Bio: {item.bio}</div>
                   </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto justify-end">
                   <button onClick={() => handleAction(item.id, 'APPROVED')} className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all"><CheckCircle2 size={24} /></button>
                   <button onClick={() => handleAction(item.id, 'REJECTED')} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={24} /></button>
                   <button className="px-6 py-4 border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Review Profile</button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 'U1', name: 'Marcus Ray', email: 'marcus@donor.com', role: 'DONOR', status: 'ACTIVE', trust: 98 },
    { id: 'U2', name: 'Sarah Kent', email: 'skent@hospital.com', role: 'HOSPITAL', status: 'ACTIVE', trust: 100 },
    { id: 'U3', name: 'Alex Chen', email: 'chen@donor.com', role: 'DONOR', status: 'INACTIVE', trust: 45 },
    { id: 'U4', name: 'James Wilson', email: 'wilson@med.org', role: 'RECIPIENT', status: 'FLAGGED', trust: 12 },
  ]);

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    alert(`User ${id} removed from system.`);
  };

  return (
    <div className="space-y-10">
       <div className="flex justify-between items-end">
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Node <span className="text-indigo-600">Registry</span></h2>
             <p className="text-slate-400 font-bold text-sm italic">Managing global HemoLink entity nodes</p>
          </div>
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input type="text" placeholder="Search by ID, Email..." className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 w-[300px]" />
          </div>
       </div>

       <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                   <th className="px-8 py-6">Identity</th>
                   <th className="px-8 py-6">Global Role</th>
                   <th className="px-8 py-6">Trust Index</th>
                   <th className="px-8 py-6">Status</th>
                   <th className="px-8 py-6 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                   <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">{user.name[0]}</div>
                            <div>
                               <div className="font-black text-slate-900 uppercase text-xs">{user.name}</div>
                               <div className="text-[10px] text-slate-400 font-bold">{user.email}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                            user.role === 'HOSPITAL' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                         }`}>{user.role}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className={`h-full ${user.trust > 80 ? 'bg-green-500' : user.trust > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${user.trust}%` }} />
                            </div>
                            <span className="text-[10px] font-black">{user.trust}%</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${
                            user.status === 'ACTIVE' ? 'text-green-600' : user.status === 'FLAGGED' ? 'text-red-600' : 'text-slate-400'
                         }`}>{user.status}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                            <XCircle size={18} />
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function GlobalAnalytics() {
  return <div className="p-20 text-center font-black text-slate-400 italic">Global Analytics v3.0 - Regional Distribution Maps</div>;
}

// Helpers
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:-translate-y-2 group">
       <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 ${color}`}>
          {icon}
       </div>
       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
       <div className={`text-4xl font-black tracking-tight ${color}`}>{value}</div>
    </div>
  );
}

function VerifySnippet({ name, type }) {
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">{type}</div>
          <div className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{name}</div>
       </div>
       <button className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:text-blue-800">Verify</button>
    </div>
  );
}
