import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleGetStarted = () => {
        if (user) {
            navigate('/simulation');
        } else {
            // User not logged in, go to signup page
            navigate('/signup');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-background/60 border-b border-border shadow-sm py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <motion.div
                    className="text-2xl font-bold gradient-text cursor-pointer font-display"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                >
                    Safe<span className="text-foreground">Sim</span>
                </motion.div>

                <nav>
                    <ul className="flex space-x-8 items-center">
                        {[
                            { label: 'Home', path: '/' },
                            { label: 'Simulation', path: '/simulation' },
                            { label: 'Features', path: '/features' },
                            { label: 'Pricing', path: '/pricing' },
                            { label: 'About', path: '/about' },
                        ].map((item) => (
                            <motion.li key={item.label} whileHover={{ y: -2 }}>
                                <a
                                    href={item.path}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(item.path);
                                    }}
                                    className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                                >
                                    {item.label}
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    <ModeToggle />

                    {user ? (
                        <>
                            {/* User Info */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-accent/10 border border-border"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center">
                                    {user.authMethod === 'metamask' ? (
                                        <span className="text-sm">🦊</span>
                                    ) : (
                                        <User className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <span className="text-sm text-foreground font-medium">
                                    {user.authMethod === 'metamask'
                                        ? `${user.address?.slice(0, 6)}...${user.address?.slice(-4)}`
                                        : user.email?.split('@')[0]
                                    }
                                </span>
                            </motion.div>

                            {/* Logout Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 rounded-full backdrop-blur-xl bg-accent/10 border border-border text-foreground hover:bg-destructive/10 hover:border-destructive/50 transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </motion.button>
                        </>
                    ) : (
                        <>
                            {/* Sign In Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="px-5 py-2 rounded-full backdrop-blur-xl bg-accent/10 border border-border text-foreground font-medium hover:bg-accent/20 transition-all"
                            >
                                Sign In
                            </motion.button>

                            {/* Get Started Button */}
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(34,211,238,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGetStarted}
                                className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 relative overflow-hidden group"
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
