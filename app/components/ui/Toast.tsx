'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Animasyon bitince unmount et
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !show) return null;

  const bgColors = {
    success: 'bg-[#1d9bf0]', // X Mavisi
    error: 'bg-[#f4212e]',   // X Kırmızısı
    info: 'bg-[#0f1419] dark:bg-white',
  };

  const textColors = {
    success: 'text-white',
    error: 'text-white',
    info: 'text-white dark:text-black',
  };

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

  return (
    <div className={`fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-[transform,opacity] duration-300 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${bgColors[type]} ${textColors[type]}`}>
      <Icon size={20} />
      <span className="font-medium text-sm">{message}</span>
      <button onClick={() => setShow(false)} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}