import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiUsers, HiBookOpen, HiCash, HiAcademicCap, HiUserAdd, HiClipboardCheck } from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await adminService.getDashboard(); setStats(data.stats); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { icon: HiUsers, label: 'Total Students', value: stats?.totalStudents || 0, color: 'from-primary-600 to-primary-400' },
    { icon: HiUserAdd, label: 'Instructors', value: stats?.totalInstructors || 0, color: 'from-blue-600 to-blue-400' },
    { icon: HiBookOpen, label: 'Total Courses', value: stats?.totalCourses || 0, color: 'from-purple-600 to-purple-400' },
    { icon: HiCash, label: 'Revenue', value: `₹${stats?.totalRevenue || 0}`, color: 'from-green-600 to-green-400' },
    { icon: HiAcademicCap, label: 'Certificates', value: stats?.totalCertificates || 0, color: 'from-yellow-600 to-yellow-400' },
    { icon: HiClipboardCheck, label: 'Pending Approvals', value: stats?.pendingInstructors || 0, color: 'from-red-600 to-red-400' },
  ];

  const revenueData = {
    labels: stats?.monthlyPayments?.map(m => m._id) || [],
    datasets: [{
      label: 'Revenue (₹)', data: stats?.monthlyPayments?.map(m => m.revenue) || [],
      fill: true, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: '#6366f1', borderWidth: 2, tension: 0.4, pointBackgroundColor: '#6366f1',
    }],
  };

  const enrollmentData = {
    labels: stats?.monthlyEnrollments?.map(m => m._id) || [],
    datasets: [{
      label: 'Enrollments', data: stats?.monthlyEnrollments?.map(m => m.count) || [],
      backgroundColor: '#818cf8', borderRadius: 8,
    }],
  };

  const chartOptions = { responsive: true, plugins: { legend: { labels: { color: '#9ca3af' } } }, scales: { x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } } } };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard 🛡️</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue</h3>
          {stats?.monthlyPayments?.length > 0 ? <Line data={revenueData} options={chartOptions} /> : <p className="text-gray-400 text-center py-8">No data yet</p>}
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Enrollments</h3>
          {stats?.monthlyEnrollments?.length > 0 ? <Bar data={enrollmentData} options={chartOptions} /> : <p className="text-gray-400 text-center py-8">No data yet</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
