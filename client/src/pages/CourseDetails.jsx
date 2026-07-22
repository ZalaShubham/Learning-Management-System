import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, reviewService, paymentService } from '../services';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { HiStar, HiUsers, HiClock, HiPlay, HiBookOpen, HiCheck, HiLockClosed } from 'react-icons/hi';

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const isEnrolled = user?.enrolledCourses?.some(ec => ec.course === id || ec.course?._id === id);

  useEffect(() => { fetchCourse(); }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await courseService.getOne(id);
      setCourse(data.course);
      setReviews(data.reviews || []);
    } catch { toast.error('Failed to load course'); }
    finally { setLoading(false); }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) return navigate('/login');
    setEnrolling(true);
    try {
      if (course.price > 0) {
        const { data } = await paymentService.createOrder(id);
        const options = {
          key: data.key, amount: data.order.amount, currency: data.order.currency, name: 'LearnHub', description: course.title, order_id: data.order.id,
          handler: async (response) => {
            try {
              await paymentService.verify(response);
              toast.success('Enrolled successfully!');
              navigate('/dashboard/my-courses');
            } catch { toast.error('Payment verification failed'); }
          },
          theme: { color: '#6366f1' },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        await courseService.enroll(id);
        toast.success('Enrolled successfully!');
        navigate('/dashboard/my-courses');
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Enrollment failed'); }
    finally { setEnrolling(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewService.create(id, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchCourse();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
  };

  if (loading) return <div className="min-h-screen bg-surface"><Navbar /><LoadingSpinner /></div>;
  if (!course) return <div className="min-h-screen bg-surface"><Navbar /><p className="text-white text-center pt-32">Course not found</p></div>;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Toaster position="top-right" />

      {/* Hero */}
      <div className="pt-20 bg-gradient-to-b from-primary-900/30 to-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="text-sm text-primary-400 font-medium">{course.category?.name}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">{course.title}</h1>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1"><HiStar className="text-yellow-500" /> {course.ratings?.average?.toFixed(1)} ({course.ratings?.count} reviews)</span>
                <span className="flex items-center gap-1"><HiUsers /> {course.enrolledStudents?.length} students</span>
                <span className="flex items-center gap-1"><HiBookOpen /> {course.lessons?.length} lessons</span>
                <span className="flex items-center gap-1"><HiClock /> {course.duration}</span>
                <span className="capitalize px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full">{course.level}</span>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">{course.instructor?.name?.charAt(0)}</div>
                <div>
                  <p className="text-white font-medium">{course.instructor?.name}</p>
                  <p className="text-xs text-gray-400">Instructor</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="glass rounded-2xl p-6 h-fit">
              <img src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt={course.title} className="w-full h-48 object-cover rounded-xl mb-6" />
              <div className="text-3xl font-bold text-white mb-4">{course.price === 0 ? <span className="text-green-400">Free</span> : `₹${course.price}`}</div>
              {isEnrolled ? (
                <button onClick={() => navigate(`/dashboard/my-courses`)} className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"><HiCheck /> Continue Learning</button>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling} className="w-full btn-primary py-3 text-white font-semibold rounded-xl disabled:opacity-50">
                  {enrolling ? 'Processing...' : course.price > 0 ? 'Buy Now' : 'Enroll Free'}
                </button>
              )}
              <div className="mt-6 space-y-3 text-sm text-gray-400">
                <p className="flex items-center gap-2"><HiPlay /> {course.lessons?.length} video lessons</p>
                <p className="flex items-center gap-2"><HiClock /> Full lifetime access</p>
                <p className="flex items-center gap-2"><HiBookOpen /> Certificate of completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-1 mb-8 bg-surface-light rounded-xl p-1 w-fit">
          {['overview', 'curriculum', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>{tab}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {course.whatYouWillLearn?.length > 0 && (
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">What You'll Learn</h3>
                <div className="grid gap-3">{course.whatYouWillLearn.map((item, i) => <p key={i} className="flex items-start gap-2 text-gray-300 text-sm"><HiCheck className="text-green-400 mt-0.5 shrink-0" /> {item}</p>)}</div>
              </div>
            )}
            {course.requirements?.length > 0 && (
              <div className="glass rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                <ul className="space-y-2">{course.requirements.map((item, i) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-primary-400">•</span>{item}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-3">
            {course.lessons?.map((lesson, i) => (
              <div key={lesson._id} className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center text-sm font-medium">{i + 1}</span>
                  <div>
                    <p className="text-white font-medium">{lesson.title}</p>
                    <p className="text-xs text-gray-400">{lesson.duration}</p>
                  </div>
                </div>
                {lesson.isFreePreview ? <span className="text-xs text-green-400 px-3 py-1 bg-green-500/10 rounded-full">Free Preview</span> : <HiLockClosed className="text-gray-500" />}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {isEnrolled && (
              <form onSubmit={handleReviewSubmit} className="glass rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
                <div className="flex gap-2 mb-4">{[1, 2, 3, 4, 5].map(s => <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))} className={`text-2xl ${s <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-600'}`}>★</button>)}</div>
                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))} rows="3" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 mb-4" placeholder="Share your experience..." />
                <button type="submit" className="btn-primary px-6 py-2 text-white text-sm font-medium rounded-lg">Submit Review</button>
              </form>
            )}
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="glass rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">{review.user?.name?.charAt(0)}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{review.user?.name}</p>
                      <div className="flex gap-0.5">{Array.from({ length: 5 }, (_, i) => <HiStar key={i} className={`text-xs ${i < review.rating ? 'text-yellow-500' : 'text-gray-600'}`} />)}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetails;
