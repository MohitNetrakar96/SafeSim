import Layout from '../components/layout/Layout';
import PricingSection from '../components/PricingSection';

export default function PricingPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 pt-20">
        <PricingSection />
      </div>
    </Layout>
  );
}
