import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get session ID from URL
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');

        if (sessionId) {
            // Fetch session details from backend
            fetch(`${import.meta.env.VITE_API_URL}/api/payment/session/${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    setSessionInfo(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch session:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 text-center"
            >
                {loading ? (
                    <div>
                        <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-slate-400">Loading payment details...</p>
                    </div>
                ) : (
                    <>
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.6 }}
                            className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-5xl mx-auto mb-6"
                        >
                            ✓
                        </motion.div>

                        {/* Success Message */}
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-display">
                            Payment Successful!
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Welcome to SafeSim! Your subscription is now active.
                        </p>

                        {/* Session Details */}
                        {sessionInfo && (
                            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 text-left">
                                <h3 className="text-lg font-bold text-white mb-4">Order Details</h3>
                                <div className="space-y-2 text-slate-300">
                                    {sessionInfo.customerEmail && (
                                        <p><span className="text-slate-500">Email:</span> {sessionInfo.customerEmail}</p>
                                    )}
                                    {sessionInfo.amountTotal && (
                                        <p><span className="text-slate-500">Amount:</span> ${(sessionInfo.amountTotal / 100).toFixed(2)}</p>
                                    )}
                                    {sessionInfo.metadata?.plan && (
                                        <p><span className="text-slate-500">Plan:</span> {sessionInfo.metadata.plan} ({sessionInfo.metadata.billingCycle})</p>
                                    )}
                                    <p><span className="text-slate-500">Status:</span> <span className="text-emerald-400">{sessionInfo.status}</span></p>
                                </div>
                            </div>
                        )}

                        {/* What's Next */}
                        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 text-left">
                            <h3 className="text-lg font-bold text-white mb-4">What's Next?</h3>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-cyan-400 mt-1">✓</span>
                                    <span>Check your email for the confirmation receipt</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-cyan-400 mt-1">✓</span>
                                    <span>Start using SafeSim with all premium features</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-cyan-400 mt-1">✓</span>
                                    <span>Access your account dashboard to manage subscription</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/')}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                            >
                                Start Using SafeSim
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/pricing')}
                                className="px-8 py-4 rounded-xl backdrop-blur-xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
                            >
                                View Pricing
                            </motion.button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
