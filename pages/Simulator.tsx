import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Settings2, 
  ChevronDown,
  Terminal,
  ZapOff,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const SCENARIOS = [
  {
    title: 'Hospital vs Power Grid',
    subtitle: '2-Process Deadlock',
    desc: 'Hospital AI holds Primary Power and waits for Bandwidth. Power Grid holds Bandwidth and waits for Power. Classic circular wait.',
    procs: [
      { id: 'P1', name: 'Hospital AI', color: '#00d4ff', holds: [0], wants: [1] },
      { id: 'P2', name: 'Power Grid', color: '#7c6ff7', holds: [1], wants: [0] }
    ],
    res: [{ id: 'R1', name: 'Primary Power' }, { id: 'R2', name: 'Network BW' }],
    explain: [
      { type: 'proc', text: 'P1 (Hospital AI) and P2 (Power Grid) are both deadlocked.' },
      { type: 'res', text: 'R1 is held by P1 but needed by P2. R2 is held by P2 but needed by P1.' },
      { type: 'cond', text: 'Coffman trigger: Circular Wait cycle confirmed.' }
    ]
  },
  {
    title: 'Multi-System Cascade',
    subtitle: '3-Process Deadlock',
    desc: 'Hospital AI, Train System, and Traffic Management form a three-way circular wait across three resources.',
    procs: [
      { id: 'P1', name: 'Hospital AI', color: '#00d4ff', holds: [0], wants: [1] },
      { id: 'P2', name: 'Train System', color: '#7c6ff7', holds: [1], wants: [2] },
      { id: 'P3', name: 'Traffic Mgmt', color: '#00e676', holds: [2], wants: [0] }
    ],
    res: [{ id: 'R1', name: 'Power' }, { id: 'R2', name: 'Bandwidth' }, { id: 'R3', name: 'Emergency' }],
    explain: [
      { type: 'proc', text: 'P1, P2, and P3 are deadlocked in a 3-way chain.' },
      { type: 'res', text: 'Resources are held in a rotational dependency.' },
      { type: 'cond', text: 'Circular Wait: P1 → P2 → P3 → P1.' }
    ]
  },
  {
    title: 'Smart City Blackout',
    subtitle: '4-Process Critical Failure',
    desc: 'Total city grid collapse. All four sectors holding and waiting for resources in a perfect unbreakable loop.',
    procs: [
      { id: 'P1', name: 'Hospital AI', color: '#00d4ff', holds: [0], wants: [1] },
      { id: 'P2', name: 'Power Grid', color: '#7c6ff7', holds: [1], wants: [2] },
      { id: 'P3', name: 'Train System', color: '#00e676', holds: [2], wants: [3] },
      { id: 'P4', name: 'Traffic Mgmt', color: '#ff8c42', holds: [3], wants: [0] }
    ],
    res: [{ id: 'R1', name: 'Power' }, { id: 'R2', name: 'Bandwidth' }, { id: 'R3', name: 'Emergency' }, { id: 'R4', name: 'Data Bus' }],
    explain: [
      { type: 'proc', text: 'All four city systems are permanently blocked.' },
      { type: 'res', text: 'Total gridlock. Every sector is waiting.' },
      { type: 'cond', text: 'Maximum Entropy reached. Systemic Circular Wait across local infrastructure.' }
    ]
  }
];

