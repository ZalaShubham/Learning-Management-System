import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiPlay, HiCheck } from 'react-icons/hi';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?.role === 'instructor') {
          const { data } = await courseService.getInstructorCourses();
          setCourses(data.courses);
        } else {
          const { data } = await courseService.getEnrolled();
          setCourses(data.enrolledCourses || []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{user?.role === 'instructor' ? 'My Courses' : 'Enrolled Courses'}</h1>
        {user?.role === 'instructor' && <Link to="/dashboard/create-course" className="btn-primary px-5 py-2 text-sm text-white font-medium rounded-xl">+ Create Course</Link>}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-xl font-semibold text-white mb-2">No courses yet</p>
          <p className="text-gray-400 mb-6">{user?.role === 'instructor' ? 'Create your first course' : 'Browse courses to get started'}</p>
          <Link to={user?.role === 'instructor' ? '/dashboard/create-course' : '/courses'} className="btn-primary px-6 py-2 text-white text-sm font-medium rounded-xl inline-block">
            {user?.role === 'instructor' ? 'Create Course' : 'Browse Courses'}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((item, i) => {
            const course = user?.role === 'instructor' ? item : item.course;
            if (!course) return null;
            return (
              <div key={i} className="glass rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all group">
                <div className="relative h-40 overflow-hidden">
                  <img src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {user?.role !== 'instructor' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-lighter">
                      <div className="h-full bg-primary-500" style={{ width: `${item.progress || 0}%` }} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{course.title}</h3>
                  {user?.role === 'instructor' ? (
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${course.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <Link to={`/courses/${course._id}`} className="text-sm text-primary-400 hover:text-primary-300">Manage →</Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{item.progress || 0}% complete</span>
                      <Link to={`/courses/${course._id}`} className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300">
                        {item.completed ? <><HiCheck /> Completed</> : <><HiPlay /> Continue</>}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
