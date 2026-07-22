import { useState, useEffect } from 'react';
import { notificationService } from '../services';
import Navbar from '../components/Navbar';
import { HiBell, HiCheck, HiTrash } from 'react-icons/hi';
import { format } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => { fetch(); }, []);
  const fetch = async () => {
    try { const { data } = await notificationService.getAll(); setNotifications(data.notifications); setUnread(data.unreadCount); } catch {}
  };
  const markRead = async (id) => { await notificationService.markRead(id); fetch(); };
  const markAllRead = async () => { await notificationService.markAllRead(); fetch(); };
  const remove = async (id) => { await notificationService.delete(id); fetch(); };

  const typeColors = { enrollment: 'text-blue-400', assignment: 'text-yellow-400', quiz: 'text-purple-400', announcement: 'text-green-400', payment: 'text-emerald-400', certificate: 'text-amber-400', general: 'text-gray-400' };

  return (
    <div className="min-h-screen bg-surface"><Navbar />
      <div className="max-w-3xl mx-auto pt-24 px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-white">Notifications</h1>{unread > 0 && <p className="text-sm text-gray-400 mt-1">{unread} unread</p>}</div>
          {unread > 0 && <button onClick={markAllRead} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"><HiCheck /> Mark all read</button>}
        </div>
        <div className="space-y-3">
          {notifications.length === 0 ? <div className="glass rounded-2xl p-12 text-center"><HiBell className="text-4xl text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No notifications</p></div> : notifications.map(n => (
            <div key={n._id} className={`glass rounded-xl p-4 flex items-start gap-4 ${!n.read ? 'border-l-2 border-primary-500' : ''}`}>
              <div className={`w-10 h-10 rounded-full bg-surface-lighter flex items-center justify-center ${typeColors[n.type] || ''}`}><HiBell /></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{n.title}</p>
                <p className="text-gray-400 text-xs mt-1">{n.message}</p>
                <p className="text-gray-500 text-xs mt-2">{format(new Date(n.createdAt), 'PPp')}</p>
              </div>
              <div className="flex gap-1">
                {!n.read && <button onClick={() => markRead(n._id)} className="p-1.5 text-gray-400 hover:text-white rounded"><HiCheck /></button>}
                <button onClick={() => remove(n._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><HiTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
