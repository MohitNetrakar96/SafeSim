import Layout from '../components/layout/Layout';
import AboutSection from '../components/AboutSection';

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 pt-20">
        <AboutSection />
      </div>
    </Layout>
  );
}
