import { useState, useEffect } from 'react';
import { certificateService } from '../../services';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiDownload, HiAcademicCap } from 'react-icons/hi';
import { format } from 'date-fns';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await certificateService.getMy(); setCertificates(data.certificates); }
      catch {} finally { setLoading(false); }
    }; fetch();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">My Certificates</h1>
      {certificates.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center"><HiAcademicCap className="text-5xl text-gray-600 mx-auto mb-4" /><p className="text-gray-400">Complete courses to earn certificates</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div key={cert._id} className="glass rounded-2xl p-6 hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center"><HiAcademicCap className="text-2xl text-white" /></div>
                <span className="text-xs text-gray-400">{cert.certificateId}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">{cert.course?.title}</h3>
              <p className="text-sm text-gray-400">Instructor: {cert.course?.instructor?.name}</p>
              <p className="text-xs text-gray-500 mt-2">Issued: {format(new Date(cert.issuedAt), 'PPP')}</p>
              <button className="mt-4 flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"><HiDownload /> Download</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
