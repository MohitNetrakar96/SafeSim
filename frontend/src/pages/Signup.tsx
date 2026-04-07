import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Mail, Lock, User, Wallet, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const { signup, loginWithMetaMask, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const passwordRequirements = [
        { label: 'At least 6 characters', met: formData.password.length >= 6 },
        { label: 'Contains a number', met: /\d/.test(formData.password) },
        { label: 'Contains uppercase', met: /[A-Z]/.test(formData.password) },
    ];

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await signup(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError('Failed to create account');
        }
    };

    const handleMetaMaskSignup = async () => {
        setError('');

        try {
            await loginWithMetaMask();
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to connect MetaMask');
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 120,
                damping: 14,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Animated Background */}
            <motion.div
                animate={{
                    background: [
                        'radial-gradient(600px circle at 80% 20%, rgba(168,85,247,0.15), transparent 50%)',
                        'radial-gradient(600px circle at 20% 80%, rgba(34,211,238,0.15), transparent 50%)',
                        'radial-gradient(600px circle at 80% 20%, rgba(168,85,247,0.15), transparent 50%)',
                    ],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 pointer-events-none"
            />

            {/* Animated Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
                        x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute w-2 h-2 bg-cyan-400/20 rounded-full blur-sm"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                {/* Logo/Brand */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="inline-block mb-4"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50">
                            <span className="text-3xl">✨</span>
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-black text-white mb-2 font-display">
                        Create Account
                    </h1>
                    <p className="text-slate-400">Join SafeSim to protect your transactions</p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    variants={itemVariants}
                    className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl"
                >
                    <form onSubmit={handleSignup} className="space-y-5">
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-12"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-12"
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
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-12 pr-12"
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

                            {/* Password Requirements */}
                            {formData.password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 space-y-2"
                                >
                                    {passwordRequirements.map((req, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.met ? 'bg-green-500' : 'bg-slate-600'
                                                    }`}
                                            >
                                                {req.met && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={req.met ? 'text-green-400' : 'text-slate-400'}>
                                                {req.label}
                                            </span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="pl-12 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                                className="w-full group"
                                size="lg"
                            >
                                {isLoading ? (
                                    'Creating Account...'
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div variants={itemVariants} className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900/50 text-slate-400 backdrop-blur-sm rounded-full">
                                Or sign up with
                            </span>
                        </div>
                    </motion.div>

                    {/* MetaMask Signup */}
                    <motion.div variants={itemVariants}>
                        <Button
                            type="button"
                            variant="metamask"
                            onClick={handleMetaMaskSignup}
                            disabled={isLoading}
                            className="w-full"
                            size="lg"
                        >
                            <Wallet className="w-5 h-5" />
                            {isLoading ? 'Connecting...' : 'Sign up with MetaMask'}
                        </Button>
                    </motion.div>

                    {/* Login Link */}
                    <motion.div variants={itemVariants} className="mt-6 text-center">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </motion.div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center text-sm text-slate-500"
                >
                    <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;
