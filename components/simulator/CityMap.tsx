
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridNode, GridEdge } from '../../types';
import { Activity, Zap, Wifi, Radio, Cpu, ShieldAlert } from 'lucide-react';

interface CityMapProps {
  nodes: GridNode[];
  edges: GridEdge[];
  isDeadlocked: boolean;
}

const NodeIcon = ({ id, type, className }: { id: string, type: 'process' | 'resource', className?: string }) => {
  if (type === 'resource') {
    if (id === 'R1') return <Zap className={className} />;
    if (id === 'R2') return <Wifi className={className} />;
    if (id === 'R3') return <Radio className={className} />;
    if (id === 'R4') return <Activity className={className} />;
  } else {
    if (id === 'P1') return <ShieldAlert className={className} />;
    if (id === 'P2') return <Zap className={className} />;
    if (id === 'P3') return <Cpu className={className} />;
    if (id === 'P4') return <Activity className={className} />;
  }
  return null;
};

const CityMap: React.FC<CityMapProps> = ({ nodes, edges, isDeadlocked }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 500 500" className="w-full h-full max-w-[600px] max-h-[600px] drop-shadow-2xl">
        <defs>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#00e676" />
          </marker>
          <marker
            id="arrow-waiting"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#facc15" />
          </marker>
          <marker
            id="arrow-deadlocked"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff4444" />
          </marker>
          
          <filter id="glow-running">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid background lines - subtle move */}
        <motion.g animate={{ x: [0, 5, 0], y: [0, 5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
          {[...Array(11)].map((_, i) => (
            <React.Fragment key={i}>
              <line x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="rgba(0, 245, 255, 0.05)" strokeWidth="1" />
              <line x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="rgba(0, 245, 255, 0.05)" strokeWidth="1" />
            </React.Fragment>
          ))}
        </motion.g>

        {/* Connections (Edges) */}
        <AnimatePresence>
          {edges.map((edge) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isWaiting = edge.type === 'requests';
            const isDead = edge.status === 'deadlocked';

            return (
              <motion.line
                key={edge.id}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                stroke={isDead ? '#ff4444' : isWaiting ? '#facc15' : '#00e676'}
                strokeWidth={isDead ? "3" : "2"}
                strokeDasharray={isWaiting ? "5 5" : "none"}
                markerEnd={`url(#arrow-${isDead ? 'deadlocked' : isWaiting ? 'waiting' : 'active'})`}
                className={isDead ? 'animate-pulse' : isWaiting ? 'animate-[pulse_1s_infinite]' : ''}
              />
            );
          })}
        </AnimatePresence>

        {/* Nodes */}
        {nodes.map((node) => {
          const isDead = node.status === 'deadlocked' || isDeadlocked;
          const isWaiting = node.status === 'waiting';
          const isRunning = node.status === 'running';
          const isResource = node.type === 'resource';

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="cursor-pointer"
            >
              {isResource ? (
                // Diamonds for resources
                <motion.path
                  d={`M ${node.x} ${node.y - 25} L ${node.x + 25} ${node.y} L ${node.x} ${node.y + 25} L ${node.x - 25} ${node.y} Z`}
                  className={isDead ? 'fill-danger/20 stroke-danger' : 'fill-background stroke-primary/50'}
                  strokeWidth="2"
                  animate={isDead ? { filter: 'drop-shadow(0 0 8px #ff4444)' } : {}}
                />
              ) : (
                // Circles for processes
                <motion.circle
                  cx={node.x} cy={node.y} r="25"
                  className={
                    isDead ? 'fill-danger/20 stroke-danger' : 
                    isWaiting ? 'fill-yellow-500/10 stroke-yellow-500' : 
                    isRunning ? 'fill-primary/20 stroke-primary' :
                    'fill-background stroke-primary/50'
                  }
                  strokeWidth="2"
                  animate={
                    isDead ? { filter: 'drop-shadow(0 0 12px #ff4444)' } : 
                    isWaiting ? { scale: [1, 1.05, 1] } : 
                    isRunning ? { filter: 'url(#glow-running)', scale: [1, 1.1, 1] } :
                    {}
                  }
                  transition={isWaiting || isRunning ? { duration: 1.5, repeat: Infinity } : {}}
                />
              )}

              {/* Label */}
              <text
                x={node.x} y={node.y + 50}
                textAnchor="middle"
                className={`font-mono text-[11px] font-black uppercase tracking-widest pointer-events-none ${isDead ? 'fill-danger' : isWaiting ? 'fill-yellow-500' : isRunning ? 'fill-primary' : 'fill-slate-200'}`}
              >
                {node.id}: {node.label}
              </text>

              {/* Icon Overlay */}
              <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20" className="pointer-events-none">
                <div className="w-full h-full flex items-center justify-center">
                  <NodeIcon 
                     id={node.id} 
                     type={node.type} 
                     className={isDead ? 'text-danger' : isWaiting ? 'text-yellow-500' : isRunning ? 'text-white' : 'text-primary'} 
                  />
                </div>
              </foreignObject>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default CityMap;
