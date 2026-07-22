import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services';
import toast, { Toaster } from 'react-hot-toast';
import { HiAcademicCap } from 'react-icons/hi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await authService.forgotPassword({ email }); setSent(true); toast.success('Reset email sent!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"><HiAcademicCap className="text-white text-lg" /></div>
          <span className="text-xl font-bold text-white">Learn<span className="gradient-text">Hub</span></span>
        </Link>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-gray-400 mb-6 text-sm">Enter your email to receive a password reset link.</p>
          {sent ? (
            <div className="text-center py-4"><p className="text-green-400 mb-4">✅ Reset email sent! Check your inbox.</p><Link to="/login" className="text-primary-400 text-sm">Back to Login</Link></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-white font-semibold rounded-xl">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-gray-400"><Link to="/login" className="text-primary-400">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
