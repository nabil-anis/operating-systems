import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { 
  Network, 
  Plus, 
  Trash2, 
  Play, 
  Zap, 
  Cpu, 
  Activity, 
  LayoutGrid, 
  ShieldCheck, 
  AlertTriangle,
  History,
  Terminal
} from 'lucide-react';
import { GridNode, GridEdge } from '../types';

const PIDS = ['P1', 'P2', 'P3', 'P4'];
const RIDS = ['R1', 'R2', 'R3', 'R4'];

const Detect: React.FC = () => {
  const [nodes, setNodes] = useState<GridNode[]>([]);
  const [edges, setEdges] = useState<GridEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ type: string; msg: string; time: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'banker' | 'prevention' | 'recovery'>('banker');
  const [bankerData, setBankerData] = useState([
    { p: 'P1', alloc: 1, max: 3, need: 2 },
    { p: 'P2', alloc: 2, max: 5, need: 3 },
    { p: 'P3', alloc: 1, max: 2, need: 1 },
    { p: 'P4', alloc: 0, max: 4, need: 4 },
  ]);
  const [bankerResult, setBankerResult] = useState<{ safe: boolean; seq: string[] } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addLog = (type: string, msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { type, msg, time }].slice(-5));
  };

  const addProcess = () => {
    if (nodes.filter(n => n.type === 'process').length >= 4) return;
    const id = PIDS[nodes.filter(n => n.type === 'process').length];
    const newNode: GridNode = {
      id,
      type: 'process',
      label: id,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      status: 'normal',
      color: '#00d4ff'
    };
    setNodes(prev => [...prev, newNode]);
    addLog('success', `Added process ${id}`);
  };

  const addResource = () => {
    if (nodes.filter(n => n.type === 'resource').length >= 4) return;
    const id = RIDS[nodes.filter(n => n.type === 'resource').length];
    const newNode: GridNode = {
      id,
      type: 'resource',
      label: id,
      x: 300 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      status: 'normal',
      color: '#7c6ff7'
    };
    setNodes(prev => [...prev, newNode]);
    addLog('info', `Added resource ${id}`);
  };

  const handleNodeClick = (id: string) => {
    if (!selectedNodeId) {
      setSelectedNodeId(id);
      addLog('info', `Selected ${id}. Click another node to connect.`);
    } else if (selectedNodeId === id) {
      setSelectedNodeId(null);
    } else {
      const fromNode = nodes.find(n => n.id === selectedNodeId);
      const toNode = nodes.find(n => n.id === id);
      if (fromNode && toNode) {
        const type = fromNode.type === 'process' ? 'requests' : 'holds';
        const newEdge: GridEdge = {
          id: `e-${Date.now()}`,
          from: selectedNodeId,
          to: id,
          type: type as any,
          status: 'active'
        };
        setEdges(prev => [...prev, newEdge]);
        addLog('warning', `Connected ${selectedNodeId} → ${id} (${type})`);
      }
      setSelectedNodeId(null);
    }
  };

  const checkDeadlock = () => {
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => adj[e.from].push(e.to));

    const hasCycle = (id: string, visited: Set<string>, stack: Set<string>): boolean => {
      if (stack.has(id)) return true;
      if (visited.has(id)) return false;
      visited.add(id);
      stack.add(id);
      for (const neighbor of adj[id] || []) {
        if (hasCycle(neighbor, visited, stack)) return true;
      }
      stack.delete(id);
      return false;
    };

    const visited = new Set<string>();
    for (const node of nodes) {
      if (hasCycle(node.id, visited, new Set())) return true;
    }
    return false;
  };

  const isDeadlocked = checkDeadlock();

  const runBanker = () => {
    const total = 8;
    const currentAlloc = bankerData.reduce((acc, curr) => acc + curr.alloc, 0);
    let avail = total - currentAlloc;
    
    let work = avail;
    let finish = bankerData.map(() => false);
    let seq: string[] = [];
    let possible = true;

    while (possible) {
      possible = false;
      for (let i = 0; i < bankerData.length; i++) {
        if (!finish[i] && bankerData[i].need <= work) {
          work += bankerData[i].alloc;
          finish[i] = true;
          seq.push(bankerData[i].p);
          possible = true;
        }
      }
    }

    setBankerResult({ safe: seq.length === bankerData.length, seq });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    edges.forEach(edge => {
      const from = nodes.find(n => n.id === edge.from);
      const to = nodes.find(n => n.id === edge.to);
      if (from && to) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = isDeadlocked ? '#ff3b3b' : 'rgba(0, 212, 255, 0.4)';
        ctx.setLineDash(edge.type === 'requests' ? [5, 5] : []);
        ctx.stroke();
        
        // Arrowhead
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        ctx.beginPath();
        const headlen = 10;
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = isDeadlocked ? '#ff3b3b' : 'rgba(0, 212, 255, 0.4)';
        ctx.fill();
        ctx.setLineDash([]);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      if (node.type === 'process') {
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
      } else {
        ctx.rect(node.x - 22, node.y - 22, 44, 44);
      }
      ctx.fillStyle = 'rgba(10, 18, 32, 0.9)';
      ctx.fill();
      ctx.strokeStyle = selectedNodeId === node.id ? '#fff' : (isDeadlocked ? '#ff3b3b' : node.color || '#fff');
      ctx.lineWidth = selectedNodeId === node.id ? 3 : 2;
      ctx.stroke();
      
      ctx.fillStyle = isDeadlocked ? '#ff3b3b' : node.color || '#fff';
      ctx.font = 'bold 12px Sora';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y + 5);
    });
  }, [nodes, edges, selectedNodeId, isDeadlocked]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Workspace */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-1 border-border-dim overflow-hidden relative">
              <div className="absolute top-4 left-6 flex items-center gap-3 z-10 pointer-events-none">
                <Network className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6a8099]">Resource Allocation Graph Builder</span>
              </div>
              <div className="absolute top-4 right-6 pointer-events-none z-10">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDeadlocked ? 'text-secondary' : 'text-success'}`}>
                  {isDeadlocked ? 'Cycle Detected' : 'Monitoring Flow'}
                </span>
              </div>
              
              <canvas 
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full bg-[#050a10]/50 cursor-crosshair block"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const hit = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 30);
                  if (hit) handleNodeClick(hit.id);
                  else setSelectedNodeId(null);
                }}
              />

              <div className="p-4 border-t border-border-dim flex gap-4 flex-wrap">
                <button onClick={addProcess} className="btn-ghost flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Process
                </button>
                <button onClick={addResource} className="btn-ghost flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Resource
                </button>
                <button onClick={() => { setNodes([]); setEdges([]); setLogs([]); }} className="px-6 py-3 rounded-lg border border-secondary/30 text-secondary hover:bg-secondary/10 font-bold text-xs uppercase tracking-widest transition-all">
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="flex items-center gap-3 mb-4">
                <History className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6a8099]">RAG Analysis Output</span>
              </div>
              <div className="font-mono text-[11px] space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                {logs.length === 0 && <div className="text-[#6a8099] italic">Waiting for graph input...</div>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[#6a8099] opacity-50">[{log.time}]</span>
                    <span className={log.type === 'error' ? 'text-secondary' : log.type === 'success' ? 'text-success' : 'text-primary'}>
                      {log.msg}
                    </span>
                  </div>
                ))}
                {isDeadlocked && <div className="text-secondary font-bold uppercase tracking-widest py-2">⚠ DEADLOCK CONFIRMED: Circular wait detected in RAG graph.</div>}
              </div>
            </div>
          </div>

          {/* Algorithm Playground */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6">
              <div className="flex gap-2 mb-8">
                {(['banker', 'prevention', 'recovery'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary/10 text-primary border border-primary/20' : 'text-[#6a8099] border border-transparent'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'banker' && (
                <div className="space-y-6">
                  <p className="text-[11px] text-[#6a8099] leading-relaxed">
                    Edit Max Need values. Banker's check if system stays in safe state. Total resources = 8.
                  </p>
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-[#6a8099] border-b border-border-dim">
                      <tr>
                        <th className="pb-3 px-1">ID</th>
                        <th className="pb-3 px-1">ALLOC</th>
                        <th className="pb-3 px-1">MAX</th>
                        <th className="pb-3 px-1">NEED</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#e0eaf5]">
                      {bankerData.map((row, i) => (
                        <tr key={i} className="border-b border-border-dim/5">
                          <td className="py-4 px-1">{row.p}</td>
                          <td className="py-4 px-1 font-mono">{row.alloc}</td>
                          <td className="py-4 px-1">
                            <input 
                              type="number" 
                              className="w-12 bg-primary/5 border border-border-dim rounded p-1 text-center font-mono outline-none focus:border-primary"
                              value={row.max}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const newVal = [...bankerData];
                                newVal[i].max = val;
                                newVal[i].need = Math.max(0, val - row.alloc);
                                setBankerData(newVal);
                              }}
                            />
                          </td>
                          <td className="py-4 px-1 font-mono text-primary">{row.need}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={runBanker} className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-3">
                    <ShieldCheck className="w-5 h-5" /> Safety Check
                  </button>
                  <AnimatePresence>
                    {bankerResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${bankerResult.safe ? 'bg-success/5 border-success/20 text-success' : 'bg-secondary/5 border-secondary/20 text-secondary'}`}
                      >
                        <div className="text-[10px] uppercase font-bold tracking-widest mb-1">Result: {bankerResult.safe ? 'Safe' : 'Unsafe'}</div>
                        <div className="text-xs font-bold">
                          {bankerResult.safe 
                            ? `Safe Sequence Found: ${bankerResult.seq.join(' → ')}` 
                            : 'No safe sequence exists. Potential deadlock.'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === 'prevention' && (
                <div className="space-y-4">
                  {[
                    { icon: ShieldCheck, title: 'Mutual Exclusion', desc: 'Allow resource sharing where possible (e.g., read-only data streams).' },
                    { icon: LayoutGrid, title: 'Hold & Wait', desc: 'Force systems to declare all resources upfront before execution starts.' },
                    { icon: AlertTriangle, title: 'No Preemption', desc: 'Enable kernel to forcibly take resources from lower priority idle tasks.' },
                    { icon: Network, title: 'Circular Wait', desc: 'Enforce a global hierarchy for resource acquisition (Strict ID Ordering).' }
                  ].map((item, i) => (
                    <div key={i} className="p-5 border-l-2 border-primary bg-primary/5 rounded-r-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-primary" />
                        <h4 className="text-[12px] font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#6a8099] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'recovery' && (
                <div className="space-y-6">
                  <p className="text-[11px] text-[#6a8099] leading-relaxed">
                    Deadlock detected. Select a directive to restore the Smart City grid.
                  </p>
                  <div className="space-y-4">
                    <button className="w-full p-6 bg-secondary/5 border border-secondary/20 rounded-2xl text-left transition-all hover:bg-secondary/10 group">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-4 h-4 text-secondary group-hover:scale-125 transition-transform" />
                        <h4 className="text-xs font-bold text-secondary uppercase tracking-widest">Process Termination</h4>
                      </div>
                      <p className="text-[10px] text-[#6a8099] leading-relaxed">Abort one or more deadlocked systems to free held resources immediately.</p>
                    </button>
                    <button className="w-full p-6 bg-accent/5 border border-accent/20 rounded-2xl text-left transition-all hover:bg-accent/10 group">
                      <div className="flex items-center gap-3 mb-2">
                        <Cpu className="w-4 h-4 text-accent group-hover:scale-125 transition-transform" />
                        <h4 className="text-xs font-bold text-accent uppercase tracking-widest">Resource Preemption</h4>
                      </div>
                      <p className="text-[10px] text-[#6a8099] leading-relaxed">Forcibly take resources from a "victim" process and grant them to another.</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Detect;
