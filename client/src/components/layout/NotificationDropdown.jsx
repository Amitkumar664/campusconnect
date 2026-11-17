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
        className="relative p-2.5 rounded-xl text-[#9E98AE] hover:text-white hover:bg-white/5 border border-[#262135] bg-[#13111C] transition-all focus:outline-none cursor-pointer shadow-inner"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7C3AED] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(124,58,237,0.7)] animate-pulse">
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
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0D0C15] border border-[#262135] shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-white/10 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-[#262135] flex items-center justify-between bg-[#13111C]">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-semibold text-sm text-white">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C4B5FD] font-mono font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#A78BFA] hover:text-white transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#262135]">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#716B82] flex flex-col items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-[#37304E]" />
                  <span>No notifications right now</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 transition-colors cursor-pointer hover:bg-white/5 flex gap-3 ${
                      !n.isRead ? 'bg-[#7C3AED]/10' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          !n.isRead
                            ? 'bg-[#7C3AED] ring-4 ring-[#7C3AED]/20 shadow-[0_0_8px_rgba(124,58,237,0.7)]'
                            : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#716B82] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-[#9E98AE] line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
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
