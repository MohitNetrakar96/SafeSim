import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────
   Auth Modal
───────────────────────────────────────────── */
const AuthModal = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.75, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.75, y: 50 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-[#050a0f] border border-cyan-500/20 rounded-3xl p-10 text-center shadow-2xl overflow-hidden"
            >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-12 -right-12 w-44 h-44 rounded-full border border-cyan-500/20 pointer-events-none"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full border border-blue-500/15 pointer-events-none"
                />

                <motion.div
                    initial={{ rotate: -20, scale: 0.5 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                    className="relative mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30"
                >
                    <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-4xl select-none"
                    >🔒</motion.span>
                </motion.div>

                <h2 className="text-2xl font-black text-white mb-2">Sign In Required</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    Create a free account to access the transaction simulator and protect your Web3 assets.
                </p>
                <div className="flex flex-col gap-3">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/signup')}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg cursor-pointer">
                        Create Free Account →
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/login')}
                        className="w-full py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-semibold text-sm cursor-pointer">
                        Already have an account? Sign In
                    </motion.button>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-300 text-xs mt-1 cursor-pointer">
                        Maybe later
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   Animated grid lines
───────────────────────────────────────────── */
const GridLines = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    </div>
);

/* ─────────────────────────────────────────────
   Floating crystal shards (parallax)
───────────────────────────────────────────── */
interface Shard {
    id: number; x: number; y: number; size: number;
    rotate: number; depth: number; color: string;
}

const shards: Shard[] = [
    { id: 0, x: 8,  y: 20, size: 120, rotate: 20,  depth: 0.06, color: 'from-cyan-500/30 to-blue-600/10' },
    { id: 1, x: 75, y: 10, size: 90,  rotate: -15, depth: 0.04, color: 'from-blue-500/20 to-cyan-400/10' },
    { id: 2, x: 88, y: 55, size: 140, rotate: 30,  depth: 0.08, color: 'from-cyan-400/25 to-indigo-600/10' },
    { id: 3, x: 5,  y: 65, size: 100, rotate: -25, depth: 0.05, color: 'from-blue-400/20 to-cyan-500/10' },
    { id: 4, x: 55, y: 80, size: 80,  rotate: 10,  depth: 0.03, color: 'from-indigo-500/20 to-blue-400/10' },
    { id: 5, x: 30, y: 5,  size: 60,  rotate: -40, depth: 0.07, color: 'from-cyan-300/15 to-blue-500/10' },
];

/* ─────────────────────────────────────────────
   Hero
───────────────────────────────────────────── */
const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    /* mouse tracking */
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const mouseX = useSpring(rawX, { stiffness: 60, damping: 20 });
    const mouseY = useSpring(rawY, { stiffness: 60, damping: 20 });

    /* spotlight position */
    const [spotX, setSpotX] = useState(50);
    const [spotY, setSpotY] = useState(40);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
        rawX.set(x);
        rawY.set(y);
        setSpotX(((e.clientX - rect.left) / rect.width) * 100);
        setSpotY(((e.clientY - rect.top)  / rect.height) * 100);
    }, [rawX, rawY]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener('mousemove', handleMouseMove);
        return () => el.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    /* text parallax */
    const titleX = useTransform(mouseX, [-1, 1], [-18, 18]);
    const titleY = useTransform(mouseY, [-1, 1], [-10, 10]);
    const subtitleX = useTransform(mouseX, [-1, 1], [-8, 8]);
    const subtitleY = useTransform(mouseY, [-1, 1], [-5, 5]);

    const handleStart = () => {
        if (user) navigate('/simulation');
        else setShowModal(true);
    };


    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020608] select-none"
        >

            {/* ── Base grid ── */}
            <GridLines />

            {/* ── Spotlight following cursor ── */}
            <div
                className="pointer-events-none absolute inset-0 transition-all duration-100"
                style={{
                    background: `radial-gradient(600px circle at ${spotX}% ${spotY}%, rgba(34,211,238,0.07), transparent 65%)`,
                }}
            />

            {/* ── Static ambient glows ── */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            {/* ── Crystal shards ── */}
            {shards.map((s) => (
                <ParallaxShard key={s.id} shard={s} mouseX={mouseX} mouseY={mouseY} />
            ))}

            {/* ── Floating particles ── */}
            <Particles />

            {/* ── Main content ── */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-8 w-full max-w-7xl mx-auto">

                {/* Live badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-white/5 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-widest uppercase backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                    </span>
                    SafeSim v2.0 · Live on Mainnet
                </motion.div>

                {/* Giant title with mouse parallax */}
                <motion.div style={{ x: titleX, y: titleY }} className="mb-6">
                    <h1
                        className="font-black uppercase leading-none tracking-tighter text-white"
                        style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)', lineHeight: 0.9 }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="block"
                            style={{
                                WebkitTextStroke: '1px rgba(34,211,238,0.15)',
                                textShadow: '0 0 80px rgba(34,211,238,0.15)',
                            }}
                        >
                            SAFE
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="block"
                            style={{
                                background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #a855f7 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 30px rgba(34,211,238,0.4))',
                            }}
                        >
                            SIM
                        </motion.span>
                    </h1>
                </motion.div>

                {/* Subtitle with lighter parallax */}
                <motion.div style={{ x: subtitleX, y: subtitleY }}>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12"
                    >
                        Preview every on-chain transaction before you sign.
                        <br />
                        <span className="text-cyan-400/70">Stop scams. Save gas. Stay safe.</span>
                    </motion.p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-20"
                >
                    {/* Primary CTA */}
                    <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleStart}
                        className="relative group px-10 py-4 rounded-2xl font-bold text-base overflow-hidden cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                    >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* shimmer */}
                        <motion.span
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                        />
                        <span className="relative flex items-center gap-2 text-white">
                            {!user && (
                                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
                                    🔒
                                </motion.span>
                            )}
                            {user ? '⚡ Launch Simulator' : 'Start Simulating'}
                        </span>
                    </motion.button>

                    {/* Secondary */}
                    <motion.button
                        whileHover={{ scale: 1.04, borderColor: 'rgba(34,211,238,0.5)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/features')}
                        className="px-10 py-4 rounded-2xl border border-white/10 text-slate-300 hover:text-white font-semibold text-base transition-colors cursor-pointer backdrop-blur-sm"
                    >
                        How it works →
                    </motion.button>
                </motion.div>


                {/* Scroll hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="mt-12 flex flex-col items-center gap-2"
                >
                    <span className="text-slate-600 text-xs uppercase tracking-widest">Move your cursor</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-px h-8 bg-gradient-to-b from-cyan-500/60 to-transparent"
                    />
                </motion.div>
            </div>

            {/* Auth modal */}
            <AnimatePresence>
                {showModal && <AuthModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </section>
    );
};



