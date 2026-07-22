import { useState, useEffect } from 'react';
import { paymentService } from '../../services';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await paymentService.getHistory(); setPayments(data.payments); }
      catch {} finally { setLoading(false); }
    }; fetch();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Payment History</h1>
      {payments.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center"><p className="text-gray-400">No payment history</p></div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 bg-surface-lighter/50">
              <th className="px-6 py-3">Course</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Date</th>
            </tr></thead>
            <tbody>{payments.map(p => (
              <tr key={p._id} className="border-t border-white/5">
                <td className="px-6 py-4 text-white">{p.course?.title}</td>
                <td className="px-6 py-4 text-white">₹{p.amount}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${p.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.status}</span></td>
                <td className="px-6 py-4 text-gray-400">{format(new Date(p.createdAt), 'PPp')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
