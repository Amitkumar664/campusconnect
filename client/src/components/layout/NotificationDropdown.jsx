import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markRead(notification._id);
    }
    if (notification.actionUrl) {
      setIsOpen(false);
      navigate(notification.actionUrl);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-all focus:outline-none cursor-pointer shadow-sm"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-semibold text-sm text-slate-900">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#387ED1] font-mono font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#387ED1] hover:text-blue-700 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-slate-300 opacity-60" />
                  <span>No notifications right now</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 flex gap-3 ${
                      !n.isRead ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          !n.isRead
                            ? 'bg-[#FF5722] ring-4 ring-orange-100'
                            : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold ${
                          !n.isRead ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(n.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {n.actionUrl && (
                          <span className="text-[10px] text-[#387ED1] hover:underline flex items-center gap-0.5 font-semibold">
                            View details <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
