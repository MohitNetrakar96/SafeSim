import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import Hero from './components/Hero';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Hero />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[#050c12]">
        <div className="absolute inset-0 bg-cyan-900/5 -skew-y-3 transform origin-left" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card max-w-4xl mx-auto text-center p-12 md:p-16 border-cyan-500/30"
          >
            <h2 className="text-4xl font-bold mb-6 font-display">Ready to secure your wallet?</h2>
            <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">
              Join thousands of users who sleep soundly knowing their assets are protected by
              SafeSim's advanced simulation engine.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/simulation')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-white font-bold text-lg cursor-pointer"
              >
                Try Simulator Now →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/features')}
                className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white font-semibold text-lg cursor-pointer"
              >
                Explore Features
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppContent />
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
