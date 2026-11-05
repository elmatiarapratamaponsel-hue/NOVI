import React from 'react';
import { 
  X, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Calendar, 
  BookmarkCheck, 
  Clock, 
  FileText, 
  Share2, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Novel } from '../types';

interface NovelDetailModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onRead: (novel: Novel) => void;
  onEdit: (novel: Novel) => void;
  onDelete: (novel: Novel) => void;
}

export const NovelDetailModal: React.FC<NovelDetailModalProps> = ({
  novel,
  isOpen,
  onClose,
  onRead,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !novel) return null;

  const getStatusText = () => {
    switch (novel.readingStatus) {
      case 'completed':
        return {
          label: 'Sudah Selesai Dibaca',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300',
        };
      case 'reading':
        return {
          label: `Sedang Dibaca (${novel.readingProgress}%)`,
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300',
        };
      default:
        return {
          label: 'Belum Mulai Dibaca',
          color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
        };
    }
  };

  const statusInfo = getStatusText();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header with Backdrop Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950">
          <img
            src={novel.coverUrl}
            alt=""
            className="w-full h-full object-cover blur-md opacity-35 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Modal Content */}
        <div className="px-6 pb-6 -mt-20 relative z-10 space-y-6">
          
          {/* Main Book Presentation Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Book Cover */}
            <div className="relative w-32 sm:w-36 h-48 sm:h-52 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white dark:ring-slate-800 shrink-0 bg-slate-900">
              <img
                src={novel.coverUrl}
                alt={novel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-2.5 bg-black/40" />
            </div>

            {/* Title, Author, Badges */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {novel.genre}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {novel.title}
              </h2>

              <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400">
                Karya: <span className="text-purple-700 dark:text-purple-400 font-bold">{novel.author}</span>
              </p>

              {novel.publicationYear && (
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tahun Publikasi: {novel.publicationYear}</span>
                </p>
              )}
            </div>
          </div>

          {/* Reading Progress Bar Section */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Posisi Membaca Terakhir</span>
              </span>
              <span className="font-bold text-purple-700 dark:text-purple-400 text-sm">
                Halaman {novel.currentPage} dari {novel.totalPages || 100} ({novel.readingProgress}%)
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, novel.readingProgress || 0)}%` }}
              />
            </div>
            
            {novel.lastReadAt && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                Terakhir dibaca: {new Date(novel.lastReadAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sinopsis Novel
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {novel.synopsis || 'Belum ada sinopsis untuk novel ini.'}
            </p>
          </div>

          {/* File Information */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Format File</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mt-0.5">
                {novel.fileType || 'PDF'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ukuran File</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {novel.fileSize || '2.1 MB'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama Dokumen</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={novel.fileName}>
                {novel.fileName || 'novel.pdf'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(novel);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onDelete(novel);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Novel</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Tutup
              </button>

              <button
                onClick={() => {
                  onClose();
                  onRead(novel);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/30 transform hover:scale-102 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{novel.currentPage > 0 ? 'Lanjutkan Membaca' : 'Mulai Membaca'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
