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
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Info
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
  
  // Custom explanations states
  const [fixExplanation, setFixExplanation] = useState<string | null>(null);
  const [bankerSteps, setBankerSteps] = useState<string[]>([]);
  
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
    
    // Position sequentially or slightly scattered in upper half
    const count = nodes.filter(n => n.type === 'process').length;
    const newNode: GridNode = {
      id,
      type: 'process',
      label: id,
      x: 150 + count * 150,
      y: 120,
      status: 'normal',
      color: '#00d4ff'
    };
    setNodes(prev => [...prev, newNode]);
    addLog('success', `Added process ${id}`);
    setFixExplanation(null);
  };

  const addResource = () => {
    if (nodes.filter(n => n.type === 'resource').length >= 4) return;
    const id = RIDS[nodes.filter(n => n.type === 'resource').length];
    
    // Position sequentially or scattered in lower half
    const count = nodes.filter(n => n.type === 'resource').length;
    const newNode: GridNode = {
      id,
      type: 'resource',
      label: id,
      x: 150 + count * 150,
      y: 280,
      status: 'normal',
      color: '#7c6ff7'
    };
    setNodes(prev => [...prev, newNode]);
    addLog('info', `Added resource ${id}`);
    setFixExplanation(null);
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
        if (fromNode.type === toNode.type) {
          addLog('error', 'Cannot connect nodes of the same category (Process to Process or Resource to Resource).');
          setSelectedNodeId(null);
          return;
        }

        // Standard RAG rules:
        // Process -> Resource = requests (waiting for resource)
        // Resource -> Process = holds (allocated to process)
        const type = fromNode.type === 'process' ? 'requests' : 'holds';
        
        // Prevent duplicate edges
        if (edges.some(e => e.from === selectedNodeId && e.to === id)) {
          addLog('error', 'Hold/Request link already exists in network registry.');
          setSelectedNodeId(null);
          return;
        }

        const newEdge: GridEdge = {
          id: `e-${Date.now()}`,
          from: selectedNodeId,
          to: id,
          type: type as any,
          status: 'active'
        };

        setEdges(prev => [...prev, newEdge]);
        addLog('warning', `Established vector: ${selectedNodeId} ➔ ${id} (${type === 'requests' ? 'request wait' : 'holding allocation'})`);
        setFixExplanation(null);
      }
      setSelectedNodeId(null);
    }
  };

  // Traces full circular dependencies recursively (DFS)
  const findDeadlockCycles = (): string[][] => {
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => adj[e.from].push(e.to));

    const cycles: string[][] = [];
    const visited = new Set<string>();
    const tempStack: string[] = [];
    const inStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      tempStack.push(nodeId);
      inStack.add(nodeId);

      for (const neighbor of adj[nodeId] || []) {
        if (inStack.has(neighbor)) {
          const startIdx = tempStack.indexOf(neighbor);
          if (startIdx !== -1) {
            const path = tempStack.slice(startIdx);
            path.push(neighbor); // closes the loop for verbal tracing
            cycles.push(path);
          }
          return true;
        } else if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        }
      }

      tempStack.pop();
      inStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    }
    return cycles;
  };

  const activeCycles = findDeadlockCycles();
  const isDeadlocked = activeCycles.length > 0;

  // Preset Scenario loader to save time
  const loadPreset = (presetName: 'simple' | 'multi' | 'nominal') => {
    setFixExplanation(null);
    setSelectedNodeId(null);
    setLogs([]);
    
    if (presetName === 'simple') {
      const presetNodes: GridNode[] = [
        { id: 'P1', type: 'process', label: 'P1', x: 220, y: 120, status: 'normal', color: '#00d4ff' },
        { id: 'R1', type: 'resource', label: 'R1', x: 220, y: 280, status: 'normal', color: '#7c6ff7' },
        { id: 'P2', type: 'process', label: 'P2', x: 480, y: 120, status: 'normal', color: '#00d4ff' },
        { id: 'R2', type: 'resource', label: 'R2', x: 480, y: 280, status: 'normal', color: '#7c6ff7' }
      ];
      const presetEdges: GridEdge[] = [
        { id: 'e1', from: 'P1', to: 'R1', type: 'requests', status: 'active' },
        { id: 'e2', from: 'R1', to: 'P2', type: 'holds', status: 'active' },
        { id: 'e3', from: 'P2', to: 'R2', type: 'requests', status: 'active' },
        { id: 'e4', from: 'R2', to: 'P1', type: 'holds', status: 'active' }
      ];
      setNodes(presetNodes);
      setEdges(presetEdges);
      addLog('warning', 'Loaded Scenario: 2-System Cross-Hold Deadlock Loop.');
    } else if (presetName === 'multi') {
      const presetNodes: GridNode[] = [
        { id: 'P1', type: 'process', label: 'P1', x: 180, y: 120, status: 'normal', color: '#00d4ff' },
        { id: 'R1', type: 'resource', label: 'R1', x: 180, y: 280, status: 'normal', color: '#7c6ff7' },
        { id: 'P2', type: 'process', label: 'P2', x: 400, y: 120, status: 'normal', color: '#00d4ff' },
        { id: 'R2', type: 'resource', label: 'R2', x: 400, y: 280, status: 'normal', color: '#7c6ff7' },
        { id: 'P3', type: 'process', label: 'P3', x: 620, y: 120, status: 'normal', color: '#00d4ff' },
        { id: 'R3', type: 'resource', label: 'R3', x: 620, y: 280, status: 'normal', color: '#7c6ff7' }
      ];
      const presetEdges: GridEdge[] = [
        { id: 'e1', from: 'P1', to: 'R1', type: 'requests', status: 'active' },
        { id: 'e2', from: 'R1', to: 'P2', type: 'holds', status: 'active' },
        { id: 'e3', from: 'P2', to: 'R2', type: 'requests', status: 'active' },
        { id: 'e4', from: 'R2', to: 'P3', type: 'holds', status: 'active' },
        { id: 'e5', from: 'P3', to: 'R3', type: 'requests', status: 'active' },
        { id: 'e6', from: 'R3', to: 'P1', type: 'holds', status: 'active' }
      ];
      setNodes(presetNodes);
      setEdges(presetEdges);
      addLog('warning', 'Loaded Scenario: 3-System High-Density Transit Lock.');
    } else if (presetName === 'nominal') {
      const presetNodes: GridNode[] = [
        { id: 'P1', type: 'process', label: 'P1', x: 220, y: 120, status: 'normal', color: '#00d4ff' },
        { id: 'R1', type: 'resource', label: 'R1', x: 220, y: 280, status: 'normal', color: '#7c6ff7' },
        { id: 'P2', type: 'process', label: 'P2', x: 480, y: 120, status: 'normal', color: '#00d4ff' },
        { id: 'R2', type: 'resource', label: 'R2', x: 480, y: 280, status: 'normal', color: '#7c6ff7' }
      ];
      const presetEdges: GridEdge[] = [
        { id: 'e1', from: 'P1', to: 'R1', type: 'requests', status: 'active' },
        { id: 'e2', from: 'R1', to: 'P2', type: 'holds', status: 'active' },
        { id: 'e3', from: 'P2', to: 'R2', type: 'requests', status: 'active' }
      ];
      setNodes(presetNodes);
      setEdges(presetEdges);
      addLog('success', 'Loaded Scenario: Healthy Sequential Request Line (Safe).');
    }
  };

  // Dynamic fix actions: Terminate Process in Cycle
  const handleTerminateProcessFromCycle = (procId: string) => {
    setNodes(prev => prev.filter(n => n.id !== procId));
    setEdges(prev => prev.filter(e => e.from !== procId && e.to !== procId));
    
    setFixExplanation(
       `🔄 **Simulated SIGKILL Terminate on ${procId}**: Successfully truncated process core. ` +
       `This immediately reclaimed all resource locks held by ${procId}, unblocking the cyclic chain so that other processes can immediately execute.`
    );
    addLog('success', `Manually recovered grid: Core SIGKILL on ${procId}`);
  };

  // Dynamic fix actions: Preempt Resource from original owner & allocate to waiting process
  const handlePreemptResourceFromCycle = (rId: string, originalOwnerId: string, beneficiaryId: string) => {
    setEdges(prev => {
      // 1. Remove hold allocation from Resource -> OriginalOwner
      let resultEdges = prev.filter(e => !(e.from === rId && e.to === originalOwnerId && e.type === 'holds'));
      // 2. Conver the waiting request Process -> Resource into Resource -> Process (hold) for beneficiary
      return resultEdges.map(e => {
        if (e.from === beneficiaryId && e.to === rId && e.type === 'requests') {
          return {
            ...e,
            from: rId,
            to: beneficiaryId,
            type: 'holds' as const
          };
        }
        return e;
      });
    });

    setFixExplanation(
      `⚡ **Simulated Preemption vector executed**: Revoked allocation of Resource ${rId} from process ${originalOwnerId} ` +
      `and allocated it directly to waiting beneficiary ${beneficiaryId}. ` +
      `This breaks the Hold & Wait constraint and collapses the deadlock cycle path instantly!`
    );
    addLog('success', `Preempted resource ${rId} from ${originalOwnerId} ── Allocated to ${beneficiaryId}`);
  };

  // Explanatory Bankers safety calculations tracker
  const runBanker = () => {
    const total = 8;
    const currentAlloc = bankerData.reduce((acc, curr) => acc + curr.alloc, 0);
    let avail = total - currentAlloc;
    let steps: string[] = [];

    steps.push(`[System Configuration] Core capacity limit: 8 units. Currently allocated: ${currentAlloc} units.`);
    steps.push(`[System Configuration] Initial available working workspace pool = Cap (8) - Allocated (${currentAlloc}) = ${avail} units.`);

    let work = avail;
    let finish = bankerData.map(() => false);
    let seq: string[] = [];
    let possible = true;
    let round = 1;

    while (possible) {
      possible = false;
      steps.push(`[Iteration Stage ${round}] Search for unexecuted process where Deficit ≤ Available (${work} units)...`);

      for (let i = 0; i < bankerData.length; i++) {
        if (finish[i]) continue;
        const row = bankerData[i];
        steps.push(`   - Analyzing ${row.p}: Alloc: ${row.alloc}, Need: ${row.need}. (Need ${row.need} ≤ ${work} Work? ${row.need <= work ? 'YES ✓' : 'NO ❌'})`);

        if (row.need <= work) {
          work += row.alloc;
          finish[i] = true;
          seq.push(row.p);
          possible = true;
          steps.push(`     ✓ SUCCESS: Transitioning ${row.p}'s state. Run simulation, release locks.`);
          steps.push(`     ➔ RECLAIM: Released ${row.p}'s hold allocation of ${row.alloc} units. Available working pool increases to ${work} units.`);
          break; // restart outer loop search with new updated available workspace
        }
      }
      round++;
      if (seq.length === bankerData.length) break;
    }

    const isSafe = seq.length === bankerData.length;
    if (isSafe) {
      steps.push(`[VERDICT: RECOVERY SECURED] A safe order of non-contested operations exists: [${seq.join(' ➔ ')}]. Standard Banker scheduler secures total deadlock prevention.`);
    } else {
      const remaining = bankerData.filter((_, idx) => !finish[idx]).map(r => r.p);
      steps.push(`[VERDICT: DEADLOCK RISK DETECTED] Unsafe deadlock path discovered. Remaining cores [${remaining.join(', ')}] will starve under maximum workload.`);
    }

    setBankerSteps(steps);
    setBankerResult({ safe: isSafe, seq });
  };

  // Live Canvas Hook Rendering Loop
  useEffect(() => {
    let animationId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth;
      const H = 360;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, W, H);
      
      // Cyber City grid line scan overlay
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const cycleKeys = new Set<string>();
      activeCycles.forEach(path => {
        for (let i = 0; i < path.length - 1; i++) {
          cycleKeys.add(`${path[i]}->${path[i+1]}`);
        }
      });

      // Simple edge helper
      const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, dash: boolean, isCycleEdge: boolean) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = isCycleEdge ? 3.5 : 2;
        if (isCycleEdge) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ff3b3b';
        }
        if (dash) ctx.setLineDash([6, 4]);
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
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const isCycleEdge = cycleKeys.has(`${edge.from}->${edge.to}`);
        let edgeColor = 'rgba(0, 212, 255, 0.45)';
        
        if (isCycleEdge) {
          edgeColor = '#ff3b3b';
        } else if (edge.type === 'holds') {
          edgeColor = '#00e676';
        } else if (edge.type === 'requests') {
          edgeColor = '#ffb300';
        }

        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const radiusOffset = 25;
        const x1 = fromNode.x + radiusOffset * Math.cos(angle);
        const y1 = fromNode.y + radiusOffset * Math.sin(angle);
        const x2 = toNode.x - radiusOffset * Math.cos(angle);
        const y2 = toNode.y - radiusOffset * Math.sin(angle);

        drawArrow(x1, y1, x2, y2, edgeColor, edge.type === 'requests', isCycleEdge);
      });

      // Draw Nodes
      nodes.forEach(node => {
        const inCycle = activeCycles.some(path => path.includes(node.id));
        const isProcess = node.type === 'process';

        ctx.save();
        
        // Dynamic node glows
        ctx.shadowBlur = inCycle ? 18 : (selectedNodeId === node.id ? 12 : 6);
        ctx.shadowColor = inCycle ? '#ff3b3b' : (selectedNodeId === node.id ? '#ffffff' : (node.color || '#7c6ff7'));

        ctx.beginPath();
        if (isProcess) {
          ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        } else {
          const size = 25;
          ctx.moveTo(node.x, node.y - size);
          ctx.lineTo(node.x + size, node.y);
          ctx.lineTo(node.x, node.y + size);
          ctx.lineTo(node.x - size, node.y);
          ctx.closePath();
        }

        ctx.fillStyle = 'rgba(7, 13, 23, 0.95)';
        ctx.fill();

        let strokeColor = node.color || '#7c6ff7';
        if (inCycle) {
          strokeColor = '#ff3b3b';
        } else if (selectedNodeId === node.id) {
          strokeColor = '#ffffff';
        }
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = (selectedNodeId === node.id || inCycle) ? 3 : 2;
        ctx.stroke();
        ctx.restore();

        // Label details inside shape
        ctx.fillStyle = inCycle ? '#ff3b3b' : (selectedNodeId === node.id ? '#ffffff' : strokeColor);
        ctx.font = 'bold 11px Sora';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, node.x, node.y + 4);
        
        ctx.fillStyle = '#6a8099';
        ctx.font = '8px Sora';
        ctx.fillText(isProcess ? 'PROCESS' : 'RESOURCE', node.x, node.y + 36);
      });
    };

    render();
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [nodes, edges, selectedNodeId, activeCycles]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Page Titles */}
        <div className="mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-bold tracking-widest uppercase mb-2">
            GRID PROMPT PROTOCOL // DETECT-FIX.EXE
          </div>
          <h1 className="text-white text-3xl font-display font-black tracking-tight uppercase italic leading-none">
            RAG DIAGNOSTICS & FIX LABORATORY
          </h1>
          <p className="text-[#6a8099] text-xs max-w-2xl">
            Build and analyze real-time Resource Allocation Graphs (RAG) to detect circular holding loops, or edit Banker's Matrix rows to compute multi-variable safety paths dynamically.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: Main Workspace */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-1 border-border-dim overflow-hidden relative">
              <div className="absolute top-4 left-6 flex items-center gap-3 z-10 pointer-events-none">
                <Network className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6a8099]">Interactive RAG Grid Canvas</span>
              </div>
              <div className="absolute top-4 right-6 pointer-events-none z-10">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDeadlocked ? 'text-secondary animate-pulse' : 'text-success'}`}>
                  {isDeadlocked ? '● Circular Wait Detected' : '● Grid Active'}
                </span>
              </div>
              
              <canvas 
                ref={canvasRef}
                height={360}
                className="w-full bg-[#050a10]/50 block border-b border-border-dim/20"
                onClick={(e) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const rect = canvas.getBoundingClientRect();
                  
                  // Coordinate scaling mapping to logical sizes
                  const scaleX = canvas.offsetWidth / rect.width;
                  const scaleY = 360 / rect.height;
                  const x = (e.clientX - rect.left) * scaleX;
                  const y = (e.clientY - rect.top) * scaleY;
                  
                  const hit = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 30);
                  if (hit) handleNodeClick(hit.id);
                  else setSelectedNodeId(null);
                }}
              />

              {/* Canvas Controls Menu Frame */}
              <div className="p-4 bg-black/40 xl:flex items-center justify-between gap-4 flex-wrap grid grid-cols-1 sm:grid-cols-2">
                <div className="flex gap-2">
                  <button onClick={addProcess} className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" /> + Process
                  </button>
                  <button onClick={addResource} className="px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" /> + Resource
                  </button>
                </div>
                
                <div className="flex gap-1.5 items-center bg-black/50 p-1 border border-border-dim rounded-xl">
                  <span className="text-[9px] font-bold text-[#6a8099] uppercase tracking-widest px-2">Presets:</span>
                  <button onClick={() => loadPreset('simple')} className="px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-[#7c6ff7]/10 text-[9px] font-bold text-[#6a8099] hover:text-[#7c6ff7] uppercase transition-all">
                    2-Way Loop
                  </button>
                  <button onClick={() => loadPreset('multi')} className="px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-[#7c6ff7]/10 text-[9px] font-bold text-[#6a8099] hover:text-[#7c6ff7] uppercase transition-all">
                    3-Way Loop
                  </button>
                  <button onClick={() => loadPreset('nominal')} className="px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-border-dim/20 text-[9px] font-bold text-[#6a8099] hover:text-white uppercase transition-all">
                    No-Loop Healthy
                  </button>
                </div>

                <button onClick={() => { setNodes([]); setEdges([]); setLogs([]); setFixExplanation(null); }} className="px-4 py-2.5 rounded-xl border border-secondary/30 text-secondary hover:bg-secondary/10 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Trash2 className="w-3.5 h-3.5" /> Clear Map
                </button>
              </div>
            </div>

            {/* LIVE CYCLE PATH EXPLANATION CONSOLE */}
            <AnimatePresence mode="wait">
              {isDeadlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="glass-panel p-6 border-secondary/30 bg-secondary/[0.02] space-y-4"
                >
                  <div className="flex items-center gap-2.5 text-secondary font-black text-xs uppercase tracking-widest border-b border-secondary/10 pb-3">
                    <AlertTriangle className="w-4 h-4 animate-ping" /> Dynamic DFS Cycle Path Trace Results
                  </div>
                  
                  <div className="space-y-4">
                    {activeCycles.map((path, idx) => (
                      <div key={idx} className="bg-black/30 p-4 rounded-xl border border-secondary/10 space-y-2">
                        <div className="font-mono text-[10.5px] font-black text-secondary uppercase tracking-widest">
                          ⚡ CYCLE DETECTED #{idx + 1}: {path.join(' ──➔ ')}
                        </div>
                        <p className="text-[#a0afca] text-[10.5px] leading-relaxed">
                          Process <span className="text-white font-bold">{path[0]}</span> requests Resource <span className="text-white font-bold">{path[1]}</span>, which is currently held by Process <span className="text-white font-bold">{path[2]}</span>. This creates a circular dependancy.
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* COFFMANS MODULE EXPLAINER */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                      { cond: 'Mutual Exclusion', icon: ShieldCheck, status: 'Active (Non-Sharable)' },
                      { cond: 'Hold & Wait', icon: LayoutGrid, status: 'Active (Circular Waits)' },
                      { cond: 'No Preemption', icon: AlertTriangle, status: 'Active (Cannot Force)' },
                      { cond: 'Circular Wait', icon: Network, status: 'Active (Deadlocked Loop)' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-black/50 border border-border-dim rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5">
                          <item.icon className="w-3.5 h-3.5 text-secondary" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-wider">{item.cond}</span>
                        </div>
                        <div className="text-[8.5px] font-mono text-secondary uppercase font-semibold">{item.status}</div>
                      </div>
                    ))}
                  </div>

                  {/* INTERACTIVE SOLVING ACTION DECKS */}
                  <div className="pt-2 border-t border-secondary/10 space-y-3">
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      // Select an interactive fixing routine to dismantle the cycle:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* FIX OPTION 1: TERMINATION LIST */}
                      <div className="p-4 bg-black/40 border border-border-dim rounded-xl space-y-3">
                        <div className="text-[9.5px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-secondary" /> Prune Process Core (Abortion)
                        </div>
                        <p className="text-[10px] text-[#6a8099]">Terminate one system component to instantly recall safety tokens:</p>
                        <div className="flex gap-2 flex-wrap">
                          {nodes.filter(n => n.type === 'process').map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleTerminateProcessFromCycle(p.id)}
                              className="px-3 py-1.5 rounded bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 font-mono text-[10px] text-secondary font-bold transition-all"
                            >
                              SIGKILL {p.id}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* FIX OPTION 2: PREEMPTION SELECTOR */}
                      <div className="p-4 bg-black/40 border border-border-dim rounded-xl space-y-3">
                        <div className="text-[9.5px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-primary" /> Forced Preemption Shift
                        </div>
                        <p className="text-[10px] text-[#6a8099]">Forcibly swap resource lock from cycle process to waiting thread:</p>
                        <div className="space-y-1.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                          {/* Dynamically search for preemptable holds in RAG */}
                          {(() => {
                            const holdsInCycle: { rId: string; owner: string; requestor: string }[] = [];
                            edges.forEach(e => {
                              if (e.type === 'holds' && nodes.some(n => n.id === e.from && n.type === 'resource')) {
                                const rId = e.from;
                                const owner = e.to;
                                // find if someone else requests rId
                                const waiting = edges.find(we => we.to === rId && we.type === 'requests');
                                if (waiting) {
                                  holdsInCycle.push({ rId, owner, requestor: waiting.from });
                                }
                              }
                            });

                            if (holdsInCycle.length === 0) {
                              return <div className="text-[9.5px] text-[#6a8099] italic">No active hold/request combinations.</div>;
                            }

                            return holdsInCycle.map((h, i) => (
                              <button
                                key={i}
                                onClick={() => handlePreemptResourceFromCycle(h.rId, h.owner, h.requestor)}
                                className="w-full text-left px-3 py-2 rounded bg-primary/5 hover:bg-primary/10 border border-primary/20 text-[9.5px] font-mono font-bold text-primary flex justify-between items-center transition-all"
                              >
                                <span>Preempt {h.rId} from {h.owner} ➔ {h.requestor}</span>
                                <RefreshCw className="w-3 h-3 text-primary" />
                              </button>
                            ));
                          })()}
                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* VERBAL GENERAL WORKSPACE RECOVERY LOG DETAILS */}
            <AnimatePresence mode="wait">
              {fixExplanation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 border-l-4 border-success bg-success/[0.02] border border-success/20 rounded-r-2xl space-y-2"
                >
                  <div className="flex items-center gap-2 text-success font-black text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-success" /> RESOLUTION SYSTEM REPORT
                  </div>
                  <p className="text-[#a0afca] text-[11px] leading-relaxed font-sans">{fixExplanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass-panel p-6">
              <div className="flex items-center gap-3 mb-4">
                <History className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6a8099]">RAG Graph Connection History</span>
              </div>
              <div className="font-mono text-[11px] space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                {logs.length === 0 && <div className="text-[#6a8099] italic">Ready for input. Connect a Process (ID P) to a Resource (ID R) to map topology.</div>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[#6a8099] opacity-40">[{log.time}]</span>
                    <span className={log.type === 'error' ? 'text-secondary' : log.type === 'success' ? 'text-success' : 'text-primary'}>
                      {log.msg}
                    </span>
                  </div>
                ))}
                {isDeadlocked && (
                  <div className="text-secondary font-bold uppercase tracking-widest py-1 border-t border-secondary/10 mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> STATE CRITICAL: DIRECTED CYCLE CAPTURED BY DFS MONITOR.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Algorithm Playground */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6">
              <div className="flex gap-2 mb-8 border-b border-border-dim/20 pb-4">
                {(['banker', 'prevention', 'recovery'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary/10 text-primary border border-primary/20 shadow-md' : 'text-[#6a8099] border border-transparent'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'banker' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider">// Banker's Safety Engine</h3>
                    <p className="text-[10.5px] text-[#6a8099] leading-relaxed">
                      Toggle total Max Deficit allocations. The Banker checks if allocating resources keeps the grid system in a mathematically safe trace sequence. Total City Pool = 8.
                    </p>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead className="text-[#6a8099] border-b border-border-dim">
                      <tr>
                        <th className="pb-3 px-1 font-bold">CORE</th>
                        <th className="pb-3 px-1 font-bold">ALLOC</th>
                        <th className="pb-3 px-1 font-bold">MAX</th>
                        <th className="pb-3 px-0.5 font-bold">DEFICIT (NEED)</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#e0eaf5]">
                      {bankerData.map((row, i) => (
                        <tr key={i} className="border-b border-border-dim/5">
                          <td className="py-3 px-1 font-bold text-white">{row.p}</td>
                          <td className="py-3 px-1 font-mono text-[#00d4ff]">{row.alloc}</td>
                          <td className="py-3 px-1">
                            <input 
                              type="number" 
                              className="w-12 bg-primary/5 border border-border-dim/50 rounded-lg p-1 text-center font-mono outline-none text-white focus:border-primary/80"
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
                          <td className="py-3 px-0.5 font-mono text-primary font-bold">{row.need}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button onClick={runBanker} className="btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Calculate Safety Safe Sequences
                  </button>

                  <AnimatePresence>
                    {bankerResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${bankerResult.safe ? 'bg-success/5 border-success/20 text-success' : 'bg-secondary/5 border-secondary/20 text-secondary'}`}
                      >
                        <div className="text-[10px] uppercase font-bold tracking-widest mb-1">Verdict Result: {bankerResult.safe ? 'Safe' : 'Unsafe Warning'}</div>
                        <div className="text-[10.5px] font-bold">
                          {bankerResult.safe 
                            ? `Safe Sequence Found: ${bankerResult.seq.join(' ──➔ ')}` 
                            : 'No safe state sequences exist within pool. Immediate risk of circular locking deadlock.'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* HIGHLY EXPLANATORY STEP-BY-STEP TERMINAL ANALYSIS */}
                  <AnimatePresence>
                    {bankerSteps.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 bg-black/40 border border-border-dim rounded-xl max-h-[240px] overflow-y-auto custom-scrollbar space-y-2.5"
                      >
                        <div className="text-[9px] text-[#6a8099] font-black uppercase tracking-widest border-b border-border-dim/20 pb-2 flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-primary animate-pulse" /> Banker's Kernal Tracing Logs
                        </div>
                        <div className="space-y-1.5 font-mono text-[9.5px] text-[#a0afca]">
                          {bankerSteps.map((stepMsg, stepIdx) => {
                            const isHeader = stepMsg.startsWith('[System') || stepMsg.startsWith('[Iteration') || stepMsg.startsWith('[VERDICT');
                            const isSuccess = stepMsg.includes('✓');
                            const isDanger = stepMsg.includes('❌') || stepMsg.includes('DEADLOCK');
                            let color = 'text-slate-400';
                            if (isHeader) color = 'text-primary font-bold mt-2';
                            if (isSuccess) color = 'text-[#00e676]';
                            if (isDanger) color = 'text-secondary';
                            
                            return (
                              <div key={stepIdx} className={`${color} pl-2 border-l border-border-dim/20 leading-relaxed`}>
                                {stepMsg}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === 'prevention' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider">// Coffman Prevention Protocols</h3>
                    <p className="text-[10.5px] text-[#6a8099]">Prevent deadlocks from ever initiating by strictly neutralizing at least one Coffman condition pre-execution:</p>
                  </div>

                  {[
                    { icon: ShieldCheck, title: 'Mutual Exclusion Override', desc: 'Permit concurrent logical threads where possible. Virtualize non-sharable devices (e.g., spooling input buffers).' },
                    { icon: LayoutGrid, title: 'No Hold & Wait Allocation', desc: 'Force process threads to request and secure all required resources upfront before they are authorized to execute.' },
                    { icon: AlertTriangle, title: 'Forced Resource Preemption', desc: 'If a thread holding allocations requests more locks but gets blocked, it must release all its held items to the general pool.' },
                    { icon: Network, title: 'Strict Linear Hierarchy', desc: 'Resource request indexes are strictly ordered ascending. Threads can only claim larger IDs than they currently hold.' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 border border-border-dim bg-primary/[0.01] rounded-xl space-y-1">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-primary" />
                        <h4 className="text-[10.5px] font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-[#6a8099] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'recovery' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider">// Grid Lock Extraction Console</h3>
                    <p className="text-[10.5px] text-[#6a8099] leading-relaxed">
                      Methods implemented by operating system kernels to recover from circular blocks in raw systems:
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-secondary/[0.01] border border-secondary/20 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-secondary animate-pulse" />
                        <h4 className="text-[11px] font-bold text-secondary uppercase tracking-widest">Process Thread Termination</h4>
                      </div>
                      <p className="text-[10px] text-[#6a8099] leading-relaxed">
                        Aborting all deadlocked processes releases resource arrays immediately at a CPU instruction trace penalty, or thread targets are targeted sequentially until safety metrics return.
                      </p>
                    </div>

                    <div className="p-4 bg-primary/[0.01] border border-primary/20 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-primary animate-pulse" />
                        <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest">Resource Preemption</h4>
                      </div>
                      <p className="text-[10px] text-[#6a8099] leading-relaxed">
                        Forcibly reclaiming allocs from victim process rows allows the kernel to unblock starvation chains with rollback instruction trace saves.
                      </p>
                    </div>

                    <div className="p-3 bg-black/40 border border-border-dim rounded-xl text-center">
                      <p className="text-[9.5px] text-[#6a8099] italic leading-relaxed">
                        💡 Click "Presets" under the RAG Builder to build cyclic holds, then use the live interactive repair buttons to run this core simulation!
                      </p>
                    </div>
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
