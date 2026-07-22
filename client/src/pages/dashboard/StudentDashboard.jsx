import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiUsers, HiBookOpen, HiCash, HiAcademicCap, HiTrendingUp, HiUserAdd } from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminService.getStudentDashboard();
        setStats(data.stats);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const progressData = {
    labels: ['Enrolled', 'Completed', 'In Progress'],
    datasets: [{ data: [stats?.enrolled || 0, stats?.completed || 0, stats?.inProgress || 0], backgroundColor: ['#6366f1', '#22c55e', '#f59e0b'], borderWidth: 0 }],
  };

  const cards = [
    { icon: HiBookOpen, label: 'Enrolled Courses', value: stats?.enrolled || 0, color: 'from-primary-600 to-primary-400' },
    { icon: HiAcademicCap, label: 'Completed', value: stats?.completed || 0, color: 'from-green-600 to-green-400' },
    { icon: HiTrendingUp, label: 'In Progress', value: stats?.inProgress || 0, color: 'from-yellow-600 to-yellow-400' },
    { icon: HiCash, label: 'Certificates', value: stats?.certificates || 0, color: 'from-accent-600 to-accent-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-400 mt-1">Here's what's happening with your learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="glass rounded-2xl p-6 hover:border-primary-500/30 transition-all group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon className="text-2xl text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Learning Progress</h3>
          <div className="max-w-xs mx-auto"><Doughnut data={progressData} options={{ plugins: { legend: { labels: { color: '#9ca3af' } } } }} /></div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Courses</h3>
          <div className="space-y-3">
            {stats?.enrolledCourses?.slice(0, 5).map((ec, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-surface/50 rounded-xl">
                <img src={ec.course?.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{ec.course?.title}</p>
                  <div className="w-full bg-surface-lighter rounded-full h-1.5 mt-2">
                    <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${ec.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{ec.progress}%</span>
              </div>
            ))}
            {(!stats?.enrolledCourses || stats.enrolledCourses.length === 0) && <p className="text-gray-400 text-sm text-center py-8">No courses enrolled yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
