import { motion } from 'framer-motion';
import { Badge } from './DesignSystem';
import { useState } from 'react';
import { usePayment } from '../hooks/usePayment';

const PricingSection = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const { handleStripeCheckout, loading } = usePayment();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
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

    const plans = [
        {
            name: 'Free',
            description: 'Perfect for trying out SafeSim',
            price: { monthly: 0, yearly: 0 },
            color: 'from-slate-400 to-slate-600',
            features: [
                '10 simulations per month',
                'Basic transaction preview',
                'Gas estimation',
                'Community support',
                'Public blockchain networks',
            ],
            limitations: [
                'No advanced analytics',
                'Standard support only',
                'Basic risk assessment',
            ],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Pro',
            description: 'For serious Web3 users',
            price: { monthly: 29, yearly: 290 },
            color: 'from-cyan-400 to-blue-500',
            features: [
                'Unlimited simulations',
                'Advanced transaction analysis',
                'Real-time phishing detection',
                'Priority support 24/7',
                'All blockchain networks',
                'Historical transaction data',
                'Custom alerts & notifications',
                'API access',
            ],
            limitations: [],
            cta: 'Start Pro Trial',
            popular: true,
        },
        {
            name: 'Enterprise',
            description: 'For teams and organizations',
            price: { monthly: 99, yearly: 990 },
            color: 'from-purple-500 to-pink-500',
            features: [
                'Everything in Pro',
                'Team collaboration tools',
                'Advanced security analytics',
                'Dedicated account manager',
                'Custom integrations',
                'On-premise deployment option',
                'Compliance reporting',
                'SLA guarantee',
                'White-label solution',
            ],
            limitations: [],
            cta: 'Contact Sales',
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Animated Background */}
            <motion.div
                animate={{
                    background: [
                        'radial-gradient(800px circle at 20% 30%, rgba(34,211,238,0.05), transparent 50%)',
                        'radial-gradient(800px circle at 80% 70%, rgba(168,85,247,0.05), transparent 50%)',
                        'radial-gradient(800px circle at 20% 30%, rgba(34,211,238,0.05), transparent 50%)',
                    ],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
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
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <Badge variant="info" className="mb-4">Pricing Plans</Badge>
                        <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
                            Choose Your{' '}
                            <span className="gradient-text font-display">Protection Plan</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Start free, upgrade as you grow. All plans include core transaction simulation features.
                        </p>
                    </motion.div>

                    {/* Billing Toggle */}
                    <motion.div variants={itemVariants} className="flex justify-center items-center gap-4 mb-12">
                        <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
                            Monthly
                        </span>
                        <motion.button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-16 h-8 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ x: billingCycle === 'monthly' ? 2 : 34 }}
                                transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
                                className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg"
                            />
                        </motion.button>
                        <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                            Yearly
                        </span>
                        {billingCycle === 'yearly' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold"
                            >
                                Save 17%
                            </motion.span>
                        )}
                    </motion.div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-bold shadow-lg"
                                        >
                                            ⭐ Most Popular
                                        </motion.div>
                                    </div>
                                )}

                                {/* Card */}
                                <div
                                    className={`relative h-full backdrop-blur-xl bg-white/5 rounded-3xl border ${plan.popular ? 'border-cyan-500/50' : 'border-white/10'
                                        } p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${plan.popular ? 'shadow-2xl shadow-cyan-500/20' : ''
                                        }`}
                                >
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 opacity-5 rounded-3xl bg-gradient-to-br ${plan.color}`} />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-white mb-2 font-display">{plan.name}</h3>
                                        <p className="text-slate-400 mb-6">{plan.description}</p>

                                        {/* Price */}
                                        <div className="mb-8">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black text-white font-display">
                                                    ${plan.price[billingCycle]}
                                                </span>
                                                <span className="text-slate-400">
                                                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                                                </span>
                                            </div>
                                            {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                                                <p className="text-sm text-slate-500 mt-2">
                                                    ${(plan.price.yearly / 12).toFixed(2)}/month billed annually
                                                </p>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <motion.button
                                            onClick={() => {
                                                handleStripeCheckout({
                                                    name: plan.name,
                                                    price: plan.price[billingCycle],
                                                    billingCycle: billingCycle,
                                                });
                                            }}
                                            disabled={loading}
                                            whileHover={{ scale: loading ? 1 : 1.05 }}
                                            whileTap={{ scale: loading ? 1 : 0.95 }}
                                            className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all duration-300 ${plan.popular
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                                                : 'backdrop-blur-xl bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {loading ? 'Processing...' : plan.cta}
                                        </motion.button>

                                        {/* Features List */}
                                        <div className="space-y-4">
                                            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                                                What's Included
                                            </p>
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                        <span className="text-white text-xs">✓</span>
                                                    </div>
                                                    <span className="text-slate-300 text-sm">{feature}</span>
                                                </div>
                                            ))}

                                            {plan.limitations.length > 0 && (
                                                <>
                                                    <div className="pt-4 border-t border-white/10" />
                                                    {plan.limitations.map((limitation, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 opacity-50">
                                                            <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <span className="text-white text-xs">✕</span>
                                                            </div>
                                                            <span className="text-slate-400 text-sm">{limitation}</span>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ / Additional Info */}
                    <motion.div variants={itemVariants} className="mt-20 max-w-4xl mx-auto">
                        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 font-display text-center">
                                All Plans Include
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: '🔒', text: 'End-to-end encryption' },
                                    { icon: '🚀', text: 'Lightning-fast performance' },
                                    { icon: '📊', text: 'Detailed analytics dashboard' },
                                    { icon: '🔄', text: 'Regular feature updates' },
                                    { icon: '💳', text: 'Flexible payment options' },
                                    { icon: '🛡️', text: '99.9% uptime guarantee' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="text-slate-300">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div variants={itemVariants} className="mt-12 text-center">
                        <p className="text-slate-500 mb-6">Trusted by developers worldwide</p>
                        <div className="flex justify-center items-center gap-8 flex-wrap opacity-50">
                            {['🔐 SOC 2 Certified', '⚡️ 99.9% Uptime', '🛡️ GDPR Compliant', '💎 Blockchain Verified'].map(
                                (badge, idx) => (
                                    <span key={idx} className="text-slate-400 text-sm">
                                        {badge}
                                    </span>
                                )
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;
