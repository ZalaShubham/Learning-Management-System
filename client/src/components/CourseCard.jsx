import { Link } from 'react-router-dom';
import { HiStar, HiUsers, HiClock, HiBookOpen } from 'react-icons/hi';

const CourseCard = ({ course }) => {
  const { _id, title, thumbnail, instructor, category, price, ratings, enrolledStudents, level, duration } = course;

  return (
    <Link to={`/courses/${_id}`} className="group block bg-surface-light rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img src={thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-light/80 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-medium bg-primary-600/80 text-white rounded-full backdrop-blur-sm capitalize">
            {level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-medium bg-black/50 text-white rounded-full backdrop-blur-sm">
            {category?.name || 'General'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">{title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
            {instructor?.name?.charAt(0) || 'I'}
          </div>
          <span className="text-sm text-gray-400">{instructor?.name || 'Instructor'}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><HiStar className="text-yellow-500" /> {ratings?.average?.toFixed(1) || '0.0'}</span>
          <span className="flex items-center gap-1"><HiUsers /> {enrolledStudents?.length || 0}</span>
          <span className="flex items-center gap-1"><HiClock /> {duration || 'Self-paced'}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-2xl font-bold text-white">
            {price === 0 ? <span className="text-green-400 text-lg">Free</span> : `₹${price}`}
          </span>
          <span className="px-4 py-1.5 text-xs font-medium text-primary-400 bg-primary-600/10 rounded-full group-hover:bg-primary-600 group-hover:text-white transition-all">
            View Course
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
