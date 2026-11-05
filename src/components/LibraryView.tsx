import React, { useState, useMemo } from 'react';
import { 
  Library, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  BookmarkCheck, 
  BookOpen, 
  Clock, 
  Trash2, 
  Edit3,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Novel, ReadingStatus, SortOption } from '../types';
import { GENRE_LIST } from '../data/sampleNovels';
import { BookCard } from './BookCard';

interface LibraryViewProps {
  novels: Novel[];
  onOpenAddModal: () => void;
  onReadNovel: (novel: Novel) => void;
  onViewDetail: (novel: Novel) => void;
  onEditNovel: (novel: Novel) => void;
  onDeleteNovel: (novel: Novel) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  novels,
  onOpenAddModal,
  onReadNovel,
  onViewDetail,
  onEditNovel,
  onDeleteNovel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Semua Genre');
  const [statusFilter, setStatusFilter] = useState<'all' | ReadingStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract all available unique genres dynamically from the user's books + default list
  const availableGenres = useMemo(() => {
    const novelGenres = Array.from(new Set(novels.map((n) => n.genre).filter(Boolean)));
    const merged = Array.from(new Set([...GENRE_LIST, ...novelGenres]));
    return merged;
  }, [novels]);

  // Filter and sort novels
  const filteredNovels = useMemo(() => {
    return novels
      .filter((novel) => {
        // Search filter (Title, Author, or Genre)
        const matchesSearch =
          !searchQuery.trim() ||
          novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          novel.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (novel.synopsis && novel.synopsis.toLowerCase().includes(searchQuery.toLowerCase()));

        // Genre filter
        const matchesGenre =
          selectedGenre === 'Semua Genre' || novel.genre.toLowerCase() === selectedGenre.toLowerCase();

        // Status filter
        const matchesStatus =
          statusFilter === 'all' || novel.readingStatus === statusFilter;

        return matchesSearch && matchesGenre && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'author') {
          return a.author.localeCompare(b.author);
        }
        if (sortBy === 'progress') {
          return b.readingProgress - a.readingProgress;
        }
        if (sortBy === 'year') {
          return (b.publicationYear || 0) - (a.publicationYear || 0);
        }
        // Default 'recent'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [novels, searchQuery, selectedGenre, statusFilter, sortBy]);

  // Counts for tabs
  const countAll = novels.length;
  const countReading = novels.filter((n) => n.readingStatus === 'reading').length;
  const countCompleted = novels.filter((n) => n.readingStatus === 'completed').length;
  const countNotStarted = novels.filter((n) => n.readingStatus === 'not_started').length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Koleksi Novel Saya
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {novels.length} Judul
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola, temukan, dan lanjutkan membaca seluruh novel digital milik Anda.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/30 transition-all transform hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Novel Baru</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        
        {/* Top row: Search input + View switch */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari dalam koleksi berdasarkan judul, penulis, atau genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Genre Dropdown */}
            <div className="relative min-w-[150px]">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full py-2.5 pl-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer"
              >
                {availableGenres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[140px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full py-2.5 pl-3 pr-8 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer"
              >
                <option value="recent">Terbaru Ditambahkan</option>
                <option value="title">Judul (A - Z)</option>
                <option value="author">Penulis (A - Z)</option>
                <option value="progress">Kemajuan Terbanyak</option>
                <option value="year">Tahun Terbit</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Tampilan Kisi (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Tampilan Daftar (List)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
          >
            Semua ({countAll})
          </button>

          <button
            onClick={() => setStatusFilter('reading')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              statusFilter === 'reading'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
          >
            Sedang Dibaca ({countReading})
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            Selesai Dibaca ({countCompleted})
          </button>

          <button
            onClick={() => setStatusFilter('not_started')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              statusFilter === 'not_started'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Belum Dibaca ({countNotStarted})
          </button>

          {(selectedGenre !== 'Semua Genre' || searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedGenre('Semua Genre');
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 underline font-medium ml-auto px-2"
            >
              Hapus Semua Filter
            </button>
          )}
        </div>

      </div>

      {/* Book Grid / List Display */}
      {filteredNovels.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Tidak Ada Novel yang Cocok
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Tidak ditemukan novel dengan kata kunci atau filter yang dipilih. Coba ganti kata pencarian atau tambahkan novel baru ke koleksi.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedGenre('Semua Genre');
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Reset Filter
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30"
            >
              Tambah Novel Baru
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredNovels.map((novel) => (
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
      ) : (
        /* List Mode View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
          {filteredNovels.map((novel) => (
            <div
              key={novel.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors"
            >
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewDetail(novel)}>
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-14 h-20 rounded-xl object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                      {novel.genre}
                    </span>
                    {novel.publicationYear && (
                      <span className="text-[11px] text-slate-400">
                        {novel.publicationYear}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-base line-clamp-1">
                    {novel.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Oleh: <span className="font-medium text-slate-800 dark:text-slate-300">{novel.author}</span>
                  </p>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
                    Progress: {novel.currentPage} / {novel.totalPages || 100} hlm ({novel.readingProgress}%)
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onReadNovel(novel)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Baca</span>
                </button>
                <button
                  onClick={() => onViewDetail(novel)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Detail
                </button>
                <button
                  onClick={() => onEditNovel(novel)}
                  className="p-2 rounded-xl text-slate-600 hover:text-purple-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteNovel(novel)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
