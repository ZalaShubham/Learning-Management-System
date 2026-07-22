import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyCourses from './pages/dashboard/MyCourses';
import CreateCourse from './pages/dashboard/CreateCourse';
import ManageUsers from './pages/dashboard/ManageUsers';
import ManageCategories from './pages/dashboard/ManageCategories';
import Certificates from './pages/dashboard/Certificates';
import Payments from './pages/dashboard/Payments';

const App = () => {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route path="/profile" element={<ProtectedRoute />}>
          <Route index element={<Profile />} />
        </Route>
        <Route path="/notifications" element={<ProtectedRoute />}>
          <Route index element={<Notifications />} />
        </Route>

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="payments" element={<Payments />} />

            {/* Instructor */}
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="assignments" element={<MyCourses />} />
            <Route path="quizzes" element={<MyCourses />} />

            {/* Admin */}
            <Route path="users" element={<ManageUsers />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="analytics" element={<Dashboard />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
