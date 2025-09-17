import React from 'react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration?: number;
}

export function Toast({ 
  id,
  type,
  message,
  onClose,
  position = 'top-right',
  duration = 4000
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose, id]);

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      default: return 'top-4 right-4';
    }
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-600', text: 'text-white', icon: 'text-green-100' };
      case 'error':
        return { bg: 'bg-red-600', text: 'text-white', icon: 'text-red-100' };
      case 'warning':
        return { bg: 'bg-yellow-600', text: 'text-white', icon: 'text-yellow-100' };
      default:
        return { bg: 'bg-blue-600', text: 'text-white', icon: 'text-blue-100' };
    }
  };

  const styles = getToastStyles();

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed ${getPositionStyles()} z-50 max-w-sm
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
    `}>
      <div className={`
        ${styles.bg} ${styles.text}
        rounded-lg shadow-lg p-4
        border border-white border-opacity-20
      `}>
        <div className="flex items-start gap-3">
          <div className="flex-1 text-sm font-medium">
            {message}
          </div>
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-1 rounded-md
              ${styles.icon} hover:bg-white hover:bg-opacity-20
              transition-colors duration-150
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}