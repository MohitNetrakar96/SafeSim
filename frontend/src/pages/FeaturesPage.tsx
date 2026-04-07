import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { Badge } from '../components/DesignSystem';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Real-time Simulation',
    description: 'See exactly what a transaction will do before you sign it.',
    details: [
      'Simulates transactions on forked mainnet',
      'Shows exact state changes and balance impacts',
      'Reveals hidden function calls',
      'Validates smart contract interactions',
    ],
    icon: '⚡',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    title: 'Phishing Detection',
    description: 'AI-powered protection against malicious contracts.',
    details: [
      'Analyzes contract bytecode patterns',
      'Detects unlimited approval requests',
      'Checks against known scam databases',
      'Monitors suspicious token transfers',
    ],
    icon: '🛡️',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Gas Estimation',
    description: 'Optimize your transaction costs with precision.',
    details: [
      'Real-time gas price predictions',
      'Multi-network fee comparison',
      'Transaction priority recommendations',
      'Historical gas trend analysis',
    ],
    icon: '⛽',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    title: 'Risk Scoring',
    description: 'Instant risk assessment for every on-chain interaction.',
    details: [
      'Composite risk score from 0–100',
      'Breakdown of risk factors',
      'Historical risk pattern analysis',
      'Comparable transaction benchmarks',
    ],
    icon: '📊',
    color: 'from-orange-400 to-red-500',
  },
  {
    title: 'Multi-Network Support',
    description: 'Simulate across all major EVM-compatible chains.',
    details: [
      'Ethereum Mainnet & testnets',
      'Polygon, Arbitrum, Optimism',
      'BNB Chain & Avalanche',
      'Custom RPC endpoint support',
    ],
    icon: '🌐',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    title: 'Contract Decoder',
    description: 'Human-readable explanations of complex smart contracts.',
    details: [
      'ABI parsing & function decoding',
      'Event log interpretation',
      'Proxy contract resolution',
      'Token metadata extraction',
    ],
    icon: '🔎',
    color: 'from-yellow-400 to-amber-500',
  },
];

export default function FeaturesPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 pt-28 pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10" />
        <motion.div
          animate={{
            background: [
              'radial-gradient(700px circle at 20% 20%, rgba(34,211,238,0.04), transparent 50%)',
              'radial-gradient(700px circle at 80% 80%, rgba(168,85,247,0.04), transparent 50%)',
              'radial-gradient(700px circle at 20% 20%, rgba(34,211,238,0.04), transparent 50%)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 -z-10 pointer-events-none"
        />

        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="info" className="mb-4">Why SafeSim?</Badge>
            <h1 className="text-5xl md:text-6xl font-black mb-6 font-display">
              Complete Transaction{' '}
              <span className="gradient-text font-display">Transparency</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Don't trust, verify. Our platform gives you the insights you need to transact
              with confidence in the Web3 space.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                onHoverStart={() => setActiveCard(index)}
                onHoverEnd={() => setActiveCard(null)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative group h-full"
              >
                <div className="relative h-full backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-cyan-500/10">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`} />
                  {/* Large watermark icon */}
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity duration-500 text-9xl -mr-6 -mt-6">
                    {feature.icon}
                  </div>

                  {/* Icon Badge */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl mb-6 shadow-xl`}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm" />
                    <span className="relative z-10">{feature.icon}</span>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-3 font-display relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-4 relative z-10">
                    {feature.description}
                  </p>

                  {/* Details revealed on hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: activeCard === index ? 1 : 0,
                      height: activeCard === index ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="relative z-10 overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      {feature.details.map((detail, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: activeCard === index ? 1 : 0,
                            x: activeCard === index ? 0 : -10,
                          }}
                          transition={{ delay: idx * 0.05, duration: 0.2 }}
                          className="flex items-start gap-2"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color} mt-2 flex-shrink-0`} />
                          <span className="text-sm text-slate-300">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Bottom gradient line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: activeCard === index ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="glass-card max-w-3xl mx-auto p-12 border-cyan-500/30">
              <h2 className="text-3xl font-bold mb-4 font-display">Ready to experience it?</h2>
              <p className="text-slate-400 mb-8">
                Try our live transaction simulator and see these features in action.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/simulation')}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-white font-bold text-lg cursor-pointer"
              >
                Try Simulator Now →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
