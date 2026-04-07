import { motion } from 'framer-motion';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <motion.footer
            // Glass effect but slight darker
            className="glass mt-20 py-12 px-6 backdrop-blur-3xl bg-slate-900/50"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-2xl font-bold gradient-text mb-4">NeonGlitch</h3>
                    <p className="text-slate-400">
                        Designing the future of web experiences with glassmorphism and neon vibes.
                    </p>
                </div>
                {[{ title: "Product", links: ["Features", "Integrations", "Pricing"] }, {
                    title: "Resources", links: ["Docs", "Blog", "Community"]
                }, {
                    title: "Company", links: ["About", "Careers", "Contact"]
                }].map(section => (
                    <div key={section.title}>
                        <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                        <ul className="space-y-2">
                            {section.links.map(link => (
                                <li key={link}>
                                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} NeonGlitch. All rights reserved.
            </div>
        </motion.footer>
    );
};

export default Footer;
