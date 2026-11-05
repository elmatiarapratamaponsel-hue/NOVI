import React from 'react';
import { BookOpen, Edit3, Trash2, Calendar, BookmarkCheck, FileText, Sparkles } from 'lucide-react';
import { Novel } from '../types';

interface BookCardProps {
  novel: Novel;
  onRead: (novel: Novel) => void;
  onViewDetail: (novel: Novel) => void;
  onEdit: (novel: Novel) => void;
  onDelete: (novel: Novel) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  novel,
  onRead,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = () => {
    switch (novel.readingStatus) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <BookmarkCheck className="w-3 h-3" />
            Selesai
          </span>
        );
      case 'reading':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <BookOpen className="w-3 h-3" />
            Sedang Dibaca ({novel.readingProgress}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Belum Dibaca
          </span>
        );
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700/60 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Cover Section with realistic spine accent */}
      <div 
        onClick={() => onViewDetail(novel)}
        className="relative h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 cursor-pointer flex items-center justify-center"
      >
        {novel.coverUrl ? (
          <img
            src={novel.coverUrl}
            alt={novel.title}
            onError={(e) => {
              // fallback if image link breaks
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <BookOpen className="w-12 h-12 text-purple-300/60 mb-2" />
            <span className="text-white font-bold text-sm line-clamp-2 px-2">{novel.title}</span>
          </div>
        )}

        {/* Book spine aesthetic gradient overlay */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-3 w-px bg-white/20 pointer-events-none" />

        {/* Subtle dark gradient for readability on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xs">
            {novel.genre}
          </span>
          {novel.fileType && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-400/30">
              {novel.fileType}
            </span>
          )}
        </div>

        {/* Quick Read Floating Button on Cover Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/40 backdrop-blur-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(novel);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-lg shadow-purple-600/40 transform hover:scale-105 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Baca Novel
          </button>
        </div>
      </div>

      {/* Book Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status Badge */}
          <div className="mb-2 flex items-center justify-between">
            {getStatusBadge()}
            {novel.publicationYear && (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {novel.publicationYear}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetail(novel)}
            title={novel.title}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
          >
            {novel.title}
          </h3>

          {/* Author */}
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
            Oleh: <span className="text-purple-700 dark:text-purple-300 font-semibold">{novel.author}</span>
          </p>

          {/* Synopsis preview */}
          {novel.synopsis && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {novel.synopsis}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Kemajuan Membaca</span>
            <span className="font-bold text-purple-700 dark:text-purple-400">
              {novel.currentPage} / {novel.totalPages || 100} hlm ({novel.readingProgress}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, novel.readingProgress || 0)}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 flex items-center gap-1.5 justify-between">
            <button
              onClick={() => onRead(novel)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-xs hover:shadow-purple-600/20 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{novel.currentPage > 0 ? 'Lanjutkan' : 'Mulai Baca'}</span>
            </button>

            <button
              onClick={() => onViewDetail(novel)}
              title="Lihat Detail Lengkap"
              className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Detail
            </button>

            <button
              onClick={() => onEdit(novel)}
              title="Edit Informasi Novel"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(novel)}
              title="Hapus Novel dari Koleksi"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
