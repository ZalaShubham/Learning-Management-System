import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';
import { HiSearch, HiTrash, HiCheck, HiBan } from 'react-icons/hi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({});

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await adminService.getUsers(params);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await adminService.deleteUser(id); toast.success('User deleted'); fetchUsers(); }
    catch (err) { toast.error('Failed to delete user'); }
  };

  const handleApprove = async (id) => {
    try { await adminService.approveInstructor(id); toast.success('Instructor approved'); fetchUsers(); }
    catch (err) { toast.error('Failed to approve'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-white">Manage Users</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-surface-light border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 bg-surface-light border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-primary-500">
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 bg-surface-lighter/50">
                <th className="px-6 py-3 font-medium">User</th><th className="px-6 py-3 font-medium">Email</th><th className="px-6 py-3 font-medium">Role</th><th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div><span className="text-white">{u.name}</span></div></td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-primary-600/20 text-primary-400 capitalize">{u.role}</span></td>
                    <td className="px-6 py-4">
                      {u.role === 'instructor' && !u.isApproved ? <span className="text-yellow-400 text-xs">Pending</span> : <span className="text-green-400 text-xs">Active</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {u.role === 'instructor' && !u.isApproved && <button onClick={() => handleApprove(u._id)} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg"><HiCheck /></button>}
                        <button onClick={() => handleDelete(u._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><HiTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
