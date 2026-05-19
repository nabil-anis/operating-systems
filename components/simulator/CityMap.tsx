
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridNode, GridEdge } from '../../types';
import { 
  Activity, 
  Zap, 
  Wifi, 
  Radio, 
  Cpu, 
  ShieldAlert, 
  Cross, 
  Droplets, 
  TrainFront, 
  Siren,
  Cloud,
  Mic2,
  Database
} from 'lucide-react';

interface CityMapProps {
  nodes: GridNode[];
  edges: GridEdge[];
  isDeadlocked: boolean;
}

const NodeIcon = ({ id, type, className }: { id: string, type: 'process' | 'resource', className?: string }) => {
  if (type === 'resource') {
    if (id === 'R1') return <Zap className={className} />;
    if (id === 'R2') return <Cloud className={className} />;
    if (id === 'R3') return <Radio className={className} />;
    if (id === 'R4') return <Database className={className} />;
  } else {
    if (id === 'P1') return <Cross className={className} />;
    if (id === 'P2') return <Droplets className={className} />;
    if (id === 'P3') return <TrainFront className={className} />;
    if (id === 'P4') return <Siren className={className} />;
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
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#007AFF" />
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
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF9500" />
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
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF3B30" />
          </marker>
        </defs>

        {/* City Landscape Background */}
        <g className="opacity-[0.05]">
          {/* Main Boulevards */}
          <path d="M 0 250 L 500 250" stroke="white" strokeWidth="40" fill="none" />
          <path d="M 250 0 L 250 500" stroke="white" strokeWidth="40" fill="none" />
          {/* Ring Road */}
          <circle cx="250" cy="250" r="180" stroke="white" strokeWidth="30" fill="none" />
          {/* Blocks */}
          <rect x="50" y="50" width="100" height="100" fill="white" />
          <rect x="350" y="50" width="100" height="100" fill="white" />
          <rect x="50" y="350" width="100" height="100" fill="white" />
          <rect x="350" y="350" width="100" height="100" fill="white" />
        </g>

        {/* Subtle grid background */}
        <g className="opacity-[0.03]">
          {[...Array(11)].map((_, i) => (
            <React.Fragment key={i}>
              <line x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="white" strokeWidth="1" />
              <line x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="white" strokeWidth="1" />
            </React.Fragment>
          ))}
        </g>

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
                animate={{ pathLength: 1, opacity: 0.6 }}
                exit={{ opacity: 0 }}
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                stroke={isDead ? '#FF3B30' : isWaiting ? '#FF9500' : '#007AFF'}
                strokeWidth={isDead ? "3" : "2"}
                strokeDasharray={isWaiting ? "6 4" : "none"}
                markerEnd={`url(#arrow-${isDead ? 'deadlocked' : isWaiting ? 'waiting' : 'active'})`}
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
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="group cursor-pointer"
            >
              {isResource ? (
                <rect
                  x={node.x - 22} y={node.y - 22} width="44" height="44" rx="10"
                  className={isDead ? 'fill-secondary/20 stroke-secondary' : 'fill-white/5 stroke-white/20'}
                  strokeWidth="2"
                />
              ) : (
                <circle
                  cx={node.x} cy={node.y} r="25"
                  className={
                    isDead ? 'fill-secondary/20 stroke-secondary' : 
                    isWaiting ? 'fill-amber-500/10 stroke-amber-500/40' : 
                    isRunning ? 'fill-primary/20 stroke-primary' :
                    'fill-white/5 stroke-white/20'
                  }
                  strokeWidth="2"
                />
              )}

              {/* Status Glow for running nodes */}
              {isRunning && !isDead && (
                <motion.circle
                  cx={node.x} cy={node.y} r="30"
                  fill="none"
                  stroke="#007AFF"
                  strokeWidth="1"
                  className="opacity-40"
                  animate={{ scale: [1, 1.2], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <text
                x={node.x} y={node.y + 45}
                textAnchor="middle"
                className={`font-sans text-[10px] font-bold tracking-tight pointer-events-none ${isDead ? 'fill-secondary' : isWaiting ? 'fill-amber-500' : isRunning ? 'fill-primary' : 'fill-white/40'}`}
              >
                {node.id}
              </text>

              <foreignObject x={node.x - 8} y={node.y - 8} width="16" height="16" className="pointer-events-none">
                <div className="w-full h-full flex items-center justify-center">
                  <NodeIcon 
                     id={node.id} 
                     type={node.type} 
                     className={isDead ? 'text-secondary' : isWaiting ? 'text-amber-500' : isRunning ? 'text-white' : 'text-white/20'} 
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
