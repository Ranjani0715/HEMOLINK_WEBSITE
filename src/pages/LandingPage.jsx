import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Droplet, Shield, Zap, Heart, MapPin, Search, ChevronRight, Hospital, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold mb-6">
                <Zap size={16} /> Spring Boot 3.2 + MySQL Architecture
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                Smart Blood <span className="text-red-600">Matching</span> for Emergencies
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                The bridge between donors and hospitals. Powered by a Java-based matching algorithm and secure relational data.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 mt-12">
                 <Link 
                   to="/signup" 
                   state={{ defaultRole: 'DONOR' }}
                   className="flex-1 bg-red-600 hover:bg-black text-white p-8 rounded-[2rem] transition-all shadow-xl shadow-red-100 group relative overflow-hidden"
                 >
                    <div className="relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-100 mb-2">Heroes Portal</p>
                       <h3 className="text-2xl font-black mb-2 tracking-tighter">Become a <span className="italic underline underline-offset-4 decoration-red-400">Donor</span></h3>
                       <p className="text-xs text-red-100 font-medium">Save lives through smart matching.</p>
                    </div>
                    <Droplet className="absolute bottom-0 right-0 -mb-6 -mr-6 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
                 </Link>

                 <Link 
                   to="/signup" 
                   state={{ defaultRole: 'HOSPITAL' }}
                   className="flex-1 bg-slate-900 hover:bg-red-600 text-white p-8 rounded-[2rem] transition-all shadow-xl shadow-slate-200 group relative overflow-hidden"
                 >
                    <div className="relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Medical Command</p>
                       <h3 className="text-2xl font-black mb-2 tracking-tighter">Hospital <span className="italic text-red-500 group-hover:text-white transition-colors">Access</span></h3>
                       <p className="text-xs text-slate-400 group-hover:text-red-100 transition-colors font-medium">Manage inventory & SOS requests.</p>
                    </div>
                    <Hospital className="absolute bottom-0 right-0 -mb-6 -mr-6 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform" />
                 </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 px-4">
             <h2 className="text-4xl font-bold text-slate-900 mb-4">Enterprise Grade Infrastructure</h2>
             <p className="text-slate-500 max-w-2xl mx-auto">Built with a robust Java backend and MySQL persistence to ensure 99.9% availability for critical healthcare needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <FeatureCard 
              icon={<Search className="text-red-600" />} 
              title="AI Matching Service" 
              description="A Java-based weighted algorithm that ranks donors by type compatibility and distance."
            />
            <FeatureCard 
              icon={<Shield className="text-blue-600" />} 
              title="Spring Security" 
              description="Stateless JWT authentication and role-based access control protecting PII."
            />
            <FeatureCard 
              icon={<Activity className="text-green-600" />} 
              title="Real-time Inventory" 
              description="Live MySQL synchronization for hospital blood levels and automatic emergency alerts."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-red-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
