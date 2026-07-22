import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService, categoryService } from '../services';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    sort: searchParams.get('sort') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [filters.category, filters.level, filters.sort, filters.page]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.sort) params.sort = filters.sort;
      params.page = filters.page;
      const { data } = await courseService.getAll(params);
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll();
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore <span className="gradient-text">Courses</span></h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Discover courses taught by industry experts. Filter by category, level, or search for specific topics.</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} placeholder="Search courses..." className="w-full pl-12 pr-4 py-3 bg-surface-light border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all" />
            </form>

            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-gray-300">
              <HiFilter /> Filters
            </button>

            <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap gap-3`}>
              <select value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))} className="px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-primary-500">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <select value={filters.level} onChange={(e) => setFilters(f => ({ ...f, level: e.target.value, page: 1 }))} className="px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-primary-500">
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select value={filters.sort} onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))} className="px-4 py-3 bg-surface-light border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-primary-500">
                <option value="">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {loading ? <LoadingSpinner /> : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-semibold text-white mb-2">No courses found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">{pagination.total} courses found</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map(course => <CourseCard key={course._id} course={course} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${filters.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-surface-light text-gray-400 hover:text-white'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
