import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Filter, Sparkles, BookMarked, Layers } from 'lucide-react';
import { Novel } from '../types';
import { BookCard } from './BookCard';
import { GENRE_LIST } from '../data/sampleNovels';

interface SearchViewProps {
  novels: Novel[];
  initialQuery?: string;
  onReadNovel: (novel: Novel) => void;
  onViewDetail: (novel: Novel) => void;
  onEditNovel: (novel: Novel) => void;
  onDeleteNovel: (novel: Novel) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  novels,
  initialQuery = '',
  onReadNovel,
  onViewDetail,
  onEditNovel,
  onDeleteNovel,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState<string>('Semua');

  // Real-time automatic search across Title, Author, Genre, and Synopsis
  const searchResults = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return novels.filter((novel) => {
      const matchText =
        !q ||
        novel.title.toLowerCase().includes(q) ||
        novel.author.toLowerCase().includes(q) ||
        novel.genre.toLowerCase().includes(q) ||
        (novel.synopsis && novel.synopsis.toLowerCase().includes(q));

      const matchGenre =
        activeGenre === 'Semua' || novel.genre.toLowerCase() === activeGenre.toLowerCase();

      return matchText && matchGenre;
    });
  }, [novels, searchTerm, activeGenre]);

  const allGenres = useMemo(() => {
    const fromNovels = Array.from(new Set(novels.map((n) => n.genre).filter(Boolean)));
    return ['Semua', ...fromNovels];
  }, [novels]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pencarian Cepat & Akurat</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          Temukan Novel Digital Anda
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Ketik judul, nama penulis, atau genre. Hasil pencarian akan muncul otomatis dalam hitungan milidetik.
        </p>

        {/* Big Search Input */}
        <div className="relative mt-6 shadow-lg shadow-purple-500/5 rounded-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari novel (contoh: Laskar Pelangi, Andrea Hirata, Fantasi)..."
            className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800/80 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20 transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Genre Quick Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeGenre === genre
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
        <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
          {searchTerm ? (
            <span>
              Menampilkan <span className="text-purple-600 dark:text-purple-400 font-bold">{searchResults.length}</span> hasil pencarian untuk "{searchTerm}"
            </span>
          ) : (
            <span>
              Menampilkan seluruh koleksi (<span className="text-purple-600 dark:text-purple-400 font-bold">{searchResults.length}</span> novel)
            </span>
          )}
        </div>
        {activeGenre !== 'Semua' && (
          <span className="text-xs text-slate-500">
            Kategori: <span className="font-bold text-slate-700 dark:text-slate-300">{activeGenre}</span>
          </span>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Tidak Ditemukan Novel yang Cocok
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Coba periksa ejaan judul, nama penulis, atau pilih kategori genre lainnya.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveGenre('Semua');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100"
          >
            Bersihkan Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {searchResults.map((novel) => (
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

    </div>
  );
};
