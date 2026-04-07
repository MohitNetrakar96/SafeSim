import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import SimulatorInterface from '../components/simulator/SimulatorInterface';

export default function SimulationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users to signup
  useEffect(() => {
    if (!user) {
      navigate('/signup', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen relative">
        <div className="absolute inset-0 bg-background -z-10" />
        <div className="container md:w-[90%] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 mt-10"
          >
            <h1 className="text-4xl font-bold font-display gradient-text">Transaction Simulator</h1>
            <p className="text-muted-foreground mt-2">
              Test your transactions safely before broadcasting them to the network.
            </p>
          </motion.div>
          <SimulatorInterface />
        </div>
      </div>
    </Layout>
  );
}
