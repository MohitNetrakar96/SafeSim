import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Mail, Lock, Wallet, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
        },
    },
};

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithMetaMask, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    const handleMetaMaskLogin = async () => {
        setError('');

        try {
            await loginWithMetaMask();
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to connect MetaMask');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    background: [
                        'radial-gradient(600px circle at 0% 0%, rgba(34,211,238,0.1), transparent 50%)',
                        'radial-gradient(600px circle at 100% 100%, rgba(168,85,247,0.1), transparent 50%)',
                        'radial-gradient(600px circle at 0% 0%, rgba(34,211,238,0.1), transparent 50%)',
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 pointer-events-none"
            />

            {/* Floating Orbs */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    x: [0, -10, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                {/* Logo/Brand */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        animate={{
                            rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-block mb-4"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/50">
                            <span className="text-3xl">🛡️</span>
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-black text-white mb-2 font-display">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400">Login to continue to SafeSim</p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    variants={itemVariants}
                    className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl"
                >
                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 text-white placeholder:text-slate-500 bg-black/20 border-white/10 focus:border-cyan-500/50"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 text-white placeholder:text-slate-500 bg-black/20 border-white/10 focus:border-cyan-500/50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                                size="lg"
                            >
                                {isLoading ? (
                                    'Logging in...'
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div variants={itemVariants} className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900/50 text-slate-400 backdrop-blur-sm rounded-full">
                                Or continue with
                            </span>
                        </div>
                    </motion.div>

                    {/* MetaMask Login */}
                    <motion.div variants={itemVariants}>
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleMetaMaskLogin}
                            disabled={isLoading}
                            className="w-full group bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20 hover:border-orange-500/50"
                            size="lg"
                        >
                            <Wallet className="w-5 h-5 mr-2" />
                            {isLoading ? 'Connecting...' : 'Connect with MetaMask'}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-1 h-1 bg-orange-300 rounded-full ml-auto opacity-0 group-hover:opacity-100"
                            />
                        </Button>
                    </motion.div>

                    {/* Sign Up Link */}
                    <motion.div variants={itemVariants} className="mt-6 text-center">
                        <p className="text-slate-400">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </motion.div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center text-sm text-slate-500"
                >
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
