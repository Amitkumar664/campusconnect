import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-campus-textMuted hover:text-campus-text hover:bg-white/5 border border-campus-border transition-all focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-campus-amber text-[10px] font-bold text-campus-bg shadow-glow-amber animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-campus-card border border-campus-border shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
          <div className="p-4 border-b border-campus-border flex items-center justify-between bg-campus-surface/70">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-semibold text-sm text-campus-text">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-campus-primary/10 text-campus-primary font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-campus-primary hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-campus-border/50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-campus-textMuted">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-white/5 flex gap-3 ${
                    !n.isRead ? 'bg-campus-primary/5' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        !n.isRead ? 'bg-campus-amber ring-4 ring-campus-amber/20' : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        !n.isRead ? 'text-campus-text' : 'text-campus-textMuted'
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs text-campus-textMuted mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-campus-textSubtle flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {n.actionUrl && (
                        <span className="text-[10px] text-campus-primary flex items-center gap-0.5 font-medium">
                          View details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

