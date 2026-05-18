import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, Activity, Award, Bell, MapPin, Clock, 
  ShieldCheck, Zap, User, Heart, RefreshCw, ChevronRight,
  History, Radio, BarChart3, Star, Download, ShieldAlert,
  ArrowUpRight, HeartPulse, Brain
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

// Mock Data for Charts
const healthData = [
  { month: 'Jan', hb: 13.5, bp: 120 },
  { month: 'Feb', hb: 14.1, bp: 118 },
  { month: 'Mar', hb: 13.8, bp: 122 },
  { month: 'Apr', hb: 14.2, bp: 115 },
  { month: 'May', hb: 14.5, bp: 119 },
];

export default function DonorDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState({
    bloodGroup: 'O+',
    trustScore: 85,
    rewardPoints: 1250,
    isAvailable: true,
    verificationStatus: 'VERIFIED',
    totalDonations: 4,
    totalLivesSaved: 12,
    eligibilityDate: 'Ready Now',
    lastDonation: '2024-03-15'
  });

  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'EMERGENCY', msg: 'Critical O- needed at City Central', time: '2m ago', unread: true },
    { id: 2, type: 'REWARD', msg: 'Earned "Lifesaver" Badge!', time: '1h ago', unread: false },
  ]);
  
  useEffect(() => {
    // Load persisted matches
    const savedRequests = JSON.parse(localStorage.getItem('hemolink_requests') || '[]');
    const donorMatches = savedRequests.filter(r => r.bloodType === donorData.bloodGroup && r.status === 'PENDING');
    
    setMatches([
      ...donorMatches,
      { id: 'm1', hospitalName: 'City Central ER', bloodType: 'O+', distance: '1.2km', priority: 'CRITICAL', patientName: 'Robert Fox', time: '12m ago', isMock: true },
      { id: 'm2', hospitalName: 'Pacific Medical', bloodType: 'O+', distance: '3.8km', priority: 'HIGH', patientName: 'Esther Howard', time: '45m ago', isMock: true },
    ]);
    setLoading(false);
  }, [donorData.bloodGroup]);

  const acceptMatch = (id) => {
    setMatches(prev => prev.filter(m => m.id !== id));
    // In a real app, this would update the backend
    const savedRequests = JSON.parse(localStorage.getItem('hemolink_requests') || '[]');
    const updated = savedRequests.map(r => r.id === id ? { ...r, status: 'MATCHED', donorId: user.id } : r);
    localStorage.setItem('hemolink_requests', JSON.stringify(updated));
    alert('Match Accepted! Routing data sent to hospital.');
  };

  const toggleAvailability = () => {
    setDonorData(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  return (
    <div className="space-y-10">
      <Routes>
        <Route index element={<Overview donorData={donorData} matches={matches} toggleAvailability={toggleAvailability} acceptMatch={acceptMatch} />} />
        <Route path="emergencies" element={<Emergencies matches={matches} acceptMatch={acceptMatch} />} />
        <Route path="history" element={<DonationHistory />} />
        <Route path="health" element={<HealthAnalytics />} />
        <Route path="matches" element={<MatchCenter />} />
        <Route path="rewards" element={<RewardsHub donorData={donorData} />} />
        <Route path="nearby" element={<NearbyHospitals />} />
        <Route path="settings" element={<DonorSettings donorData={donorData} setDonorData={setDonorData} />} />
      </Routes>
    </div>
  );
}

function Overview({ donorData, matches, toggleAvailability, acceptMatch }) {
  const { user } = useAuth();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">
            Welcome Back, <span className="text-red-600 italic font-serif underline decoration-slate-200 underline-offset-8 decoration-4">{user?.displayName?.split(' ')[0]}</span>
          </h1>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
             <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full">
                <ShieldCheck size={14} className="text-green-500" /> Account Verified
             </span>
             <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full">
                <Droplet size={14} /> {donorData.bloodGroup} Group
             </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={toggleAvailability}
             className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] border-2 transition-all shadow-xl active:scale-95 ${
               donorData.isAvailable 
               ? 'bg-green-600 border-green-500 text-white font-black shadow-green-100' 
               : 'bg-white border-slate-100 text-slate-400 font-bold shadow-slate-100'
             }`}
           >
             <div className={`w-3 h-3 rounded-full ${donorData.isAvailable ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></div>
             {donorData.isAvailable ? 'LIVE RESPONDER' : 'OFFLINE MODE'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<History />} label="Total Ops" value={donorData.totalDonations} sub="Donations" color="blue" />
        <StatCard icon={<Heart />} label="Lives Saved" value={donorData.totalLivesSaved} sub="Impact" color="red" />
        <StatCard icon={<Activity />} label="Trust Score" value={donorData.trustScore} sub="Rank: High" color="green" />
        <StatCard icon={<Award />} label="HemoPoints" value={donorData.rewardPoints} sub="Level 4" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Section: Live Emergencies */}
           <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShieldAlert size={24} className="text-red-600" /> Active SOS Matches
                 </h2>
                 <Link to="emergencies" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
              </div>
              
              <div className="space-y-4">
                 {matches.map(match => (
                    <div key={match.id} className="p-6 bg-slate-50 border-2 border-transparent hover:border-red-500/20 hover:bg-white transition-all rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 group">
                        <div className="flex gap-4 items-center">
                           <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                              {match.bloodType}
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h4 className="font-black text-slate-900">{match.hospitalName}</h4>
                                 <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black uppercase rounded-full">{match.priority}</span>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 mt-1">Patient: {match.patientName} • {match.distance}</div>
                           </div>
                        </div>
                        <button 
                           onClick={() => acceptMatch(match.id)}
                           className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all"
                        >
                           Accept Case
                        </button>
                    </div>
                 ))}
              </div>
           </section>

           {/* Section: AI Prediction */}
           <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <Brain size={120} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4">
                    <Zap size={14} fill="currentColor" /> AI Recommendation Engine
                 </div>
                 <h3 className="text-2xl font-black mb-6">High Demand Predicted in <span className="text-red-500 italic">Central District</span></h3>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-lg">
                    Based on festive trends and historical traffic data, we anticipate an 80% increase in O+ requirement over the next 48 hours.
                 </p>
                 <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                    View Full Analysis <ArrowUpRight size={16} />
                 </button>
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Response Metrics</h4>
               <div className="space-y-6">
                  <MetricRow label="Acceptance Rate" value="92%" icon={<HeartPulse size={14} />} color="text-red-500" />
                  <MetricRow label="Avg. ETA" value="14 min" icon={<Clock size={14} />} color="text-blue-500" />
                  <MetricRow label="Trust Standing" value="Elite" icon={<ShieldCheck size={14} />} color="text-green-500" />
               </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Recent Activity</h4>
                  <RefreshCw size={14} className="text-slate-300 animate-spin-slow" />
               </div>
               <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                  <ActivityItem title="Accepted SOS" detail="St. Mary Hospital" time="2h ago" />
                  <ActivityItem title="Earned Badge" detail="Emergency Hero" time="1d ago" />
                  <ActivityItem title="Donated Blood" detail="Main Plaza Drive" time="2m ago" />
               </div>
           </div>
        </aside>
      </div>
    </motion.div>
  );
}// Sub-components for routes
function Emergencies({ matches, acceptMatch }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Emergency <span className="text-red-600">Ops</span></h2>
          <p className="text-slate-400 font-bold text-sm">Priority matching for immediate impact</p>
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
           Sorted by: <span className="text-slate-900">Distance + Priority</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map(match => (
          <div key={match.id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-red-500/30 transition-all shadow-sm group">
             <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center font-black text-2xl text-white shadow-xl">
                    {match.bloodType}
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   match.priority === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-100 text-amber-600'
                }`}>
                   {match.priority} NEED
                </div>
             </div>
             
             <h3 className="text-2xl font-black text-slate-900 group-hover:text-red-600 transition-colors">{match.hospitalName}</h3>
             <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400 mb-8">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {match.distance}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {match.time}</span>
             </div>
             
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Patient Handle</div>
                <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{match.patientName}</div>
             </div>
             
             <div className="flex gap-4">
                <button 
                   onClick={() => acceptMatch(match.id)}
                   className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg shadow-red-100"
                >
                   Accept SOS
                </button>
                <button className="px-6 py-4 bg-slate-100 rounded-2xl text-slate-900 font-black flex items-center justify-center">
                   <ArrowUpRight size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonorSettings({ donorData, setDonorData }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsVerifying(false);
    }, 1500);
  };

  const confirmOtp = () => {
    setDonorData(prev => ({ ...prev, verificationStatus: 'VERIFIED' }));
    alert('Identity Verified via Government Records (Aadhaar/OTP)');
  };

  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Profile <span className="text-red-600 italic">Security</span></h2>
        <p className="text-slate-400 font-bold text-sm">Manage your medical node and identity verification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Identity Verification</h4>
            
            {donorData.verificationStatus === 'VERIFIED' ? (
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4">
                 <ShieldCheck className="text-green-600" size={32} />
                 <div>
                    <div className="text-xs font-black text-green-900 uppercase">Status: 100% SECURE</div>
                    <div className="text-[10px] text-green-600 font-bold uppercase">Government ID Linked</div>
                 </div>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
                    <ShieldAlert className="text-amber-600" size={32} />
                    <div className="text-xs font-black text-amber-900">PENDING VERIFICATION</div>
                 </div>
                 
                 {!otpSent ? (
                   <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Aadhaar / National ID Number" 
                        className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl bg-slate-50 font-bold"
                      />
                      <button 
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all"
                      >
                        {isVerifying ? 'Accessing Gov API...' : 'Send Verification OTP'}
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="6-Digit OTP" 
                        className="w-full px-6 py-4 border-2 border-red-100 rounded-2xl bg-white font-black text-center text-xl tracking-[0.5em]"
                      />
                      <button 
                        onClick={confirmOtp}
                        className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                      >
                        Confirm Code
                      </button>
                   </div>
                 )}
              </div>
            )}
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Account Actions</h4>
            <div className="space-y-4">
               <button className="w-full flex justify-between items-center p-6 bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-tight hover:bg-slate-100">
                  Update Health Records <ChevronRight size={16} />
               </button>
               <button className="w-full flex justify-between items-center p-6 bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-tight hover:bg-slate-100">
                  Donation Schedule <ChevronRight size={16} />
               </button>
               <button className="w-full flex justify-between items-center p-6 bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-tight hover:bg-red-50 text-red-600">
                  Deactivate Account <ChevronRight size={16} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function DonationHistory() {
  const history = [
    { id: 1, date: 'Mar 15, 2024', hospital: 'St. Mary Hospital', type: 'O+', units: 2, status: 'COMPLETED' },
    { id: 2, date: 'Jan 10, 2024', hospital: 'City Central ER', type: 'O+', units: 1, status: 'COMPLETED' },
    { id: 3, date: 'Nov 05, 2023', hospital: 'Unity Medical', type: 'O+', units: 1, status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mission <span className="text-blue-600 italic">Log</span></h2>
        <p className="text-slate-400 font-bold text-sm italic">Tracking every life saved through the JPA database</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6">Medical Facility</th>
                  <th className="px-8 py-6">Blood Type</th>
                  <th className="px-8 py-6 text-center">Units</th>
                  <th className="px-8 py-6">Verification</th>
                  <th className="px-8 py-6 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {history.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-8 py-6 font-bold text-slate-900 text-sm">{row.date}</td>
                     <td className="px-8 py-6 font-black text-slate-900 text-sm">{row.hospital}</td>
                     <td className="px-8 py-6">
                        <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">O+</span>
                     </td>
                     <td className="px-8 py-6 text-center font-mono font-bold text-slate-900">{row.units} UNIT</td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                           <ShieldCheck size={14} /> Blockchain Verified
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-blue-600">
                           <Download size={18} />
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

function HealthAnalytics() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Health <span className="text-green-600">Node</span></h2>
          <p className="text-slate-400 font-bold text-sm italic">Vitals tracking & donation readiness analytics</p>
        </div>
        <div className="flex gap-4">
           {['HEMOGLOBIN', 'BP', 'PULSE'].map(l => (
             <button key={l} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                {l}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[450px]">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Hemoglobin Trends (g/dL)</h4>
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="colorHb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                    itemStyle={{ color: '#ef4444', fontWeight: '900' }}
                  />
                  <Area type="monotone" dataKey="hb" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorHb)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[450px]">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Blood Pressure (Systolic)</h4>
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                  />
                  <Line type="stepAfter" dataKey="bp" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 4, stroke: '#fff' }} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
      
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 animate-pulse">
            <ShieldCheck size={40} />
         </div>
         <div className="flex-1">
            <h4 className="text-xl font-black mb-2 italic underline decoration-green-600 decoration-4">Eligible for Next Donation</h4>
            <p className="text-slate-400 text-sm font-medium">Your recovery period is complete. Your body has replenished iron levels. You are 100% ready to save another life.</p>
         </div>
         <button className="px-10 py-5 bg-green-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all">Schedule Scan</button>
      </div>
    </div>
  );
}

function MatchCenter() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI <span className="text-indigo-600">Match Engine</span></h2>
        <p className="text-slate-400 font-bold text-sm italic">Precision compatibility logic based on blood profiles</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
               <Radio size={150} />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3 underline decoration-indigo-600/20 underline-offset-4">
              Compatibility Matrix
            </h4>
            <div className="space-y-6">
               <CompatibilityRow target="O+" score={100} label="Perfect Match" />
               <CompatibilityRow target="A+" score={100} label="Perfect Match" />
               <CompatibilityRow target="B+" score={100} label="Perfect Match" />
               <CompatibilityRow target="AB+" score={100} label="Perfect Match" />
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform">
               <Zap size={150} fill="amber" color="amber" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              Reliability Score Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-6">
               <ReliabilityCard label="Success Rate" value="98%" />
               <ReliabilityCard label="Response Time" value="Fast" />
               <ReliabilityCard label="Verification" value="100%" />
               <ReliabilityCard label="Distance Match" value="92%" />
            </div>
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
               Calculation Method: Neural Network v2.4 (JPA Layer Optimized)
            </div>
         </div>
      </div>
    </div>
  );
}

function RewardsHub({ donorData }) {
  return (
    <div className="space-y-12">
       <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-white/5 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
             <div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter">Platinum <span className="text-amber-500 italic">Prestige</span></h2>
                <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-8 italic">You are in the top 1% of global lifesavers</p>
                <div className="flex items-center gap-6">
                   <div className="text-center">
                      <div className="text-3xl font-black text-amber-500 mb-1">{donorData.rewardPoints}</div>
                      <div className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Available XP</div>
                   </div>
                   <div className="h-10 w-px bg-white/10"></div>
                   <div className="text-center">
                      <div className="text-3xl font-black text-white mb-1">LVL 4</div>
                      <div className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Current Rank</div>
                   </div>
                </div>
             </div>
             <div className="w-48 h-48 bg-amber-500/10 rounded-full border border-amber-500/20 flex items-center justify-center relative">
                <Star size={80} className="text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" fill="currentColor" />
                <div className="absolute inset-0 border-[6px] border-white/5 rounded-full border-t-amber-500 animate-spin-slow"></div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AchievementBadge title="Emergency Hero" icon={<ShieldAlert />} desc="Responded to 3 SOS in 24h" color="bg-red-500" />
          <AchievementBadge title="First Responder" icon={<Zap />} desc="Accepted match within 2 mins" color="bg-blue-500" />
          <AchievementBadge title="Life Sustainer" icon={<Heart />} desc="Saved 10+ patients" color="bg-green-500" />
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

function MetricRow({ label, value, icon, color }) {
  return (
    <div className="flex justify-between items-center px-4 py-4 bg-slate-50 rounded-2xl border border-slate-100/50">
       <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className={color}>{icon}</span> {label}
       </div>
       <div className="text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}

function ActivityItem({ title, detail, time }) {
  return (
    <div className="flex gap-4 relative z-10">
       <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-100 flex-shrink-0"></div>
       <div>
          <div className="text-xs font-black text-slate-900">{title}</div>
          <div className="text-[10px] text-slate-400 font-bold">{detail} • {time}</div>
       </div>
    </div>
  );
}

function CompatibilityRow({ target, score, label }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-end mb-1">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">{target}</div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          </div>
          <span className="text-xs font-black text-indigo-600">{score}%</span>
       </div>
       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} className="h-full bg-indigo-600" />
       </div>
    </div>
  );
}

function NearbyHospitals() {
  const hospitals = [
    { name: 'City General Hospital', dist: '1.2km', status: 'CRITICAL_NEEDED', address: '4th Main, East Wing' },
    { name: 'St. Mary Medical', dist: '2.5km', status: 'STABLE', address: 'Church Street' },
    { name: 'Unity Trauma Center', dist: '4.8km', status: 'LOW_STOCK', address: 'West Bypass Rd' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Facility <span className="text-blue-600">Radar</span></h2>
        <p className="text-slate-400 font-bold text-sm italic">Nearby GPS-linked medical centers in AIS-GRID</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hospitals.map((h, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform">
                <Hospital size={100} />
             </div>
             <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest inline-block mb-6 ${
               h.status === 'CRITICAL_NEEDED' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
             }`}>
               {h.status}
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic">{h.name}</h3>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6">
                <MapPin size={14} /> {h.dist} • {h.address}
             </div>
             <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">Navigate to Site</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReliabilityCard({ label, value }) {
  return (
    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
       <div className="text-xl font-black text-indigo-600">{value}</div>
    </div>
  );
}

function AchievementBadge({ title, icon, desc, color }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
       <div className={`w-16 h-16 rounded-2xl ${color} text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <div>
          <h4 className="font-black text-slate-900 uppercase tracking-tight">{title}</h4>
          <p className="text-xs text-slate-400 font-medium">{desc}</p>
       </div>
    </div>
  );
}
