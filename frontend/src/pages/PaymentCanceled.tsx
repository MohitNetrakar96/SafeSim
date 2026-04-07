import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PaymentCanceled = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-12 text-center"
            >
                {/* Cancel Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-5xl mx-auto mb-6"
                >
                    ✕
                </motion.div>

                {/* Cancel Message */}
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-display">
                    Payment Canceled
                </h1>
                <p className="text-xl text-slate-300 mb-8">
                    Your payment was canceled. No charges were made to your account.
                </p>

                {/* Info Box */}
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 text-left">
                    <h3 className="text-lg font-bold text-white mb-4">What Happened?</h3>
                    <p className="text-slate-300 mb-4">
                        You've returned from the payment page without completing the transaction. This could be because:
                    </p>
                    <ul className="space-y-2 text-slate-300 list-disc list-inside">
                        <li>You clicked the back button</li>
                        <li>You closed the payment window</li>
                        <li>The session expired</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/pricing')}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                    >
                        Try Again
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="px-8 py-4 rounded-xl backdrop-blur-xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
                    >
                        Back to Home
                    </motion.button>
                </div>

                {/* Help Text */}
                <p className="text-slate-400 mt-8 text-sm">
                    Need help? Contact our support team at <a href="mailto:support@safesim.com" className="text-cyan-400 hover:underline">support@safesim.com</a>
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentCanceled;
