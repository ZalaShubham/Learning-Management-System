import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { courseService, categoryService } from '../../services';
import toast, { Toaster } from 'react-hot-toast';
import { HiUpload } from 'react-icons/hi';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await categoryService.getAll(); setCategories(data.categories); }
      catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('level', data.level);
      formData.append('price', data.price);
      formData.append('duration', data.duration);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags.split(',').map(t => t.trim())));
      if (data.requirements) formData.append('requirements', JSON.stringify(data.requirements.split('\n').filter(Boolean)));
      if (data.whatYouWillLearn) formData.append('whatYouWillLearn', JSON.stringify(data.whatYouWillLearn.split('\n').filter(Boolean)));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      await courseService.create(formData);
      toast.success('Course created successfully!');
      navigate('/dashboard/my-courses');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create course'); }
    finally { setLoading(false); }
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) { setThumbnail(file); setPreview(URL.createObjectURL(file)); }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-white mb-6">Create New Course</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Thumbnail */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Course Thumbnail</h3>
          <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary-500/30 transition-all overflow-hidden">
            {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : (
              <div className="text-center"><HiUpload className="text-3xl text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-400">Click to upload thumbnail</p></div>
            )}
            <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
          </label>
        </div>

        {/* Details */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Course Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input {...register('title', { required: 'Title is required' })} className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" placeholder="e.g., Complete React Developer Course" />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea {...register('description', { required: 'Description is required' })} rows="4" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" placeholder="Detailed course description..." />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select {...register('category', { required: 'Category is required' })} className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-primary-500">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
              <select {...register('level')} className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-primary-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹) *</label>
              <input {...register('price', { required: 'Price is required', min: 0 })} type="number" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" placeholder="0 for free" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input {...register('duration')} className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" placeholder="e.g., 10h 30m" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
            <input {...register('tags')} className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" placeholder="react, javascript, web development" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">What You'll Learn (one per line)</label>
            <textarea {...register('whatYouWillLearn')} rows="3" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" placeholder="Build real-world projects&#10;Master React Hooks&#10;Deploy applications" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Requirements (one per line)</label>
            <textarea {...register('requirements')} rows="3" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" placeholder="Basic HTML/CSS knowledge&#10;A computer with internet" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
