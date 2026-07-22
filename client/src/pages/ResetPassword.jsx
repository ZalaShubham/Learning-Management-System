import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services';
import toast, { Toaster } from 'react-hot-toast';
import { HiAcademicCap } from 'react-icons/hi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await authService.resetPassword(token, { password }); toast.success('Password reset!'); navigate('/login'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4"><Toaster />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"><HiAcademicCap className="text-white text-lg" /></div>
          <span className="text-xl font-bold text-white">Learn<span className="gradient-text">Hub</span></span>
        </Link>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password (min 6 chars)" minLength={6} required className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" />
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-white font-semibold rounded-xl">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
