import { Toast as ToastType } from '../types/api'

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'delete';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded shadow-lg animate-fade-in ${
    type === 'success' ? 'bg-emerald-500' : 
    type === 'delete' ? 'bg-orange-500' : 'bg-red-500'
  } text-white`}>
    {type === 'success' ? (
      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M5 13l4 4L19 7"></path>
      </svg>
    ) : type === 'delete' ? (
      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M19 7l-6 6m0 0l-6 6m6-6l6 6m-6-6l-6-6"></path>
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    )}
    <span>{message}</span>
    <button 
      onClick={onClose}
      className="ml-2 text-white/80 hover:text-white"
    >
      ×
    </button>
  </div>
) 