import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Contact = () => {
  const handleSubmit = (e) => { e.preventDefault(); toast.success('Message sent! We\'ll get back to you soon.'); e.target.reset(); };

  return (
    <div className="min-h-screen bg-surface"><Navbar /><Toaster position="top-right" />
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in <span className="gradient-text">Touch</span></h1>
          <p className="text-gray-400 text-lg">Have a question? We'd love to hear from you.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[{ icon: HiMail, title: 'Email', info: 'support@learnhub.com' }, { icon: HiPhone, title: 'Phone', info: '+91 98765 43210' }, { icon: HiLocationMarker, title: 'Location', info: 'Bangalore, India' }].map((c, i) => (
              <div key={i} className="glass rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center"><c.icon className="text-xl text-primary-400" /></div>
                <div><p className="text-white font-medium">{c.title}</p><p className="text-sm text-gray-400">{c.info}</p></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="Your Name" required className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
                <input type="email" placeholder="Your Email" required className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
              </div>
              <input placeholder="Subject" className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
              <textarea rows="5" placeholder="Your Message" required className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
              <button type="submit" className="btn-primary px-8 py-3 text-white font-semibold rounded-xl">Send Message</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
