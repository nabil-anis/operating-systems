import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import DeadlockAlert from '../components/simulator/DeadlockAlert';
import { 
  Play, 
  RotateCcw, 
  Activity, 
  Settings2, 
  ChevronDown,
  Terminal,
  ZapOff,
  AlertCircle,
  Zap,
  Trash2,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface ScenarioProcess {
  id: string;
  name: string;
  color: string;
  holds: number[]; // Initial resource indexes owned
  wants: number[]; // Initial resource indexes wanted
}

interface ScenarioResource {
  id: string;
  name: string;
}

interface Scenario {
  title: string;
  subtitle: string;
  desc: string;
  procs: ScenarioProcess[];
  res: ScenarioResource[];
  explain: { type: string; text: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    title: 'Hospital vs Power Grid',
    subtitle: '2-Process Mutual Blockade',
    desc: 'Hospital AI holds Primary Power and requests Network Bandwidth. Power Grid holds Network Bandwidth and requests Primary Power. Traditional two-way circular wait.',
    procs: [
      { id: 'P1', name: 'Hospital AI', color: '#00d4ff', holds: [0], wants: [1] },
      { id: 'P2', name: 'Power Grid', color: '#7c6ff7', holds: [1], wants: [0] }
    ],
    res: [{ id: 'R1', name: 'Primary Power' }, { id: 'R2', name: 'Network BW' }],
    explain: [
      { type: 'proc', text: 'P1 (Hospital AI) and P2 (Power Grid) are mutually blocked.' },
      { type: 'res', text: 'R1 is held by P1 but requested by P2. R2 is held by P2 but requested by P1.' },
      { type: 'cond', text: 'Circular Wait: P1 → P2 → P1 cycle confirmed.' }
    ]
  },
  {
    title: 'Multi-System Cascade',
    subtitle: '3-Process Chain Blockade',
    desc: 'Hospital AI, Train System, and Traffic Management form a three-way circular chain. Resolving this requires selectively freeing or preempting key elements.',
    procs: [
      { id: 'P1', name: 'Hospital AI', color: '#00d4ff', holds: [0], wants: [1] },
      { id: 'P2', name: 'Train System', color: '#7c6ff7', holds: [1], wants: [2] },
      { id: 'P3', name: 'Traffic Mgmt', color: '#00e676', holds: [2], wants: [0] }
    ],
    res: [{ id: 'R1', name: 'Power' }, { id: 'R2', name: 'Bandwidth' }, { id: 'R3', name: 'Emergency Grid' }],
    explain: [
      { type: 'proc', text: 'Hospital AI, Train System, and Traffic Management are in active blockade.' },
      { type: 'res', text: 'Three critical resources are locked in rotational holds.' },
      { type: 'cond', text: 'Circular Wait: P1 → P2 → P3 → P1.' }
    ]
  },
  {
    title: 'Smart City Blackout',
    subtitle: '4-Process Full-Gridlock',
    desc: 'A complete urban infrastructure deadlock loop. All four systems are deadlocked across four vital resources.',
    procs: [
      { id: 'P1', name: 'Hospital AI', color: '#00d4ff', holds: [0], wants: [1] },
      { id: 'P2', name: 'Power Grid', color: '#7c6ff7', holds: [1], wants: [2] },
      { id: 'P3', name: 'Train System', color: '#00e676', holds: [2], wants: [3] },
      { id: 'P4', name: 'Traffic Mgmt', color: '#ff8c42', holds: [3], wants: [0] }
    ],
    res: [{ id: 'R1', name: 'Power' }, { id: 'R2', name: 'Bandwidth' }, { id: 'R3', name: 'Emergency Grid' }, { id: 'R4', name: 'Central Data Bus' }],
    explain: [
      { type: 'proc', text: 'All 4 system sectors are completely at a standstill.' },
      { type: 'res', text: 'Resources are locked in parallel circular hold hierarchies.' },
      { type: 'cond', text: 'Circular Wait: P1 → P2 → P3 → P4 → P1.' }
    ]
  }
];

interface ActiveProcess {
  id: string;
  name: string;
  color: string;
  holds: number[]; // Resource index array (relative to scenario.res)
  wants: number[]; // Resource index array (relative to scenario.res)
  status: 'idle' | 'holding' | 'waiting' | 'deadlocked' | 'aborted' | 'running' | 'completed';
}

interface ActiveResource {
  id: string;
  name: string;
  heldBy: string | null; // ID of the process holding it
}

const Simulator: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeadlocked, setIsDeadlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [logs, setLogs] = useState<{ type: string; msg: string; time: string }[]>([]);
  const [resizeToggle, setResizeToggle] = useState(0);
  
  // Custom interactive tracking states
  const [currentProcs, setCurrentProcs] = useState<ActiveProcess[]>([]);
  const [currentRes, setCurrentRes] = useState<ActiveResource[]>([]);
  const [recoveryMode, setRecoveryMode] = useState<'terminate' | 'preempt' | null>('terminate');
  const [successCelebration, setSuccessCelebration] = useState<boolean>(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryLog, setRecoveryLog] = useState<string>('');
  const [activePreemption, setActivePreemption] = useState<{ rId: string; ownerPid: string; beneficiaryPid: string } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout|null>(null);
  const recoverySessionRef = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => setResizeToggle(prev => prev + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scenario = SCENARIOS[scenarioIdx];

  const addLog = (type: string, msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { type, msg, time }].slice(-12));
  };

  // Safe parameters-bound reset function
  const reset = (idx?: number) => {
    recoverySessionRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setIsDeadlocked(false);
    setSuccessCelebration(false);
    setIsRecovering(false);
    setRecoveryLog('');
    setActivePreemption(null);
    setStep(0);
    
    const activeIdx = idx !== undefined ? idx : scenarioIdx;
    const activeScenario = SCENARIOS[activeIdx];
    
    setLogs([{ type: 'info', msg: `System Audit Reset. Connected to sector grid diagnostics: ${activeScenario.title}`, time: '-' }]);
    
    // Set dynamic local simulation state
    setCurrentProcs(
      activeScenario.procs.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color,
        holds: [...p.holds],
        wants: [...p.wants],
        status: 'idle'
      }))
    );
    
    setCurrentRes(
      activeScenario.res.map((r, i) => {
        const holdingProc = activeScenario.procs.find(p => p.holds.includes(i));
        return {
          id: r.id,
          name: r.name,
          heldBy: holdingProc ? holdingProc.id : null
        };
      })
    );
  };

  // Sync initial state and resets when scenario dropdown changes
  useEffect(() => {
    reset(scenarioIdx);
  }, [scenarioIdx]);

  const start = () => {
    if (isPlaying) return;
    recoverySessionRef.current += 1;
    setIsPlaying(true);
    setStep(0);
    setSuccessCelebration(false);
    setIsDeadlocked(false);
    setIsRecovering(false);
    setRecoveryLog('');
    setActivePreemption(null);
    
    // Reset status to idle before step sequence starts
    setCurrentProcs(prev => prev.map(p => ({ ...p, status: 'idle', holds: [...scenario.procs.find(sp => sp.id === p.id)!.holds], wants: [...scenario.procs.find(sp => sp.id === p.id)!.wants] })));
    setCurrentRes(scenario.res.map((r, i) => {
      const holdingProc = scenario.procs.find(p => p.holds.includes(i));
      return { id: r.id, name: r.name, heldBy: holdingProc ? holdingProc.id : null };
    }));
    
    addLog('info', `Initializing diagnostics for Sector: ${scenario.title}`);
  };

  // Auto-simulation step trace
  useEffect(() => {
    if (isPlaying && !isDeadlocked && !successCelebration) {
      const waitTime = [2000, 1200, 600][speed - 1];
      timerRef.current = setTimeout(() => {
        if (step === 0) {
          // Transition: processes lock their respective starting resources
          setCurrentProcs(prev => prev.map(p => ({ ...p, status: 'holding' })));
          scenario.procs.forEach(p => {
            p.holds.forEach(ri => {
              addLog('success', `Thread ${p.id} (${p.name}) secured lock on ${scenario.res[ri].id} (${scenario.res[ri].name})`);
            });
          });
          setStep(1);
        } else if (step === 1) {
          // Transition: processes request their wanted resources but are blocked
          setCurrentProcs(prev => prev.map(p => ({ ...p, status: 'waiting' })));
          scenario.procs.forEach(p => {
            p.wants.forEach(ri => {
              const resObj = scenario.res[ri];
              const holdingP = scenario.procs.find(sp => sp.holds.includes(ri));
              addLog('warning', `Thread ${p.id} requests ${resObj.id} ── BLOCKED by locked owner ${holdingP ? holdingP.id : 'unknown'}`);
            });
          });
          setStep(2);
        } else if (step === 2) {
          // Transition: Deadlock detected
          setCurrentProcs(prev => prev.map(p => ({ ...p, status: 'deadlocked' })));
          setIsDeadlocked(true);
          setIsPlaying(false);
          addLog('error', '⚠ CRITICAL ALBERT PROTOCOL: Circular Wait condition confirmed. Sectors fully locked!');
          setStep(3);
        }
      }, waitTime);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, isDeadlocked, step, speed, scenarioIdx, successCelebration]);

  // Interactive OS Deadlock Recovery Handlers

  // Recovery Option A: Process Termination
  const handleTerminateProcess = (pid: string) => {
    setIsRecovering(true);
    setRecoveryLog(`Purging process ${pid} and reclaiming all held resource allocations...`);
    addLog('info', `[RECOVERY DIRECTIVE] Seizing control registry: Sending SIGKILL signal to process ${pid}...`);
    
    // Mark P1 as aborted and clear its holds
    const updatedProcs = currentProcs.map(p => {
      if (p.id === pid) {
        return { ...p, status: 'aborted' as const, holds: [], wants: [] };
      }
      return p;
    });

    // Mark resources held by this PID as free
    const updatedRes = currentRes.map(r => {
      if (r.heldBy === pid) {
        return { ...r, heldBy: null };
      }
      return r;
    });

    addLog('success', `[RECOVERY DIRECTIVE] Purged task ${pid} successfully. Reclaimed holdings.`);
    
    setCurrentProcs(updatedProcs);
    setCurrentRes(updatedRes);
    setIsDeadlocked(false);
    
    const sessionId = recoverySessionRef.current;
    
    // Trigger the dynamic waterfall execution check on remaining processes after a short decorative delay to let user see termination!
    setTimeout(() => {
      if (sessionId !== recoverySessionRef.current) return;
      triggerRecoveryCascade(updatedProcs, updatedRes, sessionId);
    }, 1200);
  };

  // Recovery Option B: Resource Preemption
  const handlePreemptResource = (rId: string, ownerPid: string, waitingPid: string) => {
    setIsRecovering(true);
    setActivePreemption({ rId, ownerPid, beneficiaryPid: waitingPid });
    setRecoveryLog(`Revoking ownership of ${rId} from process ${ownerPid}. Allocating to beneficiary ${waitingPid}...`);
    addLog('info', `[RECOVERY DIRECTIVE] Initiating precision preemption vector on RAG.`);
    addLog('info', `[RECOVERY DIRECTIVE] Revoking hold of ${rId} from owner ${ownerPid} ── Forcibly allocating to ${waitingPid}.`);
    
    // Find resource index in scenario arrays
    const rIdx = scenario.res.findIndex(r => r.id === rId);

    // Update processes
    const updatedProcs = currentProcs.map(p => {
      if (p.id === ownerPid) {
        // Owner thread is robbed and needs the resource back
        return {
          ...p,
          status: 'waiting' as const,
          holds: p.holds.filter(ri => ri !== rIdx),
          wants: [...p.wants, rIdx]
        };
      }
      if (p.id === waitingPid) {
        // Waiting thread is immediate beneficiary, it acquires the hold and drops wait
        return {
          ...p,
          status: 'running' as const,
          holds: [...p.holds, rIdx],
          wants: p.wants.filter(ri => ri !== rIdx)
        };
      }
      return p;
    });

    // Update resources
    const updatedRes = currentRes.map(r => {
      if (r.id === rId) {
        return { ...r, heldBy: waitingPid };
      }
      return r;
    });

    addLog('success', `[RECOVERY DIRECTIVE] Preemption completed. Resource ${rId} is now locked by beneficial thread ${waitingPid}.`);
    
    setCurrentProcs(updatedProcs);
    setCurrentRes(updatedRes);
    setIsDeadlocked(false);

    const sessionId = recoverySessionRef.current;

    // Trigger complete runner for beneficial task after temporary hold
    setTimeout(() => {
      if (sessionId !== recoverySessionRef.current) return;
      setActivePreemption(null);
      
      const completedProcs = updatedProcs.map(pr => pr.id === waitingPid ? { ...pr, status: 'completed' as const, holds: [] } : pr);
      const releasedRes = updatedRes.map(rs => rs.heldBy === waitingPid ? { ...rs, heldBy: null } : rs);
      
      addLog('success', `[RECOVERY] Beneficial thread ${waitingPid} compiled processes and completed. Releasing all lock tokens.`);
      setRecoveryLog(`Beneficial thread ${waitingPid} completed. Entering waterfalled cascading scheduler...`);
      
      setCurrentProcs(completedProcs);
      setCurrentRes(releasedRes);

      // Continue waterfall to see if the robbed process or others can proceed after a short pause
      setTimeout(() => {
        if (sessionId !== recoverySessionRef.current) return;
        triggerRecoveryCascade(completedProcs, releasedRes, sessionId);
      }, 1000);
    }, 1800);
  };

  // General Waterfall Cascade Solver
  const triggerRecoveryCascade = (procs: ActiveProcess[], res: ActiveResource[], sessionId: number) => {
    let canProceed = false;
    let nextProcs = [...procs];
    let nextRes = [...res];

    // Find first waiting system that has all its requests satisfied in the current registry
    for (let i = 0; i < nextProcs.length; i++) {
      const p = nextProcs[i];
      if (p.status === 'waiting' || p.status === 'deadlocked') {
        const wantsIndices = p.wants;
        // Check if all needed resource indexes in scenario are now unheld
        const allWantsFree = wantsIndices.every(ri => {
          const resObj = scenario.res[ri];
          const resource = nextRes.find(r => r.id === resObj.id);
          return resource && resource.heldBy === null;
        });

        // If P possesses all requirements, we run it!
        if (wantsIndices.length > 0 && allWantsFree) {
          canProceed = true;
          
          // Transition P to running index
          nextProcs[i] = {
            ...p,
            status: 'running',
            holds: [...p.holds, ...p.wants],
            wants: []
          };
          
          // Set resource owners
          wantsIndices.forEach(ri => {
            const resObj = scenario.res[ri];
            nextRes = nextRes.map(r => r.id === resObj.id ? { ...r, heldBy: p.id } : r);
          });

          addLog('info', `[WATERFALL] Satisfied requests for ${p.id} (${p.name}). State: RUNNING.`);
          setRecoveryLog(`Waterfall Schedule: Running thread ${p.id} (${p.name}) with secured locks...`);
          
          setCurrentProcs(nextProcs);
          setCurrentRes(nextRes);

          // After execution slice, complete process and release holds
          setTimeout(() => {
            if (sessionId !== recoverySessionRef.current) return;
            
            const completedProcs = nextProcs.map(pr => pr.id === p.id ? { ...pr, status: 'completed' as const, holds: [] } : pr);
            const releasedRes = nextRes.map(rs => rs.heldBy === p.id ? { ...rs, heldBy: null } : rs);
            
            addLog('success', `[WATERFALL] Thread ${p.id} (${p.name}) processed data slice successfully and exited. Freed held resources.`);
            setRecoveryLog(`Completing thread ${p.id}. Releasing resource locks...`);
            
            setCurrentProcs(completedProcs);
            setCurrentRes(releasedRes);

            // Re-evaluate the cascade waterfall recursion
            setTimeout(() => {
              if (sessionId !== recoverySessionRef.current) return;
              triggerRecoveryCascade(completedProcs, releasedRes, sessionId);
            }, 1000);
          }, 1800);

          break; // Cascade one thread at a time for clean step-by-step visuals!
        }
      }
    }

    // Check if recovery is fully finished
    if (!canProceed) {
      const activePendingDeads = nextProcs.filter(p => p.status === 'waiting' || p.status === 'deadlocked');
      if (activePendingDeads.length === 0) {
        setIsRecovering(false);
        setSuccessCelebration(true);
        addLog('success', '✨ PROTOCOL COHERENCE SECURIED: Urban micro-kernel restored with NO deadlocked nodes left.');
      }
    }
  };

  // Canvas visual rendering routine
  useEffect(() => {
    let animationId: number;

    const render = () => {
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
      
      // Grid Overlay Background Design
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const numP = currentProcs.length;
      const numR = currentRes.length;
      if (numP === 0 || numR === 0) return;

      // Node Positions Maps
      const pPositions = currentProcs.map((p, i) => ({
        id: p.id,
        x: W * (i + 1) / (numP + 1),
        y: 110
      }));

      const rPositions = currentRes.map((r, i) => ({
        id: r.id,
        x: W * (i + 1) / (numR + 1),
        y: 280
      }));

      // Local edge routing drawer function
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

      // Draw non-overlapping parallel edges
      currentProcs.forEach((p, pIdx) => {
        const pPos = pPositions[pIdx];
        
        // 1. Draw hold edges (Process -> Resource) - offset to the LEFT (-12px)
        p.holds.forEach(ri => {
          const resObj = scenario.res[ri];
          if (!resObj) return;
          const rPosIdx = currentRes.findIndex(cr => cr.id === resObj.id);
          if (rPosIdx === -1) return;
          const rPos = rPositions[rPosIdx];

          let edgeColor = '#34c759'; // Apple Green holds
          if (isDeadlocked) edgeColor = '#ff3b30'; // Apple Red deadlocked
          else if (p.status === 'running') edgeColor = '#34c759';
          else if (p.status === 'completed') edgeColor = 'rgba(52, 199, 89, 0.15)';

          // Offset positions slightly left on process circle edge & resource diamond edge
          drawArrow(pPos.x - 12, pPos.y + 32, rPos.x - 12, rPos.y - 30, edgeColor, false);
        });

        // 2. Draw request/want edges (Resource -> Process) - offset to the RIGHT (+12px)
        p.wants.forEach(ri => {
          const resObj = scenario.res[ri];
          if (!resObj) return;
          const rPosIdx = currentRes.findIndex(cr => cr.id === resObj.id);
          if (rPosIdx === -1) return;
          const rPos = rPositions[rPosIdx];

          let edgeColor = '#ff9500'; // Apple Orange requests
          if (isDeadlocked) edgeColor = '#ff3b30'; // Apple Red requests
          else if (p.status === 'running') edgeColor = '#34c759';

          // Offset positions slightly right on diamond bottom & process bottom
          drawArrow(rPos.x + 12, rPos.y - 30, pPos.x + 12, pPos.y + 32, edgeColor, true);
        });
      });

      // Draw Process Circle Nodes
      currentProcs.forEach((p, idx) => {
        const pos = pPositions[idx];
        const isDead = p.status === 'deadlocked';
        const isAbort = p.status === 'aborted';
        const isRun = p.status === 'running';
        const isComplete = p.status === 'completed';

        ctx.save();
        
        // Glow filters
        ctx.shadowBlur = isDead ? 12 : (isRun ? 16 : 8);
        ctx.shadowColor = isAbort ? 'rgba(0,0,0,0.02)' : (isDead ? 'rgba(255, 59, 48, 0.3)' : (isRun ? 'rgba(52, 199, 89, 0.3)' : 'rgba(0,113,227,0.15)'));

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 35, 0, Math.PI * 2);
        ctx.fillStyle = isAbort ? '#e5e5e7' : '#ffffff';
        ctx.fill();

        let strokeColor = '#0071e3'; // Default Apple blue process circle border
        if (isDead) strokeColor = '#ff3b30';
        else if (isAbort) strokeColor = '#d2d2d7';
        else if (isRun) strokeColor = '#34c759';
        else if (isComplete) strokeColor = '#34c759';

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = (isRun || isDead) ? 3 : 2;
        ctx.stroke();
        ctx.restore();

        // Inside Text Labels with state-based contrast colors
        ctx.fillStyle = isAbort ? '#86868b' : (isDead ? '#ff3b30' : (isRun ? '#34c759' : (isComplete ? '#34c759' : '#1d1d1f')));
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(p.id, pos.x, pos.y - 5);

        ctx.fillStyle = isAbort ? '#86868b' : '#515154';
        ctx.font = '9px Inter';
        ctx.fillText(isAbort ? 'SIGKILL ABORT' : (isComplete ? 'COMPLETED ✓' : p.name), pos.x, pos.y + 10);
      });

      // Draw Resource Diamond Nodes
      currentRes.forEach((r, idx) => {
        const pos = rPositions[idx];
        const size = 30;
        const isHeld = r.heldBy !== null;
        const hostProc = isHeld ? currentProcs.find(p => p.id === r.heldBy) : null;

        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = (isDeadlocked && isHeld) ? 'rgba(255, 59, 48, 0.2)' : 'rgba(88, 86, 214, 0.2)';

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - size);
        ctx.lineTo(pos.x + size, pos.y);
        ctx.lineTo(pos.x, pos.y + size);
        ctx.lineTo(pos.x - size, pos.y);
        ctx.closePath();
        
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        let strokeColor = '#5856d6'; // Default Apple indigo resource border
        if (isDeadlocked && isHeld) strokeColor = '#ff3b30';
        else if (hostProc?.status === 'running') strokeColor = '#34c759';
        else if (hostProc?.status === 'completed') strokeColor = 'rgba(88, 86, 214, 0.3)';

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = strokeColor;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(r.id, pos.x, pos.y - 4);
        
        ctx.fillStyle = '#515154';
        ctx.font = '8px Inter';
        ctx.fillText(r.name, pos.x, pos.y + 45);
      });

      // Draw Resource Preemption visual highlighters
      if (activePreemption) {
        const { rId, ownerPid, beneficiaryPid } = activePreemption;
        const resPos = rPositions.find(pos => pos.id === rId);
        const benPos = pPositions.find(pos => pos.id === beneficiaryPid);
        const ownPos = pPositions.find(pos => pos.id === ownerPid);

        ctx.save();

        // A. Glow Beam to new beneficiary owner
        if (resPos && benPos) {
          ctx.strokeStyle = 'rgba(124, 111, 247, 0.15)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.moveTo(resPos.x, resPos.y);
          ctx.lineTo(benPos.x, benPos.y);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(124, 111, 247, 0.4)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(resPos.x, resPos.y);
          ctx.lineTo(benPos.x, benPos.y);
          ctx.stroke();

          ctx.strokeStyle = '#7c6ff7';
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 5]);
          const timeOffset = (Date.now() / 25) % 15;
          ctx.lineDashOffset = -timeOffset;
          ctx.beginPath();
          ctx.moveTo(resPos.x, resPos.y);
          ctx.lineTo(benPos.x, benPos.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Glowing pulse halo around new owner node
          ctx.beginPath();
          const pulseRadius = 35 + 8 * Math.sin(Date.now() / 150);
          ctx.arc(benPos.x, benPos.y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = '#7c6ff7';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#7c6ff7';
          ctx.stroke();

          // Label above new owner node
          ctx.fillStyle = '#7c6ff7';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('⚡ NEW OWNER (SECURED)', benPos.x, benPos.y - 45);
        }

        // B. Broken revoked path to original owner
        if (resPos && ownPos) {
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(ownPos.x, ownPos.y);
          ctx.lineTo(resPos.x, resPos.y);
          ctx.stroke();

          const midX = (ownPos.x + resPos.x) / 2;
          const midY = (ownPos.y + resPos.y) / 2;
          ctx.beginPath();
          ctx.fillStyle = '#ff3b3b';
          ctx.arc(midX, midY, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(midX - 5, midY - 5);
          ctx.lineTo(midX + 5, midY + 5);
          ctx.moveTo(midX + 5, midY - 5);
          ctx.lineTo(midX - 5, midY + 5);
          ctx.stroke();

          // Label above revoked node
          ctx.fillStyle = '#ff3b3b';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('⚡ OWNERSHIP REVOKED', ownPos.x, ownPos.y - 45);
        }

        // C. Preempted Resource glowing pulse diamond
        if (resPos) {
          ctx.beginPath();
          const resPulse = 30 + 6 * Math.sin(Date.now() / 120);
          ctx.moveTo(resPos.x, resPos.y - resPulse);
          ctx.lineTo(resPos.x + resPulse, resPos.y);
          ctx.lineTo(resPos.x, resPos.y + resPulse);
          ctx.lineTo(resPos.x - resPulse, resPos.y);
          ctx.closePath();
          ctx.strokeStyle = '#7c6ff7';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#7c6ff7';
          ctx.stroke();

          ctx.fillStyle = '#7c6ff7';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('⚡ PREEMPTING...', resPos.x, resPos.y + 45 + 15);
        }

        ctx.restore();

        // Request animation frame for smooth pulsing/movement visuals
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [currentProcs, currentRes, isDeadlocked, step, resizeToggle, activePreemption]);

  // Derive all possible resource preemption opportunities dynamically
  const preemptionCandidates = React.useMemo(() => {
    const candidates: { rId: string; rName: string; ownerPid: string; ownerName: string; beneficiaryPid: string; beneficiaryName: string }[] = [];
    currentRes.forEach(r => {
      if (r.heldBy) {
        // Find if any other process currently is waiting for this resource index
        const rIndex = scenario.res.findIndex(sr => sr.id === r.id);
        currentProcs.forEach(p => {
          if (p.id !== r.heldBy && p.wants.includes(rIndex)) {
            const ownerObj = currentProcs.find(cp => cp.id === r.heldBy);
            candidates.push({
              rId: r.id,
              rName: r.name,
              ownerPid: r.heldBy,
              ownerName: ownerObj ? ownerObj.name : 'Unknown',
              beneficiaryPid: p.id,
              beneficiaryName: p.name
            });
          }
        });
      }
    });
    return candidates;
  }, [currentProcs, currentRes, scenarioIdx]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Simulation Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-1 relative overflow-hidden">
              <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
                <Activity className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6a8099]">City Resource Map</span>
              </div>
              
              <div className="absolute top-4 right-6 flex items-center gap-2 z-10">
                <span className={`w-2 h-2 rounded-full ${isDeadlocked ? 'bg-secondary animate-ping' : successCelebration ? 'bg-success animate-pulse' : 'bg-primary'}`} />
                <span className={`text-[10px] uppercase font-bold tracking-widest ${isDeadlocked ? 'text-secondary font-black' : successCelebration ? 'text-success font-black' : 'text-primary'}`}>
                  {isDeadlocked ? 'DEADLOCK ACTIVE' : successCelebration ? 'NOMINAL RESTORED' : 'MONITORING ACTIVE'}
                </span>
              </div>

              <canvas 
                ref={canvasRef}
                className="w-full bg-white block"
                style={{ height: '390px' }}
              />
            </div>

            {/* Emergency & Recovery Console Panel (Under Canvas) */}
            <AnimatePresence mode="wait">
              {(isDeadlocked || isRecovering) && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass-panel p-8 border-secondary/30 bg-white space-y-6 relative overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5"><ZapOff className="w-32 h-32 text-secondary" /></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-dim/20 pb-4 gap-4">
                    <div>
                      <div className="text-secondary font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 animate-pulse" /> EMERGENCY SYSTEM RESOLVER PROTOCOL
                      </div>
                      <p className="text-[#515154] text-[11px] mt-1">
                        {isRecovering ? 'Actively restructuring resource registry...' : 'The smart city grid has entered a circular wait loop. Select a recovery strategy below to break the cycle.'}
                      </p>
                    </div>
                    
                    {/* Recovery Action Toggle Tabs */}
                    {!isRecovering && (
                      <div className="flex bg-neutral-100/90 border border-neutral-200/60 rounded-xl p-1 shrink-0">
                        <button 
                          onClick={() => setRecoveryMode('terminate')}
                          className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${recoveryMode === 'terminate' ? 'bg-secondary text-white shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
                        >
                          Termination
                        </button>
                        <button 
                          onClick={() => setRecoveryMode('preempt')}
                          className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${recoveryMode === 'preempt' ? 'bg-accent/85 text-white shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
                        >
                          Preemption
                        </button>
                      </div>
                    )}
                  </div>

                  {isRecovering ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                      {/* Pulsing visual spinner / status circle */}
                      <div className="relative flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-4 border-accent/15 border-t-accent animate-spin" />
                        <Zap className="w-6 h-6 text-accent absolute animate-pulse text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[#1d1d1f] font-bold text-sm tracking-wide uppercase">// Executing Recovery Routine</h4>
                        <p className="text-[#515154] font-mono text-xs max-w-lg mt-1 animate-pulse">{recoveryLog || 'Running dispatcher cascade...'}</p>
                      </div>
                    </div>
                  ) : recoveryMode === 'terminate' ? (
                    <div className="space-y-4">
                      <div className="text-[#1d1d1f] font-bold text-xs uppercase tracking-wider">// Terminate System Thread</div>
                      <p className="text-[#515154] text-xs">Aborting a thread completely frees up the resource keys it currently locks. Choose a target component registry to terminate:</p>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {currentProcs.filter(p => p.status !== 'aborted' && p.status !== 'completed').map((p) => (
                          <button 
                            key={p.id}
                            onClick={() => handleTerminateProcess(p.id)}
                            className="p-4 rounded-xl border border-secondary/20 bg-secondary/[0.03] text-left transition-all hover:bg-secondary/[0.08] hover:border-secondary group relative animate-pulse"
                          >
                            <span className="absolute top-2 right-2 text-[9px] font-mono text-secondary px-2 py-0.5 rounded bg-secondary/10 uppercase font-black">LOCKS: {p.holds.length}</span>
                            <div className="flex items-center gap-3">
                              <Trash2 className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                              <div>
                                <h4 className="text-[#1d1d1f] font-bold text-xs">{p.id} - {p.name}</h4>
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5 font-sans">Purge Core</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-[#1d1d1f] font-bold text-xs uppercase tracking-wider">// Forcibly Preempt Resource Access</div>
                      <p className="text-[#515154] text-xs">Forcibly strip ownership of a resource from its currently locked owner and reallocate it directly to its waiting requester:</p>
                      
                      {preemptionCandidates.length === 0 ? (
                        <div className="text-slate-500 font-mono text-xs italic py-4">No active preemption vectors candidate found on the current graph topology.</div>
                      ) : (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {preemptionCandidates.map((cand, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePreemptResource(cand.rId, cand.ownerPid, cand.beneficiaryPid)}
                              className="p-4 rounded-xl border border-accent/20 bg-accent/[0.03] text-left transition-all hover:bg-accent/[0.08] hover:border-accent group relative text-xs"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-accent uppercase tracking-wider leading-none">VEHICLE STRIP: {cand.rId}</span>
                                <Zap className="w-3.5 h-3.5 text-accent group-hover:animate-bounce" />
                              </div>
                              <p className="text-[#515154] font-mono text-[10.5px]">
                                Reclaim <span className="text-[#1d1d1f] font-semibold">{cand.rName}</span> from <span className="text-secondary font-bold">{cand.ownerPid}</span> and allocate immediately to <span className="text-primary font-bold">{cand.beneficiaryPid}</span>
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {successCelebration && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-8 border-success/30 bg-success/[0.03] space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 text-success font-black text-sm uppercase tracking-[0.2rem]">
                    <CheckCircle2 className="w-5 h-5 text-success animate-bounce" /> CORE RECOVERY COMPLETED // GRID HEALTHY
                  </div>
                  <h3 className="text-[#1d1d1f] text-3xl font-bold uppercase tracking-wider leading-none">GRID NOMINAL SECURED</h3>
                  <p className="text-[#515154] text-xs leading-relaxed max-w-3xl">
                    Cascaded scheduler executed successfully. Remaining process threads finished calculations and freed all locked resource allocations. Grid lock is solved cleanly with zero active bottlenecks!
                  </p>
                  <div className="pt-2">
                    <button onClick={() => reset(scenarioIdx)} className="px-6 py-2.5 rounded-lg bg-success text-bg-base font-bold text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                      Reset Diagnostic Loop
                    </button>
                  </div>
                </motion.div>
              )}

              {!isDeadlocked && !isRecovering && !successCelebration && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  className="glass-panel p-6 border-border-dim/20 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3 text-[#515154] text-[10px] uppercase font-bold tracking-widest leading-none mb-3">
                    <HelpCircle className="w-4 h-4 text-primary" /> OS GRID DIAGNOSTIC MONITOR
                  </div>
                  <p className="text-[#515154] text-xs leading-relaxed">
                    Select a localized grid failure sector from the selector panel on the right. Tap <strong className="text-primary hover:underline">"Run"</strong> to inject threads and active allocations. Watch the sub-cycle dependency resolve or enter a permanent circular wait lock, then utilize kernel protocol interventions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 space-y-8 bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"><Settings2 className="w-5 h-5 text-primary" /></div>
                <div>
                  <h2 className="text-[#1d1d1f] font-bold text-sm tracking-tight">Dispatcher Terminal</h2>
                  <p className="text-[#86868b] text-[10px] font-bold uppercase tracking-widest">Unit 04 • Smart City Monitor</p>
                </div>
              </div>

              <div className="space-y-6 border-t border-border-dim/20 pt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest ml-1">Grid Scenario</label>
                  <div className="relative group">
                    <select 
                      className="w-full bg-neutral-100 border border-border-dim/50 rounded-xl py-3 px-4 text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer hover:bg-neutral-200/80 transition-all appearance-none"
                      value={scenarioIdx}
                      onChange={(e) => { const val = parseInt(e.target.value); setScenarioIdx(val); reset(val); }}
                      disabled={isPlaying}
                    >
                      {SCENARIOS.map((s, i) => (
                        <option key={i} value={i} className="bg-white text-[#1d1d1f]">
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
                  </div>
                  <div className="p-4 bg-primary/[0.03] border border-border-dim/25 rounded-xl">
                    <div className="text-primary text-[10px] font-black uppercase mb-1">{scenario.subtitle}</div>
                    <p className="text-[#515154] text-[11px] leading-normal">{scenario.desc}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">Diagnostic Speed</label>
                    <span className="text-[#1d1d1f] font-mono text-xs">{speed}/3</span>
                  </div>
                  <input 
                    type="range" min="1" max="3" step="1" 
                    value={speed} 
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={start}
                    disabled={isPlaying || isDeadlocked || successCelebration}
                    className="btn-primary flex items-center justify-center gap-2 h-14 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Play className="w-4 h-4" /> Run
                  </button>
                  <button 
                    onClick={() => reset(scenarioIdx)}
                    className="btn-ghost flex items-center justify-center gap-2 h-14"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* System Log */}
            <div className="glass-panel p-6 bg-white border border-border-dim/40 h-[300px] flex flex-col shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#515154]">Kernel Diagnostics</span>
              </div>
              <div className="flex-1 font-mono text-[11px] space-y-2 overflow-y-auto custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-neutral-400 font-medium">[{log.time}]</span>
                    <span className={
                      log.type === 'error' 
                        ? 'text-secondary font-semibold' 
                        : log.type === 'warning' 
                        ? 'text-amber-600 font-semibold' 
                        : log.type === 'info'
                        ? 'text-blue-600 font-medium'
                        : 'text-emerald-600 font-semibold'
                    }>
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Overlay Deadlock Resolve Protocol Popups */}
      <DeadlockAlert 
        isVisible={isDeadlocked}
        onTerminate={() => {
          const deadlockedP = currentProcs.find(p => p.status === 'deadlocked');
          if (deadlockedP) {
            handleTerminateProcess(deadlockedP.id);
          }
        }}
        onPreempt={() => {
          if (preemptionCandidates.length > 0) {
            const cand = preemptionCandidates[0];
            handlePreemptResource(cand.rId, cand.ownerPid, cand.beneficiaryPid);
          }
        }}
        onRestart={() => reset(scenarioIdx)}
      />
    </PageWrapper>
  );
};

export default Simulator;
