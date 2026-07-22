import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { HiCamera } from 'react-icons/hi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (avatar) formData.append('avatar', avatar);
      const { data } = await authService.updateProfile(formData);
      updateUser(data.user); toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try { await authService.changePassword(passwordForm); toast.success('Password changed!'); setPasswordForm({ currentPassword: '', newPassword: '' }); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto pt-24 px-4 pb-16">
        <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>
        <form onSubmit={handleUpdate} className="glass rounded-2xl p-8 mb-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {user?.avatar?.url ? <img src={user.avatar.url} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
              </div>
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer">
                <HiCamera className="text-white text-xs" />
                <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} className="hidden" />
              </label>
            </div>
            <div><p className="text-white font-medium">{user?.name}</p><p className="text-sm text-gray-400">{user?.email}</p></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-300 mb-2">Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" /></div>
            <div><label className="block text-sm text-gray-300 mb-2">Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" /></div>
          </div>
          <div><label className="block text-sm text-gray-300 mb-2">Bio</label><textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows="3" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" /></div>
          <button type="submit" disabled={loading} className="btn-primary px-8 py-2.5 text-white text-sm font-medium rounded-xl">{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>

        <form onSubmit={handlePasswordChange} className="glass rounded-2xl p-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
          <input value={passwordForm.currentPassword} onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))} type="password" placeholder="Current password" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" required />
          <input value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} type="password" placeholder="New password" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" required />
          <button type="submit" className="px-8 py-2.5 bg-surface-lighter text-white text-sm font-medium rounded-xl hover:bg-surface-lighter/80">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
