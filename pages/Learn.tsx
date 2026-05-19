import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { 
  BookOpen, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Zap,
  Lock,
  Hand,
  ShieldAlert,
  RefreshCw,
  HelpCircle,
  Trophy
} from 'lucide-react';

const QUIZ = [
  {
    q: 'Which Coffman Condition is violated when the OS forcibly takes a resource from a process?',
    opts: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait'],
    ans: 2,
    explain: 'No Preemption means resources cannot be taken away. When the OS forcibly reclaims a resource, it breaks this condition — which is exactly how preemption-based recovery works.'
  },
  {
    q: 'In a Resource Allocation Graph, a cycle means deadlock is:',
    opts: ['Impossible', 'Guaranteed if every resource has one instance', 'Guaranteed only with 4+ processes', 'Undetectable without Banker\'s Algorithm'],
    ans: 1,
    explain: 'A cycle in a RAG guarantees deadlock only when every resource type has exactly one instance. With multiple instances, a cycle is necessary but not sufficient.'
  },
  {
    q: 'The Banker\'s Algorithm is a strategy for deadlock:',
    opts: ['Detection', 'Prevention', 'Avoidance', 'Recovery'],
    ans: 2,
    explain: 'The Banker\'s Algorithm is a deadlock avoidance strategy. It checks whether granting a request keeps the system in a safe state, avoiding deadlock proactively.'
  },
  {
    q: 'Hospital AI holds Power and waits for Bandwidth. Power Grid holds Bandwidth and waits for Power. Which condition is this?',
    opts: ['Hold and Wait only', 'Circular Wait only', 'Both Hold and Wait AND Circular Wait', 'Mutual Exclusion'],
    ans: 2,
    explain: 'This scenario satisfies both Hold and Wait (each holds one resource while waiting) AND Circular Wait (P1 waits for P2\'s resource, P2 waits for P1\'s). Both are present simultaneously.'
  },
  {
    q: 'Which recovery strategy causes a process to lose all its progress and start over?',
    opts: ['Resource Preemption', 'Process Termination', 'Safe Sequence Reorder', 'Rollback to checkpoint'],
    ans: 1,
    explain: 'Process Termination aborts the process entirely, freeing all its resources. The process must restart from scratch — this is more costly than preemption but simpler to implement.'
  }
];

