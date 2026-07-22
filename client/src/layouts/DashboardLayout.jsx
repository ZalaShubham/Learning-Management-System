import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiHome, HiBookOpen, HiUsers, HiChartBar, HiCog, HiAcademicCap, HiDocumentText, HiPuzzle, HiBell, HiCreditCard, HiClipboardList, HiLogout, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const studentLinks = [
    { path: '/dashboard', icon: HiHome, label: 'Dashboard', end: true },
    { path: '/dashboard/my-courses', icon: HiBookOpen, label: 'My Courses' },
    { path: '/dashboard/certificates', icon: HiAcademicCap, label: 'Certificates' },
    { path: '/dashboard/payments', icon: HiCreditCard, label: 'Payments' },
    { path: '/notifications', icon: HiBell, label: 'Notifications' },
    { path: '/profile', icon: HiCog, label: 'Settings' },
  ];

  const instructorLinks = [
    { path: '/dashboard', icon: HiHome, label: 'Dashboard', end: true },
    { path: '/dashboard/my-courses', icon: HiBookOpen, label: 'My Courses' },
    { path: '/dashboard/create-course', icon: HiDocumentText, label: 'Create Course' },
    { path: '/dashboard/assignments', icon: HiClipboardList, label: 'Assignments' },
    { path: '/dashboard/quizzes', icon: HiPuzzle, label: 'Quizzes' },
    { path: '/notifications', icon: HiBell, label: 'Notifications' },
    { path: '/profile', icon: HiCog, label: 'Settings' },
  ];

  const adminLinks = [
    { path: '/dashboard', icon: HiHome, label: 'Dashboard', end: true },
    { path: '/dashboard/users', icon: HiUsers, label: 'Users' },
    { path: '/dashboard/courses', icon: HiBookOpen, label: 'Courses' },
    { path: '/dashboard/categories', icon: HiClipboardList, label: 'Categories' },
    { path: '/dashboard/payments', icon: HiCreditCard, label: 'Payments' },
    { path: '/dashboard/certificates', icon: HiAcademicCap, label: 'Certificates' },
    { path: '/dashboard/analytics', icon: HiChartBar, label: 'Analytics' },
    { path: '/profile', icon: HiCog, label: 'Settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-light border-r border-white/10 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiAcademicCap className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">Learn<span className="gradient-text">Hub</span></span>
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <HiX className="text-xl" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-600/20 text-primary-400 shadow-lg shadow-primary-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <link.icon className="text-lg" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <HiLogout className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <HiMenu className="text-xl" />
          </button>
          <h2 className="text-lg font-semibold text-white ml-2 lg:ml-0">
            {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'instructor' ? 'Instructor Panel' : 'Student Panel'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
