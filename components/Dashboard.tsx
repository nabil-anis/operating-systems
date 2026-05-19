
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { fetchSheetData, DashboardMetrics } from '../services/sheetService';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchSheetData();
      setMetrics(data);
      setLoading(false);
    };
    loadData();
    // Poll every 30 seconds for "Live" feel
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const voicemailData = [
    { name: 'Sent', value: metrics.voicemail.sent, color: '#4ade80' }, // green-400
    { name: 'Pending', value: metrics.voicemail.pending, color: '#fbbf24' }, // amber-400
    { name: 'Idle', value: metrics.voicemail.idle, color: '#9ca3af' }, // gray-400
  ];

  const emailData = [
    { name: 'Sent', value: metrics.email.sent, color: '#4ade80' },
    { name: 'Replied', value: metrics.email.replied, color: '#60a5fa' },
    { name: 'Pending', value: metrics.email.pending, color: '#fbbf24' },
    { name: 'Idle', value: metrics.email.idle, color: '#9ca3af' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      
      {/* 1. Hero Section */}
      <div className="relative pt-6 md:pt-10 pb-12 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-6 max-w-3xl w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <i className="fas fa-satellite-dish text-green-400 animate-pulse"></i> Live Connection
            </div>
            <h1 className="text-4xl md:text-7xl font-outfit font-extrabold tracking-tight leading-[1.1] text-white">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-blue-500">Dashboard</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl font-light">
              Real-time telemetry from the automation engine. Tracking voicemail and email performance across {metrics.totalLeads} active leads.
            </p>
          </div>
          
          {/* Live Status Card */}
          <div className="glass p-6 rounded-2xl w-full md:w-auto min-w-[250px] border-l-2 border-green-500 bg-gradient-to-r from-white/[0.02] to-transparent">
             <div className="flex justify-between items-center mb-4">
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Leads</p>
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
             </div>
             <p className="font-outfit text-4xl font-bold text-white tracking-tight">{metrics.totalLeads}</p>
             <p className="text-xs text-gray-500 mt-2">Last updated: Just now</p>
          </div>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Voicemail Metrics */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-black/40 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
           <h3 className="text-2xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
             <i className="fas fa-voicemail text-blue-400"></i> Voicemail Automation
           </h3>
           
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={voicemailData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {voicemailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                   <span className="text-3xl font-bold text-white">{metrics.voicemail.sent}</span>
                   <span className="text-[10px] text-gray-500 uppercase tracking-widest">SENT</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-2xl font-bold text-amber-400">{metrics.voicemail.pending}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Idle</p>
                    <p className="text-2xl font-bold text-gray-400">{metrics.voicemail.idle}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Failed</p>
                    <p className="text-2xl font-bold text-red-400">{metrics.voicemail.failed}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Email Metrics */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-black/40 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />
           <h3 className="text-2xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
             <i className="fas fa-envelope text-green-400"></i> Email Automation
           </h3>
           
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emailData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {emailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                   <span className="text-3xl font-bold text-white">{metrics.email.sent}</span>
                   <span className="text-[10px] text-gray-500 uppercase tracking-widest">SENT</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Replied</p>
                    <p className="text-2xl font-bold text-blue-400">{metrics.email.replied}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-2xl font-bold text-amber-400">{metrics.email.pending}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Idle</p>
                    <p className="text-2xl font-bold text-gray-400">{metrics.email.idle}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Error</p>
                    <p className="text-2xl font-bold text-red-400">{metrics.email.failed}</p>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* 3. Logic-Driven Workflow (Restored Visuals) */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-black/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-20"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/10 blur-[80px] rounded-full opacity-30" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[80px] rounded-full opacity-30" />

          <h3 className="text-2xl md:text-3xl font-outfit font-bold text-white mb-12 text-center relative z-10">
              System Architecture
          </h3>

          <div className="relative max-w-4xl mx-auto">
              {/* Vertical Line */}
              <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500/0 via-green-500/30 to-green-500/0 md:-translate-x-1/2"></div>

              {/* Step 1: Trigger */}
              <div className="relative z-10 flex flex-row items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-20 group">
                  {/* Text (Desktop Left) */}
                  <div className="order-2 md:order-1 flex-1 md:text-right pt-1 md:pt-0">
                      <h4 className="text-green-400 font-bold text-base md:text-lg mb-1 md:mb-2">1. Lead Ingestion</h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                          System scans the Google Sheet for new rows. It fetches <strong>one lead at a time</strong> to ensure API stability.
                      </p>
                  </div>
                  {/* Icon (Center) */}
                  <div className="order-1 md:order-2 flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-20"></div>
                      <i className="fas fa-table text-[10px] text-green-200"></i>
                  </div>
                  {/* Spacer (Desktop Right) */}
                  <div className="order-3 hidden md:block flex-1"></div>
              </div>

              {/* Step 2: Logic Gate */}
              <div className="relative z-10 flex flex-row items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-20 group">
                  {/* Spacer (Desktop Left) */}
                  <div className="order-3 md:order-1 hidden md:block flex-1"></div>
                  {/* Icon (Center) */}
                  <div className="order-1 md:order-2 flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-code-branch text-[10px] text-blue-200"></i>
                  </div>
                  {/* Text (Desktop Right) */}
                  <div className="order-2 md:order-3 flex-1 md:text-left pt-1 md:pt-0">
                      <h4 className="text-blue-400 font-bold text-base md:text-lg mb-1 md:mb-2">2. Intelligent Routing</h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                          <strong className="text-white">n8n</strong> checks for duplicates and validates contact info. Valid leads are routed to Voicemail and Email queues simultaneously.
                      </p>
                  </div>
              </div>

              {/* Step 3: Execution */}
              <div className="relative z-10 flex flex-row items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-20 group">
                  {/* Text (Desktop Left) */}
                  <div className="order-2 md:order-1 flex-1 md:text-right pt-1 md:pt-0">
                      <h4 className="text-orange-400 font-bold text-base md:text-lg mb-1 md:mb-2">3. Omni-Channel Dispatch</h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                          Voicemails are dropped via Slybroadcast (ringless). Emails are sent via SMTP. Both actions happen within seconds.
                      </p>
                  </div>
                  {/* Icon (Center) */}
                  <div className="order-1 md:order-2 flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.4)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-pulse"></div>
                      <i className="fas fa-paper-plane text-[10px] text-orange-200"></i>
                  </div>
                  {/* Spacer (Desktop Right) */}
                  <div className="order-3 hidden md:block flex-1"></div>
              </div>

              {/* Step 4: Result */}
              <div className="relative z-10 flex flex-row items-start md:items-center gap-6 md:gap-8 group">
                  {/* Spacer (Desktop Left) */}
                  <div className="order-3 md:order-1 hidden md:block flex-1"></div>
                  {/* Icon (Center) */}
                  <div className="order-1 md:order-2 flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-check-circle text-[10px] text-purple-200"></i>
                  </div>
                  {/* Text (Desktop Right) */}
                  <div className="order-2 md:order-3 flex-1 md:text-left pt-1 md:pt-0">
                      <h4 className="text-purple-400 font-bold text-base md:text-lg mb-1 md:mb-2">4. Status Sync</h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                          The system writes back to the Google Sheet: "Sent", "Failed", or "Replied", keeping your database always up to date.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* 4. Detailed Breakdown (Visuals kept as requested, but repurposed) */}
      <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-black/40">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
            <div>
              <h4 className="font-bold text-white text-lg md:text-xl mb-1 font-outfit">Throughput Velocity</h4>
              <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">System Load</p>
            </div>
            <div className="text-left md:text-right">
               <p className="text-xl md:text-2xl font-bold text-green-400 font-mono">Active</p>
            </div>
         </div>

         {/* Re-using the lane visual for "Live Feed" feel */}
         <div className="space-y-4">
            <div className="h-12 md:h-16 w-full bg-green-900/10 rounded-xl border border-green-500/20 relative overflow-hidden flex items-center px-4 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(34,197,94,0.1)_50%,transparent_51%)] bg-[length:20px_100%] md:bg-[length:40px_100%] animate-[pulse_0.5s_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
                 <span className="text-[10px] md:text-xs font-mono text-green-400 whitespace-nowrap">PROCESSING QUEUE</span>
                 <div className="flex gap-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-ping" style={{ animationDelay: `${i * 200}ms` }}></div>
                    ))}
                 </div>
              </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;