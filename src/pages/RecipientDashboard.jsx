import { useState } from 'react';
import { 
  Heart, Zap, Clock, MapPin, Search, AlertCircle, 
  MessageSquare, CheckCircle2, History, CreditCard, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export default function RecipientDashboard() {
  const [activeRequest, setActiveRequest] = useState({
    status: 'MATCHING',
    type: 'B+',
    units: 2,
    location: 'Central Medical Center',
    matchCount: 12,
    eta: '12-24 Hours'
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Request <span className="text-red-600">Command</span></h1>
          <p className="text-slate-400 font-bold text-sm italic mt-1 uppercase tracking-widest">Active SOS Tracking: #REQ-9920</p>
        </div>
        <button className="px-8 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-black transition-all">
          New Emergency Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Active Status Card */}
          <section className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Search size={120} />
             </div>
             
             <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <Zap size={14} className="animate-pulse" /> Live Matching Engine
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority: High</div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                   <div className="text-2xl font-black text-blue-600 uppercase italic">Searching...</div>
                </div>
                <div>
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Compatible Matches</div>
                   <div className="text-2xl font-black text-slate-900">{activeRequest.matchCount} Found</div>
                </div>
                <div>
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Expected Action</div>
                   <div className="text-2xl font-black text-slate-900">{activeRequest.eta}</div>
                </div>
             </div>

             <div className="mt-10 pt-10 border-t border-slate-50">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-xs font-black text-slate-900 uppercase">Matching Progress</span>
                   <span className="text-xs font-black text-red-600 uppercase">65% Optimized</span>
                </div>
                <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-red-600"
                   />
                </div>
             </div>
          </section>

          {/* Matches List */}
          <section className="space-y-6">
             <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <CheckCircle2 size={24} className="text-green-500" /> Potential Lifesavers
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MatchCard name="Alex Ray" distance="1.2km" trust="98%" />
                <MatchCard name="Sarah J." distance="2.4km" trust="100%" />
                <MatchCard name="Jordan W." distance="3.8km" trust="94%" />
                <MatchCard name="Mike Ross" distance="5.2km" trust="97%" />
             </div>
          </section>
        </div>

        <aside className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-6">
                 <AlertCircle size={16} /> Need Assistance?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium mb-8">
                 Connecting with a donor requires facility verification. Our team is currently reviewing the hospital acceptance code.
              </p>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                Contact Coordinator
              </button>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Request History</h4>
              <div className="space-y-6">
                 <HistoryItem date="May 12, 2026" status="COMPLETED" />
                 <HistoryItem date="Jan 05, 2026" status="COMPLETED" />
              </div>
           </div>

           <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="relative z-10">
                 <ShieldCheck size={40} className="mb-4 text-indigo-200" />
                 <h4 className="text-xl font-black tracking-tighter mb-2">Verified Recipient</h4>
                 <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">SSL SECURED NODE</p>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

function MatchCard({ name, distance, trust }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
       <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-900 group-hover:bg-red-600 group-hover:text-white transition-colors">
             {name[0]}
          </div>
          <div className="text-[9px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
             Trust: {trust}
          </div>
       </div>
       <div className="font-black text-slate-900 text-lg tracking-tight uppercase mb-1">{name}</div>
       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
          <MapPin size={12} /> {distance} away
       </div>
       <button className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
          Request Connection
       </button>
    </div>
  );
}

function HistoryItem({ date, status }) {
  return (
    <div className="flex items-center justify-between">
       <div>
          <div className="text-[10px] font-black text-slate-900 uppercase">{date}</div>
          <div className="text-[10px] font-bold text-slate-400">2 Units • O+</div>
       </div>
       <div className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{status}</div>
    </div>
  );
}
