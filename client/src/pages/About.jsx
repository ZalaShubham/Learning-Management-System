import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HiAcademicCap, HiLightningBolt, HiGlobe, HiUsers } from 'react-icons/hi';

const About = () => (
  <div className="min-h-screen bg-surface"><Navbar />
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About <span className="gradient-text">LearnHub</span></h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">We're on a mission to make quality education accessible to everyone, everywhere.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
          <p className="text-gray-400 leading-relaxed mb-4">LearnHub was founded with a simple belief: education should be accessible, engaging, and practical. We bring together world-class instructors, cutting-edge technology, and a vibrant community of learners.</p>
          <p className="text-gray-400 leading-relaxed">Whether you're looking to advance your career, learn a new skill, or share your expertise with the world, LearnHub provides the tools and platform to make it happen.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[{ icon: HiUsers, val: '50K+', label: 'Active Learners' }, { icon: HiAcademicCap, val: '1000+', label: 'Expert Courses' }, { icon: HiGlobe, val: '100+', label: 'Countries' }, { icon: HiLightningBolt, val: '95%', label: 'Satisfaction' }].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center hover:border-primary-500/30 transition-all">
              <s.icon className="text-3xl text-primary-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{s.val}</p><p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
