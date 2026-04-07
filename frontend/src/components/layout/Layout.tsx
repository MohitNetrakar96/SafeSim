import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden bg-slate-950 font-[Inter]">
            {/* Animated glowing orbs for background effect */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none z-0"
            />
            <motion.div
                animate={{
                    x: [0, -50, 50, 0],
                    y: [0, 50, -50, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
                className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none z-0"
            />

            <Header />

            <main className="flex-grow pt-24 pb-12 px-6 container mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
