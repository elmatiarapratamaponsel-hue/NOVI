import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Settings2, 
  Bookmark, 
  BookmarkCheck, 
  Sun, 
  Moon, 
  FileText, 
  Maximize2, 
  Minimize2,
  CheckCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Novel, ReaderSettings, ReaderTheme } from '../types';

interface ReaderModalProps {
  novel: Novel | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProgress: (novelId: string, currentPage: number, totalPages?: number) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  novel,
  isOpen,
  onClose,
  onSaveProgress,
}) => {
  if (!isOpen || !novel) return null;

  const [currentPage, setCurrentPage] = useState<number>(novel.currentPage || 1);
  const [totalPages, setTotalPages] = useState<number>(novel.totalPages || 250);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewFormat, setViewFormat] = useState<'text' | 'pdf'>(
    novel.fileData && novel.fileType === 'pdf' ? 'pdf' : 'text'
  );

  // Reader Settings State
  const [settings, setSettings] = useState<ReaderSettings>({
    theme: 'dark', // Default to night mode as requested or warm
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 1.8,
  });

  // Sync state when novel opens
  useEffect(() => {
    if (novel) {
      const initialPage = novel.currentPage > 0 ? novel.currentPage : 1;
      setCurrentPage(initialPage);
      setTotalPages(novel.totalPages || 200);
      setIsBookmarked(false);
      setViewFormat(novel.fileData && novel.fileType === 'pdf' ? 'pdf' : 'text');
    }
  }, [novel]);

  // Auto-save progress whenever page changes
  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    onSaveProgress(novel.id, clamped, totalPages);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleMarkAsCompleted = () => {
    setCurrentPage(totalPages);
    onSaveProgress(novel.id, totalPages, totalPages);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Determine theme styles
  const getThemeClass = (theme: ReaderTheme) => {
    switch (theme) {
      case 'light':
        return 'bg-white text-slate-800';
      case 'sepia':
        return 'bg-[#f7efe1] text-[#4a3b2c]';
      case 'navy':
        return 'bg-[#0f172a] text-[#e2e8f0]';
      case 'dark':
      default:
        return 'bg-[#0b0c10] text-[#c5c6c7]';
    }
  };

  const currentChapter = novel.chapters && novel.chapters.length > 0 
    ? novel.chapters[activeChapterIndex] || novel.chapters[0] 
    : null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${getThemeClass(settings.theme)} transition-colors duration-200 select-text`}>
      
      {/* Top Reader Navigation Bar */}
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 shrink-0 backdrop-blur-md bg-opacity-90">
        
        {/* Left: Back button & Novel Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onSaveProgress(novel.id, currentPage, totalPages);
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Simpan dan Kembali ke Perpustakaan"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Koleksi</span>
          </button>

          <div className="border-l border-black/10 dark:border-white/10 pl-3">
            <h2 className="text-sm sm:text-base font-bold line-clamp-1 max-w-[180px] sm:max-w-md">
              {novel.title}
            </h2>
            <p className="text-[11px] opacity-70 line-clamp-1">
              {novel.author} &bull; {novel.genre}
            </p>
          </div>
        </div>

        {/* Right: Format toggle, Bookmark, Settings, Fullscreen, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Toggle PDF/Text view if PDF file attached */}
          {novel.fileData && novel.fileType === 'pdf' && (
            <button
              onClick={() => setViewFormat(viewFormat === 'pdf' ? 'text' : 'pdf')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-purple-500/40 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              {viewFormat === 'pdf' ? 'Mode Teks E-Book' : 'Mode PDF Asli'}
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            title={isBookmarked ? 'Hapus Tanda Buku' : 'Tandai Halaman Ini'}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60'
                : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>

          {/* Settings Toggle */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Pengaturan Tampilan & Tema Baca"
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-80 hover:opacity-100 relative"
          >
            <Settings2 className="w-5 h-5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            className="hidden sm:inline-flex p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Close & Save Button */}
          <button
            onClick={() => {
              onSaveProgress(novel.id, currentPage, totalPages);
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Reader Settings Popover Menu */}
      {isSettingsOpen && (
        <div className="absolute top-16 right-4 sm:right-6 w-80 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Pengaturan Tampilan Pembaca
            </h3>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Tutup
            </button>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold mb-2">Tema Warna Membaca</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setSettings({ ...settings, theme: 'light' })}
                className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 ${
                  settings.theme === 'light'
                    ? 'ring-2 ring-purple-600 border-transparent bg-white text-slate-900 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Terang</span>
              </button>

              <button
                onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 ${
                  settings.theme === 'sepia'
                    ? 'ring-2 ring-purple-600 border-transparent bg-[#f7efe1] text-[#4a3b2c] shadow-xs'
                    : 'bg-[#f7efe1] text-[#4a3b2c] border-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Sepia</span>
              </button>

              <button
                onClick={() => setSettings({ ...settings, theme: 'navy' })}
                className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 ${
                  settings.theme === 'navy'
                    ? 'ring-2 ring-purple-500 border-transparent bg-[#0f172a] text-slate-100 shadow-xs'
                    : 'bg-[#0f172a] text-slate-200 border-slate-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Navy</span>
              </button>

              <button
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
                className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 ${
                  settings.theme === 'dark'
                    ? 'ring-2 ring-purple-500 border-transparent bg-[#0b0c10] text-[#c5c6c7] shadow-xs'
                    : 'bg-[#0b0c10] text-slate-300 border-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-purple-400" />
                <span>Malam</span>
              </button>
            </div>
          </div>

          {/* Font Size Adjuster */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span>Ukuran Teks</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">{settings.fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSettings({ ...settings, fontSize: Math.max(14, settings.fontSize - 2) })}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                A-
              </button>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <button
                onClick={() => setSettings({ ...settings, fontSize: Math.min(26, settings.fontSize + 2) })}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                A+
              </button>
            </div>
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">Gaya Huruf</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSettings({ ...settings, fontFamily: 'serif' })}
                className={`py-2 px-3 rounded-xl text-xs font-serif border ${
                  settings.fontFamily === 'serif'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                Serif (Klasik Buku)
              </button>
              <button
                onClick={() => setSettings({ ...settings, fontFamily: 'sans' })}
                className={`py-2 px-3 rounded-xl text-xs font-sans border ${
                  settings.fontFamily === 'sans'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                Sans-serif (Modern)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Main Reading Viewport */}
      <main className="flex-1 overflow-y-auto relative flex flex-col items-center px-4 sm:px-8 py-6 sm:py-10">
        
        {viewFormat === 'pdf' && novel.fileData ? (
          /* Embedded PDF Viewer */
          <div className="w-full h-full max-w-5xl rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl bg-slate-900">
            <iframe
              src={novel.fileData}
              title={novel.title}
              className="w-full h-[75vh] border-none"
            />
          </div>
        ) : (
          /* Structured E-Book Text Reader */
          <article 
            className={`w-full max-w-2xl mx-auto space-y-6 ${
              settings.fontFamily === 'serif' ? 'font-serif-reading' : 'font-sans-reading'
            }`}
            style={{ 
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
            }}
          >
            {/* Chapter Header */}
            <div className="text-center pb-6 border-b border-black/10 dark:border-white/10 mb-8 space-y-2">
              <span className="text-xs uppercase font-sans tracking-widest opacity-60 font-semibold">
                {novel.title} &bull; Bagian Halaman {currentPage}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentChapter ? currentChapter.title : `Halaman ${currentPage}`}
              </h1>
              {isBookmarked && (
                <div className="inline-flex items-center gap-1 text-xs font-sans text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Halaman ini telah ditandai (Bookmarked)</span>
                </div>
              )}
            </div>

            {/* Reading Content */}
            <div className="space-y-5 text-justify leading-relaxed">
              {currentChapter ? (
                currentChapter.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:mr-1">
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="space-y-4">
                  <p className="first-letter:text-3xl first-letter:font-bold first-letter:mr-1">
                    {novel.synopsis || 'Membuka lembaran cerita novel...'}
                  </p>
                  <p>
                    Anda sedang berada pada halaman <strong>{currentPage}</strong> dari total <strong>{totalPages}</strong> halaman novel <em>{novel.title}</em>.
                  </p>
                  <p>
                    Aplikasi NOVI secara otomatis mencatat dan menyimpan halaman terakhir yang Anda buka. Ketika Anda kembali, Anda dapat langsung melanjutkan membaca tanpa harus mencari posisi halaman lagi.
                  </p>
                </div>
              )}
            </div>

            {/* Chapter Navigation Selector if multiple chapters exist */}
            {novel.chapters && novel.chapters.length > 1 && (
              <div className="pt-8 border-t border-black/10 dark:border-white/10 flex justify-center gap-2">
                {novel.chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      handlePageChange(Math.round(((idx + 1) / novel.chapters!.length) * totalPages));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all ${
                      activeChapterIndex === idx
                        ? 'bg-purple-600 text-white'
                        : 'bg-black/5 dark:bg-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    Bab {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </article>
        )}

      </main>

      {/* Bottom Floating Reading Controller Bar */}
      <footer className="h-18 px-4 sm:px-8 border-t border-black/10 dark:border-white/10 flex flex-col justify-center shrink-0 backdrop-blur-md bg-opacity-95">
        
        {/* Progress Slider & Info */}
        <div className="max-w-2xl mx-auto w-full space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold opacity-80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Halaman {currentPage} dari {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {Math.round((currentPage / totalPages) * 100)}%
              </span>
              {currentPage < totalPages ? (
                <button
                  onClick={handleMarkAsCompleted}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Tandai Selesai</span>
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Selesai Dibaca!
                </span>
              )}
            </div>
          </div>

          {/* Scrubber slider */}
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-1.5 rounded-full"
          />
        </div>

      </footer>

    </div>
  );
};
