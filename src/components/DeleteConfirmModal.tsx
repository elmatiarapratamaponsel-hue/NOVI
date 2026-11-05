import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Novel } from '../types';

interface DeleteConfirmModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (novelId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  novel,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !novel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/40 p-6 space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Hapus Novel dari Koleksi?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Apakah Anda yakin ingin menghapus novel <strong className="text-slate-800 dark:text-slate-200">"{novel.title}"</strong> karya {novel.author}? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Batalkan
          </button>
          
          <button
            onClick={() => {
              onConfirm(novel.id);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all"
          >
            Hapus Novel
          </button>
        </div>

      </div>
    </div>
  );
};
