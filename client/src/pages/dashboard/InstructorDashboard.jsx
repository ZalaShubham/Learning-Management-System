import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiBookOpen, HiUsers, HiCash, HiStar } from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await adminService.getInstructorDashboard(); setStats(data.stats); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { icon: HiBookOpen, label: 'Total Courses', value: stats?.totalCourses || 0, color: 'from-primary-600 to-primary-400' },
    { icon: HiUsers, label: 'Total Students', value: stats?.totalStudents || 0, color: 'from-blue-600 to-blue-400' },
    { icon: HiCash, label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, color: 'from-green-600 to-green-400' },
    { icon: HiStar, label: 'Avg Rating', value: stats?.avgRating || 0, color: 'from-yellow-600 to-yellow-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Instructor Dashboard 🎓</h1>

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

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">My Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 border-b border-white/10">
              <th className="pb-3 font-medium">Course</th><th className="pb-3 font-medium">Students</th><th className="pb-3 font-medium">Rating</th><th className="pb-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {stats?.courses?.map(course => (
                <tr key={course._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 text-white">{course.title}</td>
                  <td className="py-3 text-gray-300">{course.enrolledStudents?.length}</td>
                  <td className="py-3 text-yellow-400">⭐ {course.ratings?.average?.toFixed(1)}</td>
                  <td className="py-3"><span className={`px-2 py-1 text-xs rounded-full ${course.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{course.isPublished ? 'Published' : 'Draft'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
