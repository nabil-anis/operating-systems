
import React from 'react';

const ReadingView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-800">
      
      {/* Header */}
      <header className="space-y-8 border-b border-white/5 pb-16">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Technical Case Study <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span> Content Automation
        </div>
        <h1 className="text-4xl md:text-6xl font-outfit font-extrabold tracking-tight text-white leading-tight">
          Case Study: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">Blog Generator</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light">
            Automating Multi-Site Blog Publishing with n8n & WordPress
        </p>
        <div className="flex flex-wrap gap-8 items-center text-xs text-gray-500 font-mono uppercase tracking-[0.2em]">
          <div className="space-y-1">
             <p className="text-[9px] opacity-50">Industry</p>
             <p className="text-gray-300">Digital Media</p>
          </div>
          <div className="space-y-1">
             <p className="text-[9px] opacity-50">Core Engine</p>
             <p className="text-gray-300">n8n + OpenAI + WordPress</p>
          </div>
          <div className="space-y-1">
             <p className="text-[9px] opacity-50">Outcome</p>
             <p className="text-green-400">70% Cost Reduction</p>
          </div>
        </div>
      </header>

      {/* Content Sections */}
      <article className="prose prose-invert prose-lg max-w-none space-y-16">
        
        <section className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-outfit font-bold text-white border-l-4 border-gray-500 pl-6 tracking-tight">Overview</h2>
            <div className="space-y-6 text-gray-300 font-light leading-relaxed text-lg">
                <p>
                    The client managed multiple niche WordPress websites but struggled with manual publishing processes. They needed a scalable system to maintain SEO rankings and organic traffic growth without increasing headcount.
                </p>
                <p>
                    A blog automation engine was built by integrating <strong>OpenAI</strong> with <strong>n8n</strong>, using <strong>Google Sheets as the command center</strong>. The result is a self-regulating, keyword-driven publishing infrastructure where every article is generated and published automatically.
                </p>
            </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-4xl font-outfit font-bold text-white border-l-4 border-blue-500 pl-6 tracking-tight">The Core Architecture</h2>
          <div className="space-y-6 text-gray-300 font-light leading-relaxed text-lg">
            <p>
              At the heart of the system is a simple but powerful principle: <strong>The Keyword Queue controls everything.</strong>
            </p>
            <p>
                The keyword sheet contains structured columns for Topic, Keyword, and most importantly, <strong>Publish Status</strong>. Every automation decision flows from this data.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-4xl font-outfit font-bold text-white border-l-4 border-green-500 pl-6 tracking-tight">How the Flow Works</h2>
          <div className="space-y-6 text-gray-300 font-light leading-relaxed text-lg">
            <p>
              The system processes leads sequentially, using a "check-then-act" logic pattern to ensure operational integrity.
            </p>

            {/* LIVE FLOW DIAGRAM */}
            <div className="mt-12 p-6 md:p-12 rounded-[2.5rem] bg-black/20 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-20"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/10 blur-[80px] rounded-full opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[80px] rounded-full opacity-30" />

                <h3 className="text-xl md:text-2xl font-outfit font-bold text-white mb-12 text-center relative z-10">
                    Logic-Driven Workflow
                </h3>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500/0 via-green-500/30 to-green-500/0 md:-translate-x-1/2"></div>

                    {/* Step 1: Trigger */}
                    <div className="relative z-10 flex flex-row items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-20 group">
                        {/* Text (Desktop Left) */}
                        <div className="order-2 md:order-1 flex-1 md:text-right pt-1 md:pt-0">
                            <h4 className="text-green-400 font-bold text-base md:text-lg mb-1 md:mb-2">1. Topic & Keyword Input</h4>
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                n8n scans the Google Sheet or Keyword Queue. It fetches <strong>one keyword at a time</strong>. Each keyword becomes a trigger for content generation.
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
                            <h4 className="text-blue-400 font-bold text-base md:text-lg mb-1 md:mb-2">2. AI Blog Generation</h4>
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                <strong className="text-white">OpenAI</strong> generates SEO-optimized content, structures headings (H1, H2, H3), adds meta descriptions, and formats paragraphs.
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Protection */}
                    <div className="relative z-10 flex flex-row items-start md:items-center gap-6 md:gap-8 mb-12 md:mb-20 group">
                        {/* Text (Desktop Left) */}
                        <div className="order-2 md:order-1 flex-1 md:text-right pt-1 md:pt-0">
                            <h4 className="text-orange-400 font-bold text-base md:text-lg mb-1 md:mb-2">3. Auto Publishing</h4>
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                The workflow connects to multiple WordPress sites via API, assigns correct categories, adds featured images, and publishes automatically.
                            </p>
                        </div>
                        {/* Icon (Center) */}
                        <div className="order-1 md:order-2 flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.4)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
                            <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-pulse"></div>
                            <i className="fas fa-cloud-upload-alt text-[10px] text-orange-200"></i>
                        </div>
                        {/* Spacer (Desktop Right) */}
                        <div className="order-3 hidden md:block flex-1"></div>
                    </div>

                    {/* Step 4: Execution */}
                    <div className="relative z-10 flex flex-row items-start md:items-center gap-6 md:gap-8 group">
                        {/* Spacer (Desktop Left) */}
                        <div className="order-3 md:order-1 hidden md:block flex-1"></div>
                        {/* Icon (Center) */}
                        <div className="order-1 md:order-2 flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0a0a] border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
                            <i className="fas fa-check-circle text-[10px] text-purple-200"></i>
                        </div>
                        {/* Text (Desktop Right) */}
                        <div className="order-2 md:order-3 flex-1 md:text-left pt-1 md:pt-0">
                            <h4 className="text-purple-400 font-bold text-base md:text-lg mb-1 md:mb-2">4. Result</h4>
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                No manual uploading. No formatting corrections. Content is live and indexed faster due to consistent publishing rhythm.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-4xl font-outfit font-bold text-white border-l-4 border-orange-500 pl-6 tracking-tight">Why This Structure Matters</h2>
          <div className="space-y-6 text-gray-300 font-light leading-relaxed text-lg">
             <p>For businesses managing multiple content-heavy websites, automation is not about replacing creativity. This system:</p>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                <li className="glass p-4 rounded-xl flex items-center gap-4">
                    <i className="fas fa-bolt text-blue-400"></i>
                    <span className="text-sm">Reduces operational friction</span>
                </li>
                <li className="glass p-4 rounded-xl flex items-center gap-4">
                    <i className="fas fa-dollar-sign text-green-400"></i>
                    <span className="text-sm">Lowers content production cost</span>
                </li>
                <li className="glass p-4 rounded-xl flex items-center gap-4">
                    <i className="fas fa-clock text-orange-400"></i>
                    <span className="text-sm">Improves publishing consistency</span>
                </li>
                <li className="glass p-4 rounded-xl flex items-center gap-4">
                    <i className="fas fa-expand-arrows-alt text-purple-400"></i>
                    <span className="text-sm">Unlocks scale across multiple sites</span>
                </li>
             </ul>
             <p className="mt-4">It transforms content publishing from a manual task into a structured growth system.</p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-4xl font-outfit font-bold text-white border-l-4 border-purple-500 pl-6 tracking-tight">Operational Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-xl underline decoration-blue-500 underline-offset-8">Reliability</h4>
              <ul className="text-gray-400 text-sm space-y-4 list-none p-0">
                <li><strong className="text-white block">Consistent Publishing</strong> Publishing frequency increased from 3 posts/week to 1–2 posts/day.</li>
                <li><strong className="text-white block">Faster Indexing</strong> Consistent publishing rhythm leads to faster indexing by search engines.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-xl underline decoration-green-500 underline-offset-8">Efficiency</h4>
              <ul className="text-gray-400 text-sm space-y-4 list-none p-0">
                 <li><strong className="text-white block">Cost Reduction</strong> Content production cost reduced by over 70%.</li>
                 <li><strong className="text-white block">Zero Manual Formatting</strong> No need for writers or editors to format posts; the automation handles it all.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-900/10 to-transparent border border-white/5 p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden">
          <h3 className="text-white font-bold mb-6 text-2xl tracking-tight">Strategic Outcome</h3>
          <p className="text-gray-300 leading-relaxed text-lg mb-8">
            The client transitioned from a manual content workflow to a scalable automated publishing engine. Instead of spending time managing writers, they now focus on traffic strategy, monetization, and site expansion.
            <br/><br/>
            The automation turned blogging from an operational burden into a growth lever.
          </p>
          <p className="mt-8 text-[10px] font-black text-green-400 uppercase tracking-[0.3em]">— Blog Generator Automation</p>
        </section>

      </article>
    </div>
  );
};

export default ReadingView;
