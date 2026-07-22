import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiBell, HiUser, HiLogout, HiAcademicCap } from 'react-icons/hi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HiAcademicCap className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white">Learn<span className="gradient-text">Hub</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.path) ? 'text-white bg-primary-600/30' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                  <HiBell className="text-xl" />
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300">{user?.name?.split(' ')[0]}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 py-2 bg-surface-light border border-white/10 rounded-xl shadow-2xl animate-fade-in">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary-600/30 text-primary-300 rounded-full capitalize">{user?.role}</span>
                      </div>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                        <HiUser className="text-lg" /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                        <HiUser className="text-lg" /> Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5">
                        <HiLogout className="text-lg" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="btn-primary px-5 py-2 text-sm font-medium text-white rounded-lg">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-300">
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-light border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`block px-4 py-2 rounded-lg text-sm ${isActive(link.path) ? 'bg-primary-600/30 text-white' : 'text-gray-300'}`}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-300">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-red-400">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-300">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-white btn-primary text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
