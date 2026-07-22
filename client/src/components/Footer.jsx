import { Link } from 'react-router-dom';
import { HiAcademicCap } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <HiAcademicCap className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">Learn<span className="gradient-text">Hub</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Empowering learners worldwide with high-quality courses, expert instructors, and cutting-edge technology. Start your learning journey today.
            </p>
            <div className="flex gap-3 mt-4">
              {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600/30 transition-all">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <div className="space-y-2">
              {['Courses', 'About', 'Contact', 'Pricing'].map((link) => (
                <Link key={link} to={`/${link.toLowerCase()}`} className="block text-sm text-gray-400 hover:text-white transition-colors">{link}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'FAQ'].map((link) => (
                <a key={link} href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