const Learn: React.FC = () => {
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState<number[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const handleAnswer = (optIdx: number) => {
    if (answered.includes(quizIdx)) return;
    
    setAnswered(prev => [...prev, quizIdx]);
    setQuestionsAnswered(prev => prev + 1);
    
    if (optIdx === QUIZ[quizIdx].ans) {
      setCurrentScore(prev => prev + 1);
    }
    setSelectedOpt(optIdx);

    if (questionsAnswered + 1 === QUIZ.length) {
      setTimeout(() => setScore(currentScore + (optIdx === QUIZ[quizIdx].ans ? 1 : 0)), 1500);
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setScore(null);
    setSelectedOpt(null);
    setAnswered([]);
    setQuestionsAnswered(0);
    setCurrentScore(0);
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        {/* Definition */}
        <section className="mb-24">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-primary mb-4 block">// 01 — Definition</span>
          <h2 className="text-3xl font-bold text-white mb-6">What is a Deadlock?</h2>
          <div className="space-y-6 text-[#6a8099] leading-relaxed text-base md:text-lg font-light">
            <p>A deadlock is a state in an OS where two or more processes are permanently blocked, each waiting for a resource held by another in the set. No process can proceed, no resource is released, and the system halts indefinitely.</p>
            <p className="p-6 bg-primary/5 border border-primary/10 rounded-2xl italic">"In our Smart City: if Hospital AI holds Power and waits for Bandwidth, while Power Grid holds Bandwidth and waits for Power — neither can proceed. The entire city grid freezes."</p>
          </div>
        </section>

        {/* Coffman Conditions */}
        <section className="mb-24">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-primary mb-4 block">// 02 — Coffman Conditions</span>
          <h2 className="text-3xl font-bold text-white mb-8">Four Necessary Conditions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Lock, title: '1. Mutual Exclusion', desc: 'At least one resource is non-sharable — only one process can use it at a time. Others must wait.' },
              { icon: Hand, title: '2. Hold and Wait', desc: 'A process holds at least one resource while waiting to acquire more resources held by others.' },
              { icon: ShieldAlert, title: '3. No Preemption', desc: 'Resources cannot be forcibly taken. A process only releases resources voluntarily.' },
              { icon: RefreshCw, title: '4. Circular Wait', desc: 'A chain: P1 waits for P2, P2 for P3, ..., Pn waits for P1. A closed loop with no exit.' },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 border-border-dim bg-primary/[0.02]">
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{item.title}</h4>
                </div>
                <p className="text-xs text-[#6a8099] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-24">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-primary mb-4 block">// 03 — Comparison</span>
          <h2 className="text-3xl font-bold text-white mb-8">Deadlock vs Starvation</h2>
          <div className="glass-panel overflow-hidden border-border-dim">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-primary/5 text-primary uppercase text-[10px] font-bold tracking-widest border-b border-border-dim">
                  <th className="p-4">Concept</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Fix</th>
                </tr>
              </thead>
              <tbody className="text-[#6a8099]">
                {[
                  { name: 'Deadlock', state: 'Blocked', progress: 'None', fix: 'Reset', color: 'text-secondary' },
                  { name: 'Livelock', state: 'Active', progress: 'None', fix: 'Random Retry', color: 'text-secondary/70' },
                  { name: 'Starvation', state: 'Waiting', progress: 'Delayed', fix: 'Priority Aging', color: 'text-primary' },
                  { name: 'Safe State', state: 'Running', progress: 'Safe', fix: 'Banker Check', color: 'text-success' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border-dim/5">
                    <td className="p-4 font-bold text-white">{row.name}</td>
                    <td className={`p-4 font-bold ${row.color}`}>{row.state}</td>
                    <td className="p-4">{row.progress}</td>
                    <td className="p-4">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* History */}
        <section className="mb-24">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-primary mb-4 block">// 04 — Real World</span>
          <h2 className="text-3xl font-bold text-white mb-8">Famous Deadlocks in History</h2>
          <div className="space-y-4">
            {[
              { title: 'Therac-25 (1985–87)', desc: 'A race condition in the radiation therapy machine caused it to deliver lethal doses. Poor synchronisation across two tasks.' },
              { title: 'MySQL InnoDB Deadlocks', desc: 'High-traffic databases regularly deadlock when transactions lock rows in different orders. Detects cycles and rolls back.' },
              { title: 'Java Thread Deadlocks', desc: 'Multithreaded Java apps deadlock when two threads call synchronised methods on each other\'s objects in opposite orders.' }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 border-l-4 border-l-primary bg-primary/[0.02]">
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-xs text-[#6a8099] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quiz */}
        <section className="mt-32">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-primary mb-4 block">// 05 — Assessment</span>
          <h2 className="text-3xl font-bold text-white mb-8">Quick Quiz</h2>
          
          {score !== null ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-12 text-center space-y-6 bg-primary/[0.03] border-primary/20"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <div>
                <div className="text-5xl font-black text-white">{score}/5</div>
                <p className="text-[#6a8099] mt-2 font-bold uppercase tracking-widest text-[10px]">Your Final Score</p>
              </div>
              <p className="text-[#6a8099] max-w-sm mx-auto">
                {score === 5 ? 'Perfect architecture! You clearly understand deadlock theory.' : 'Solid effort. Review the forensic data above and try again.'}
              </p>
              <button 
                onClick={resetQuiz}
                className="btn-primary"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="glass-panel p-8 bg-primary/[0.02]">
                <div className="text-[10px] font-mono text-[#6a8099] mb-4 uppercase tracking-[0.15em]">Question {quizIdx + 1} / {QUIZ.length}</div>
                <h3 className="text-lg md:text-xl text-white font-bold mb-8 leading-tight">{QUIZ[quizIdx].q}</h3>
                
                <div className="grid gap-3">
                  {QUIZ[quizIdx].opts.map((opt, i) => {
                    const isAnswered = answered.includes(quizIdx);
                    const isCorrect = i === QUIZ[quizIdx].ans;
                    const isSelected = selectedOpt === i;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={isAnswered}
                        className={`p-4 rounded-xl text-left text-xs font-bold transition-all border flex justify-between items-center ${
                          isAnswered 
                            ? (isCorrect ? 'bg-success/5 border-success text-success' : (isSelected ? 'bg-secondary/5 border-secondary text-secondary' : 'bg-transparent border-border-dim text-[#6a8099] opacity-50'))
                            : 'bg-transparent border-border-dim text-[#6a8099] hover:border-primary hover:text-white'
                        }`}
                      >
                        {opt}
                        {isAnswered && isCorrect && <CheckCircle className="w-4 h-4" />}
                        {isAnswered && !isCorrect && isSelected && <XCircle className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {answered.includes(quizIdx) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-8 border-t border-border-dim/10 space-y-6"
                    >
                      <div className="p-4 bg-primary/5 rounded-xl border-l-2 border-primary">
                        <p className="text-[11px] text-[#6a8099] leading-relaxed">{QUIZ[quizIdx].explain}</p>
                      </div>
                      {quizIdx < QUIZ.length - 1 && (
                        <button 
                          onClick={() => { setQuizIdx(prev => prev + 1); setSelectedOpt(null); }}
                          className="btn-primary w-full flex justify-center items-center gap-2"
                        >
                          Next Question <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
);

export default Learn;
