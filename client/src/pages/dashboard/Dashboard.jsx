import { useAuth } from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'instructor') return <InstructorDashboard />;
  return <StudentDashboard />;
};

export default Dashboard;
