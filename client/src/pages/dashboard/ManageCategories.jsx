import { useState, useEffect } from 'react';
import { categoryService } from '../../services';
import toast, { Toaster } from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '📚' });

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = async () => { try { const { data } = await categoryService.getAll(); setCategories(data.categories); } catch {} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await categoryService.update(editing, form);
      else await categoryService.create(form);
      toast.success(editing ? 'Updated' : 'Created');
      setShowModal(false); setEditing(null); setForm({ name: '', description: '', icon: '📚' }); fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await categoryService.delete(id); toast.success('Deleted'); fetchCategories(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button onClick={() => { setShowModal(true); setEditing(null); setForm({ name: '', description: '', icon: '📚' }); }} className="btn-primary px-5 py-2 text-sm text-white rounded-xl flex items-center gap-2"><HiPlus /> Add</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c._id} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{c.icon}</span>
              <div className="flex gap-2">
                <button onClick={() => { setShowModal(true); setEditing(c._id); setForm({ name: c.name, description: c.description, icon: c.icon }); }} className="p-1.5 text-gray-400 hover:text-white rounded-lg"><HiPencil /></button>
                <button onClick={() => handleDelete(c._id)} className="p-1.5 text-red-400 rounded-lg"><HiTrash /></button>
              </div>
            </div>
            <h3 className="text-white font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{c.description || 'No description'}</p>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface-light border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between mb-6"><h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'Add'} Category</h3><button onClick={() => setShowModal(false)}><HiX className="text-gray-400" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" required />
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" />
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Icon emoji" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" />
              <button type="submit" className="w-full btn-primary py-3 text-white font-semibold rounded-xl">{editing ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
