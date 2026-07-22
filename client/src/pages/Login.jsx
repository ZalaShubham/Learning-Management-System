import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { HiAcademicCap, HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      toast.success(res.message || 'Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Toaster position="top-right" />
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiAcademicCap className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white">Learn<span className="gradient-text">Hub</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                type="email" className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPassword ? 'text' : 'password'} className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-surface-light text-primary-500 focus:ring-primary-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-900 via-surface to-accent-900/30">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center p-12">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center animate-pulse-glow">
            <HiAcademicCap className="text-5xl text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Start Learning Today</h2>
          <p className="text-gray-300 text-lg max-w-sm mx-auto">Access thousands of courses and unlock your full potential with LearnHub.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