/* ─────────────────────────────────────────────
   Parallax shard
───────────────────────────────────────────── */
const ParallaxShard = ({
    shard,
    mouseX,
    mouseY,
}: {
    shard: Shard;
    mouseX: ReturnType<typeof useSpring>;
    mouseY: ReturnType<typeof useSpring>;
}) => {
    const tx = useTransform(mouseX, [-1, 1], [-shard.depth * 200, shard.depth * 200]);
    const ty = useTransform(mouseY, [-1, 1], [-shard.depth * 120, shard.depth * 120]);

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: `${shard.x}%`,
                top: `${shard.y}%`,
                width: shard.size,
                height: shard.size * 2.5,
                x: tx,
                y: ty,
                rotate: shard.rotate,
            }}
            className={`bg-gradient-to-b ${shard.color} rounded-sm pointer-events-none`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.random() * 0.6, duration: 1 }}
        >
            {/* glowing edge */}
            <div
                className="absolute inset-0 rounded-sm"
                style={{
                    boxShadow: 'inset 0 0 20px rgba(34,211,238,0.15), 0 0 30px rgba(34,211,238,0.08)',
                }}
            />
            {/* crack line */}
            <div
                className="absolute left-1/2 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.4), transparent)' }}
            />
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   Floating particles
───────────────────────────────────────────── */
const Particles = () => {
    const count = 30;
    const dots = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        dur: Math.random() * 18 + 8,
        delay: Math.random() * 6,
    }));

    return (
        <>
            {dots.map((d) => (
                <motion.div
                    key={d.id}
                    className="absolute rounded-full bg-cyan-400/30 pointer-events-none"
                    style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
                    animate={{ y: [0, -80, 0], opacity: [0, 0.7, 0] }}
                    transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
                />
            ))}
        </>
    );
};

export default Hero;
