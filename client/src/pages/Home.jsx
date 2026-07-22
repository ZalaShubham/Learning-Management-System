import { Link } from 'react-router-dom';
import { HiAcademicCap, HiUsers, HiPlay, HiStar, HiArrowRight, HiShieldCheck, HiLightningBolt, HiGlobe } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const stats = [
  { icon: HiUsers, value: '50K+', label: 'Students' },
  { icon: HiPlay, value: '1000+', label: 'Courses' },
  { icon: HiAcademicCap, value: '200+', label: 'Instructors' },
  { icon: HiStar, value: '4.8', label: 'Avg Rating' },
];

const features = [
  { icon: HiLightningBolt, title: 'Interactive Learning', desc: 'Engage with video lessons, quizzes, and hands-on assignments designed for real-world skills.' },
  { icon: HiShieldCheck, title: 'Certified Courses', desc: 'Earn industry-recognized certificates upon completion to boost your career prospects.' },
  { icon: HiGlobe, title: 'Learn Anywhere', desc: 'Access courses on any device, anytime. Our responsive platform adapts to your lifestyle.' },
  { icon: HiAcademicCap, title: 'Expert Instructors', desc: 'Learn from industry professionals with years of real-world experience and teaching expertise.' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full text-sm text-primary-400 mb-8 animate-fade-in">
              <HiLightningBolt /> #1 Learning Platform for Professionals
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Master New Skills,<br />
              <span className="gradient-text">Shape Your Future</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Join thousands of learners worldwide. Access expert-led courses, earn certificates, and accelerate your career with LearnHub.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/courses" className="btn-primary px-8 py-4 text-lg font-semibold text-white rounded-2xl flex items-center gap-2 animate-pulse-glow">
                Explore Courses <HiArrowRight />
              </Link>
              <Link to="/register" className="px-8 py-4 text-lg font-semibold text-gray-300 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                Start Free
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center hover:border-primary-500/30 transition-all group">
                <stat.icon className="text-3xl text-primary-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose <span className="gradient-text">LearnHub</span>?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to learn, teach, and grow — all in one powerful platform.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-8 hover:border-primary-500/30 transition-all group hover:-translate-y-2 duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
            <div className="relative p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Learning?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Join our community of learners and unlock your potential. Your journey begins here.</p>
              <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all hover:scale-105">
                Get Started Free <HiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
