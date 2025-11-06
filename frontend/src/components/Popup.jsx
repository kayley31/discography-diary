import { useEffect } from 'react';
import './Popup.css';

const Popup = ({ show, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div 
      className="popup-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="popup-close"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
