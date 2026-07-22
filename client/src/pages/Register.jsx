import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { HiAcademicCap, HiEye, HiEyeOff } from 'react-icons/hi';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Toaster position="top-right" />
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-accent-900/30 via-surface to-primary-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center p-12">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center animate-pulse-glow">
            <HiAcademicCap className="text-5xl text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Join LearnHub</h2>
          <p className="text-gray-300 text-lg max-w-sm mx-auto">Create your account and start your learning journey with world-class courses.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiAcademicCap className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white">Learn<span className="gradient-text">Hub</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-gray-400 mb-8">Fill in your details to get started</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input {...register('name', { required: 'Name is required' })} className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" placeholder="John Doe" />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} type={showPassword ? 'text' : 'password'} className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {['student', 'instructor'].map((r) => (
                  <label key={r} className="relative">
                    <input {...register('role')} type="radio" value={r} defaultChecked={r === 'student'} className="peer hidden" />
                    <div className="px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-center cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-600/10 transition-all">
                      <span className="text-sm font-medium text-gray-300 peer-checked:text-primary-400 capitalize">{r === 'student' ? '📚 Learn' : '🎓 Teach'}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 mt-6">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
