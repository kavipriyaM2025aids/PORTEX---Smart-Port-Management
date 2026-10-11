import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sp-anim-fade">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1e0d24]/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Dialog container */}
      <div className={`relative w-full ${maxWidth} rounded-2xl bg-white/95 backdrop-blur-md border border-pink-200/80 shadow-2xl shadow-pink-900/20 z-10 overflow-hidden flex flex-col max-h-[90vh]`}>
        {/* Top accent hairline */}
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 bg-[#fdf8fa]">
          <h3 className="text-base font-bold text-slate-800 tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;