const Simulator: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeadlocked, setIsDeadlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [logs, setLogs] = useState<{ type: string; msg: string; time: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = SCENARIOS[scenarioIdx];

  const addLog = (type: string, msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev.slice(-10), { type, msg, time }]);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setIsDeadlocked(false);
    setStep(0);
    setLogs([{ type: 'info', msg: 'System Audit Reset. Ready for diagnostics.', time: '-' }]);
  };

  const start = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setStep(0);
    addLog('info', `Initializing diagnostics for Sector: ${scenario.title}`);
  };

  useEffect(() => {
    if (isPlaying && !isDeadlocked) {
      const waitTime = [2000, 1200, 600][speed - 1];
      timerRef.current = setTimeout(() => {
        if (step < 3) {
          if (step === 0) {
            scenario.procs.forEach(p => p.holds.forEach(ri => addLog('success', `${p.id} (${p.name}) locked ${scenario.res[ri].id}.`)));
          } else if (step === 1) {
            scenario.procs.forEach(p => p.wants.forEach(ri => addLog('warning', `${p.id} requesting ${scenario.res[ri].id} — BLOCKED.`)));
          } else if (step === 2) {
            setIsDeadlocked(true);
            setIsPlaying(false);
            addLog('error', '⚠ DEADLOCK ALERT: Circular Wait signature confirmed.');
          }
          setStep(prev => prev + 1);
        }
      }, waitTime);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, isDeadlocked, step, speed, scenario]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = 390;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, W, H);
    
    // Background Grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const numP = scenario.procs.length;
    const numR = scenario.res.length;
    const pNodes = scenario.procs.map((p, i) => ({ x: W * (i + 1) / (numP + 1), y: 110, id: p.id, name: p.name, color: p.color }));
    const rNodes = scenario.res.map((r, i) => ({ x: W * (i + 1) / (numR + 1), y: 280, id: r.id, name: r.name }));

    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, dash: boolean) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      if (dash) ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 10 * Math.cos(angle - Math.PI / 6), y2 - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - 10 * Math.cos(angle + Math.PI / 6), y2 - 10 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Draw Edges
    if (step >= 1) {
      scenario.procs.forEach((p, pi) => {
        p.holds.forEach(ri => {
          drawArrow(pNodes[pi].x, pNodes[pi].y + 35, rNodes[ri].x, rNodes[ri].y - 35, isDeadlocked ? '#ff3b3b' : '#00e676', false);
        });
      });
    }
    if (step >= 2) {
      scenario.procs.forEach((p, pi) => {
        p.wants.forEach(ri => {
          drawArrow(rNodes[ri].x, rNodes[ri].y + 35, pNodes[pi].x, pNodes[pi].y + 35, isDeadlocked ? '#ff5533' : '#ffcc44', true);
        });
      });
    }

    // Draw Process Nodes
    pNodes.forEach(node => {
      ctx.save();
      ctx.shadowBlur = isDeadlocked ? 20 : 10;
      ctx.shadowColor = isDeadlocked ? '#ff3b3b' : node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(5, 10, 16, 0.95)';
      ctx.fill();
      ctx.strokeStyle = isDeadlocked ? '#ff3b3b' : node.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = isDeadlocked ? '#ff3b3b' : node.color;
      ctx.font = 'bold 12px Sora';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y - 5);
      ctx.fillStyle = '#6a8099';
      ctx.font = '9px Sora';
      ctx.fillText(node.name, node.x, node.y + 10);
    });

    // Draw Resource Nodes
    rNodes.forEach(node => {
      const size = 30;
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = isDeadlocked ? '#ff3b3b' : '#7c6ff7';
      ctx.beginPath();
      ctx.moveTo(node.x, node.y - size);
      ctx.lineTo(node.x + size, node.y);
      ctx.lineTo(node.x, node.y + size);
      ctx.lineTo(node.x - size, node.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(5, 10, 16, 0.95)';
      ctx.fill();
      ctx.strokeStyle = isDeadlocked ? '#ff3b3b' : '#7c6ff7';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = isDeadlocked ? '#ff3b3b' : '#7c6ff7';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y - 4);
      ctx.fillStyle = '#6a8099';
      ctx.font = '8px Sora';
      ctx.fillText(node.name, node.x, node.y + 12);
    });

  }, [scenario, step, isDeadlocked]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Simulation Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-1 relative overflow-hidden">
              <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6a8099]">City Resource Map</span>
              </div>
              <div className="absolute top-4 right-6 flex items-center gap-2 z-10">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isDeadlocked ? 'bg-secondary' : 'bg-success'}`} />
                <span className={`text-[10px] uppercase font-bold tracking-widest ${isDeadlocked ? 'text-secondary' : 'text-success'}`}>
                  {isDeadlocked ? 'DEADLOCK' : 'NOMINAL'}
                </span>
              </div>

              {/* Deadlock Alert Modal */}
              <AnimatePresence>
                {isDeadlocked && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-[20] flex items-center justify-center p-8 bg-[#050a10]/60 backdrop-blur-md"
                  >
                    <div className="max-w-md w-full glass-panel p-8 border-secondary/30 relative overflow-hidden bg-secondary/[0.05]">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><ZapOff className="w-24 h-24 text-secondary" /></div>
                      <div className="relative z-10 space-y-6">
                        <div className="text-secondary font-black text-xs uppercase tracking-[0.2em]">⚠ Critical Alert</div>
                        <h3 className="text-white text-2xl font-bold">GRID BLACKOUT</h3>
                        <p className="text-[#6a8099] text-sm leading-relaxed">Forensic analysis has identified a circular resource dependency. All city sectors are locked and unable to process data.</p>
                        <div className="flex gap-3 pt-4">
                          <button onClick={reset} className="btn-primary bg-secondary hover:bg-secondary/80 flex-1 py-4">Restore System</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <canvas 
                ref={canvasRef}
                className="w-full bg-[#050a10]/50 block"
              />
            </div>

            {/* Explanation Section */}
            <AnimatePresence>
              {isDeadlocked && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-8 border-secondary/20 bg-secondary/[0.03] space-y-6"
                >
                  <div className="text-secondary text-[10px] uppercase font-bold tracking-widest">Root Cause Investigation</div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {scenario.explain.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'proc' ? 'bg-primary' : item.type === 'res' ? 'bg-accent' : 'bg-secondary'}`} />
                        <p className="text-[#e0eaf5] text-[11px] leading-relaxed font-bold uppercase tracking-tight">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"><Settings2 className="w-5 h-5 text-primary" /></div>
                <div>
                  <h2 className="text-white font-bold text-sm tracking-tight">Dispatcher Terminal</h2>
                  <p className="text-[#6a8099] text-[10px] font-bold uppercase tracking-widest">Unit 04 • Smart City Monitor</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6a8099] uppercase tracking-widest ml-1">Grid Scenario</label>
                  <div className="relative group">
                    <select 
                      className="w-full bg-primary/5 border border-border-dim rounded-xl p-4 text-xs font-bold text-white outline-none cursor-pointer hover:bg-primary/10 transition-all appearance-none"
                      value={scenarioIdx}
                      onChange={(e) => { setScenarioIdx(parseInt(e.target.value)); reset(); }}
                      disabled={isPlaying}
                    >
                      {SCENARIOS.map((s, i) => <option key={i} value={i}>{s.title}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a8099] pointer-events-none" />
                  </div>
                  <div className="p-4 bg-primary/5 border border-border-dim rounded-xl">
                    <div className="text-primary text-[10px] font-black uppercase mb-1">{scenario.subtitle}</div>
                    <p className="text-[#6a8099] text-[11px] leading-normal">{scenario.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-bold text-[#6a8099] uppercase tracking-widest">Diagnostic Speed</label>
                    <span className="text-white font-mono text-xs">{speed}/3</span>
                  </div>
                  <input 
                    type="range" min="1" max="3" step="1" 
                    value={speed} 
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={start}
                    disabled={isPlaying || isDeadlocked}
                    className="btn-primary flex items-center justify-center gap-2 h-14"
                  >
                    <Play className="w-4 h-4" /> Run
                  </button>
                  <button 
                    onClick={reset}
                    className="btn-ghost flex items-center justify-center gap-2 h-14"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* System Log */}
            <div className="glass-panel p-6 bg-[#050a10]/50 h-[300px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6a8099]">Kernel Diagnostics</span>
              </div>
              <div className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[#6a8099] opacity-30">[{log.time}]</span>
                    <span className={log.type === 'error' ? 'text-secondary font-bold' : log.type === 'warning' ? 'text-[#ffcc44]' : 'text-success'}>
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Simulator;
