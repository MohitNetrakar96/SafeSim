import { motion } from 'framer-motion';
import { Badge } from './DesignSystem';

const AboutSection = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 70, damping: 15 },
        },
    };

    const features = [
        {
            icon: '🔍',
            title: 'Transaction Preview',
            description: 'See exactly what will happen before you sign any transaction',
        },
        {
            icon: '🛡️',
            title: 'Scam Protection',
            description: 'AI-powered detection of phishing attempts and malicious contracts',
        },
        {
            icon: '💰',
            title: 'Cost Optimization',
            description: 'Real-time gas estimation and transaction fee optimization',
        },
        {
            icon: '🎯',
            title: 'Smart Analysis',
            description: 'Deep contract analysis revealing hidden functions and risks',
        },
    ];

    const howItWorks = [
        {
            step: '01',
            title: 'Connect Your Wallet',
            description: 'Link your Web3 wallet (MetaMask, WalletConnect, or Coinbase Wallet) to get started.',
            icon: '🔗',
        },
        {
            step: '02',
            title: 'Input Transaction Details',
            description: 'Enter the contract address, function name, and parameters you want to interact with.',
            icon: '📝',
        },
        {
            step: '03',
            title: 'AI Analysis & Simulation',
            description: 'Our advanced engine simulates the transaction on a forked blockchain, analyzing every detail.',
            icon: '⚡',
        },
        {
            step: '04',
            title: 'Review & Execute',
            description: 'Get a comprehensive risk report, see exact outcomes, and decide whether to proceed.',
            icon: '✅',
        },
    ];

    const problems = [
        {
            problem: 'Unknown Transaction Outcomes',
            solution: 'Real-time simulation shows exact state changes before signing',
            color: 'from-red-500 to-orange-500',
        },
        {
            problem: 'Phishing & Scam Contracts',
            solution: 'AI detection flags malicious patterns and unlimited approvals',
            color: 'from-purple-500 to-pink-500',
        },
        {
            problem: 'Unpredictable Gas Fees',
            solution: 'Accurate gas estimation with multi-network comparison',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            problem: 'Complex Smart Contracts',
            solution: 'Human-readable explanations of contract functions',
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <section id="about" className="py-20 relative overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
            <motion.div
                animate={{
                    background: [
                        'radial-gradient(600px circle at 0% 0%, rgba(34,211,238,0.03), transparent 50%)',
                        'radial-gradient(600px circle at 100% 100%, rgba(168,85,247,0.03), transparent 50%)',
                        'radial-gradient(600px circle at 0% 100%, rgba(34,211,238,0.03), transparent 50%)',
                        'radial-gradient(600px circle at 100% 0%, rgba(168,85,247,0.03), transparent 50%)',
                        'radial-gradient(600px circle at 0% 0%, rgba(34,211,238,0.03), transparent 50%)',
                    ],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
            />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-20">
                        <Badge variant="info" className="mb-4">About SafeSim</Badge>
                        <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
                            Your Shield in the{' '}
                            <span className="gradient-text font-display">Web3 World</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            SafeSim is an advanced blockchain transaction simulator designed to protect users
                            from costly mistakes, scams, and unexpected outcomes in the Web3 ecosystem.
                        </p>
                    </motion.div>

                    {/* Mission Statement */}
                    <motion.div
                        variants={itemVariants}
                        className="glass-card max-w-5xl mx-auto p-12 mb-20 border-cyan-500/20"
                    >
                        <div className="flex items-start gap-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-4xl flex-shrink-0 shadow-xl shadow-cyan-500/20"
                            >
                                🎯
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-4 font-display">Our Mission</h3>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    To democratize blockchain security by providing everyone with enterprise-grade
                                    transaction analysis tools. We believe that every Web3 user deserves to know
                                    exactly what they're signing, eliminating the fear and uncertainty that plagues
                                    the crypto space today.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Core Features Grid */}
                    <motion.div variants={itemVariants} className="mb-20">
                        <h3 className="text-4xl font-bold text-center text-white mb-12 font-display">
                            Core Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                >
                                    <div className="text-5xl mb-4">{feature.icon}</div>
                                    <h4 className="text-xl font-bold text-white mb-2 font-display">
                                        {feature.title}
                                    </h4>
                                    <p className="text-slate-400 text-sm">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* How It Works */}
                    <motion.div variants={itemVariants} className="mb-20">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-white mb-4 font-display">
                                How It Works
                            </h3>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Four simple steps to secure your Web3 transactions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {howItWorks.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="relative"
                                >
                                    {/* Connector Line */}
                                    {index < howItWorks.length - 1 && (
                                        <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                                    )}

                                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 h-full">
                                        {/* Step Number */}
                                        <div className="text-6xl font-black text-cyan-500/20 mb-4 font-display">
                                            {item.step}
                                        </div>

                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            className="text-5xl mb-4"
                                        >
                                            {item.icon}
                                        </motion.div>

                                        {/* Content */}
                                        <h4 className="text-xl font-bold text-white mb-3 font-display">
                                            {item.title}
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Problems We Solve */}
                    <motion.div variants={itemVariants}>
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-white mb-4 font-display">
                                Problems We Solve
                            </h3>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Turning Web3 risks into confident decisions
                            </p>
                        </div>

                        <div className="space-y-6 max-w-4xl mx-auto">
                            {problems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ x: 10 }}
                                    className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-6">
                                        {/* Problem */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <h4 className="text-lg font-semibold text-red-400">Problem</h4>
                                            </div>
                                            <p className="text-slate-300 pl-5">{item.problem}</p>
                                        </div>

                                        {/* Arrow */}
                                        <motion.div
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="text-3xl text-cyan-400 flex-shrink-0"
                                        >
                                            →
                                        </motion.div>

                                        {/* Solution */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                                                <h4 className="text-lg font-semibold text-cyan-400">Solution</h4>
                                            </div>
                                            <p className="text-slate-300 pl-5">{item.solution}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { value: '10K+', label: 'Transactions Simulated' },
                            { value: '99.9%', label: 'Accuracy Rate' },
                            { value: '5K+', label: 'Users Protected' },
                            { value: '$2.5M+', label: 'Scams Prevented' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className="text-center backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="text-4xl font-black gradient-text mb-2 font-display">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
