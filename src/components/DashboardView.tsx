import React from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  BookmarkCheck, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Library, 
  BookMarked, 
  Layers, 
  ChevronRight,
  Smartphone,
  QrCode,
  Laptop
} from 'lucide-react';
import { Novel, User } from '../types';
import { BookCard } from './BookCard';

interface DashboardViewProps {
  novels: Novel[];
  currentUser: User | null;
  onOpenAddModal: () => void;
  onNavigateToLibrary: () => void;
  onNavigateToSearch: () => void;
  onReadNovel: (novel: Novel) => void;
  onViewDetail: (novel: Novel) => void;
  onEditNovel: (novel: Novel) => void;
  onDeleteNovel: (novel: Novel) => void;
  onSearchSubmit: (query: string) => void;
  onOpenLinkedDevices: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  novels,
  currentUser,
  onOpenAddModal,
  onNavigateToLibrary,
  onNavigateToSearch,
  onReadNovel,
  onViewDetail,
  onEditNovel,
  onDeleteNovel,
  onSearchSubmit,
  onOpenLinkedDevices,
}) => {
  const [quickSearch, setQuickSearch] = React.useState('');

  // Statistics calculation
  const totalCount = novels.length;
  const readingCount = novels.filter((n) => n.readingStatus === 'reading').length;
  const completedCount = novels.filter((n) => n.readingStatus === 'completed').length;
  const notStartedCount = novels.filter((n) => n.readingStatus === 'not_started').length;

  // Find the currently active book to continue reading
  const activeNovel = novels
    .filter((n) => n.readingStatus === 'reading')
    .sort((a, b) => new Date(b.lastReadAt || b.updatedAt).getTime() - new Date(a.lastReadAt || a.updatedAt).getTime())[0] 
    || novels[0];

  // Recent additions (latest 4 novels)
  const recentNovels = [...novels]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      onSearchSubmit(quickSearch.trim());
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-purple-800/30">
        
        {/* Ambient decorative glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 border border-purple-400/30 text-purple-200 mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Perpustakaan Novel Digital Terpadu</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {getGreeting()}, <span className="bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent">{currentUser?.name || 'Budi'}</span>!
          </h1>
          
          <p className="mt-3 text-sm sm:text-base text-purple-100/80 leading-relaxed max-w-2xl">
            Semua koleksi novel digital Anda tersimpan rapi dalam satu tempat. Cari judul, kelola file PDF/EPUB, dan lanjutkan membaca kapan saja tanpa khawatir lupa koleksi Anda.
          </p>

          {/* Quick Search Bar inside Hero */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/70" />
              <input
                type="text"
                placeholder="Cari novel berdasarkan judul, penulis, atau genre..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-purple-400/30 text-white placeholder-purple-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition-all"
              />
            </div>
            <button
              onClick={() => {
                if (quickSearch.trim()) {
                  onSearchSubmit(quickSearch.trim());
                } else {
                  onNavigateToSearch();
                }
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-bold text-sm text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 transition-all flex items-center justify-center gap-2"
            >
              <span>Cari Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4 Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Total Koleksi */}
        <div 
          onClick={onNavigateToLibrary}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-purple-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Novel</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {totalCount}
          </p>
          <p className="text-[11px] sm:text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium flex items-center gap-1">
            <span>Koleksi tersimpan</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Sedang Dibaca */}
        <div 
          onClick={onNavigateToLibrary}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-purple-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sedang Dibaca</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {readingCount}
          </p>
          <p className="text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium flex items-center gap-1">
            <span>Dalam proses baca</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Selesai Dibaca */}
        <div 
          onClick={onNavigateToLibrary}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-purple-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sudah Selesai</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 group-hover:scale-110 transition-transform">
              <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {completedCount}
          </p>
          <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <span>Novel dituntaskan</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Belum Dibaca */}
        <div 
          onClick={onNavigateToLibrary}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-purple-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Belum Dibaca</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 group-hover:scale-110 transition-transform">
              <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {notStartedCount}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
            <span>Daftar antrean</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

      </section>

      {/* WhatsApp-style Cross-Device Sync Feature Card */}
      <section className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-purple-800/40 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 text-purple-300">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Tautkan NOVI ke HP, Laptop & Tablet Anda
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Seperti WA Web
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
                Buka novel di laptop dan lanjutkan membaca dari halaman terakhir di smartphone Anda tanpa repot memindahkan file secara manual.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLinkedDevices}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-900/50 flex items-center gap-2 shrink-0 transform hover:scale-105 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Tautkan Perangkat (Scan QR)</span>
          </button>
        </div>
      </section>

      {/* Featured "Lanjutkan Membaca" Banner */}
      {activeNovel && (
        <section className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 rounded-3xl p-5 sm:p-7 border border-purple-200/80 dark:border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Book Cover */}
            <div 
              onClick={() => onViewDetail(activeNovel)}
              className="relative w-28 sm:w-36 h-40 sm:h-52 rounded-2xl overflow-hidden shadow-xl ring-2 ring-purple-300/60 dark:ring-purple-700/50 shrink-0 cursor-pointer group transform hover:scale-102 transition-transform"
            >
              <img
                src={activeNovel.coverUrl}
                alt={activeNovel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-2.5 bg-black/40" />
            </div>

            {/* Book Info & Action */}
            <div className="flex-1 text-center md:text-left space-y-3 w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white shadow-xs">
                  {activeNovel.readingStatus === 'reading' ? 'Sedang Anda Baca' : 'Rekomendasi Lanjutan'}
                </span>
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                  {activeNovel.genre}
                </span>
                {activeNovel.publicationYear && (
                  <span className="text-xs text-slate-400">
                    ({activeNovel.publicationYear})
                  </span>
                )}
              </div>

              <h2 
                onClick={() => onViewDetail(activeNovel)}
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
              >
                {activeNovel.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Penulis: <span className="font-semibold text-slate-800 dark:text-slate-200">{activeNovel.author}</span>
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl">
                {activeNovel.synopsis}
              </p>

              {/* Progress Tracker */}
              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  <span>Kemajuan: Halaman {activeNovel.currentPage} dari {activeNovel.totalPages || 100}</span>
                  <span className="font-bold text-purple-700 dark:text-purple-400">{activeNovel.readingProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, activeNovel.readingProgress)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => onReadNovel(activeNovel)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/30 transition-all transform hover:scale-102"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Lanjutkan Membaca</span>
                </button>
                <button
                  onClick={() => onViewDetail(activeNovel)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Lihat Detail Buku
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Recent Books Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Koleksi Novel Terbaru</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                {recentNovels.length} buku
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Novel yang baru saja ditambahkan ke dalam perpustakaan pribadi Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Novel</span>
            </button>
            <button
              onClick={onNavigateToLibrary}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {recentNovels.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-purple-200 dark:border-slate-800 p-8 text-center space-y-3">
            <Library className="w-12 h-12 text-purple-300 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Belum ada novel di koleksi</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mulai simpan novel digital Anda dengan menekan tombol Tambah Novel di bawah ini.
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Novel Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentNovels.map((novel) => (
              <BookCard
                key={novel.id}
                novel={novel}
                onRead={onReadNovel}
                onViewDetail={onViewDetail}
                onEdit={onEditNovel}
                onDelete={onDeleteNovel}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
