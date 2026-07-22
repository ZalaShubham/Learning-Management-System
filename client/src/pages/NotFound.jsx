import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

const NotFound = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
      <p className="text-2xl font-semibold text-white mb-2">Page Not Found</p>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary px-8 py-3 text-white font-semibold rounded-xl inline-flex items-center gap-2"><HiHome /> Go Home</Link>
    </div>
  </div>
);

export default NotFound;
