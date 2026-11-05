import React from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Library, 
  Home, 
  Moon, 
  Sun, 
  User as UserIcon, 
  LogOut, 
  Database,
  Menu,
  X,
  Smartphone
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'library' | 'search';
  setCurrentTab: (tab: 'dashboard' | 'library' | 'search') => void;
  onOpenAddModal: () => void;
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenFirebaseGuide: () => void;
  onOpenLinkedDevices: () => void;
  linkedDevicesCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  totalNovelsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddModal,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenFirebaseGuide,
  onOpenLinkedDevices,
  linkedDevicesCount,
  isDarkMode,
  toggleDarkMode,
  totalNovelsCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-purple-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/25 ring-2 ring-purple-300 dark:ring-purple-900/40 transform hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-600 dark:from-purple-300 dark:via-purple-200 dark:to-indigo-300 bg-clip-text text-transparent">
                  NOVI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800">
                  Perpustakaan Digital
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                Semua Novel, Satu Tempat.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setCurrentTab('library')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                currentTab === 'library'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Koleksi Saya</span>
              {totalNovelsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-purple-600 text-white leading-none">
                  {totalNovelsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('search')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'search'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Cari Novel</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Linked Devices Button (WA Style) */}
            <button
              onClick={onOpenLinkedDevices}
              title="Perangkat Tertaut (Buka NOVI di HP/Laptop)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200/60 dark:border-purple-800/60 transition-all"
            >
              <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden lg:inline">Perangkat</span>
              {linkedDevicesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-purple-600 text-white">
                  {linkedDevicesCount}
                </span>
              )}
            </button>

            {/* Quick Add Novel Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/20 hover:shadow-purple-600/35 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Novel</span>
              <span className="sm:hidden">Tambah</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Malam'}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-700" />}
            </button>

            {/* User Profile / Auth */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 bg-white dark:bg-slate-900 transition-all text-left"
                  >
                    <img
                      src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-purple-400/40"
                    />
                    <div className="hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-purple-600 dark:text-purple-400 leading-tight">
                        Kolektor
                      </p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-purple-100 dark:border-slate-800 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-400">Masuk sebagai:</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {currentUser.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              onOpenLinkedDevices();
                            }}
                            className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                          >
                            <div className="flex items-center gap-2.5">
                              <Smartphone className="w-4 h-4 text-purple-600" />
                              <span>Perangkat Tertaut (HP / PC)</span>
                            </div>
                            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 text-[10px] font-bold">
                              {linkedDevicesCount}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              onOpenFirebaseGuide();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                          >
                            <Database className="w-4 h-4 text-purple-600" />
                            <span>Status Database & Cloud</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              onOpenAuthModal();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                          >
                            <UserIcon className="w-4 h-4 text-indigo-600" />
                            <span>Ganti Pengguna / Akun</span>
                          </button>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Keluar (Logout)</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                >
                  Masuk / Daftar
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              setCurrentTab('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              currentTab === 'dashboard'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('library');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
              currentTab === 'library'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Library className="w-5 h-5" />
              <span>Koleksi Saya</span>
            </div>
            {totalNovelsCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-600 text-white">
                {totalNovelsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentTab('search');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              currentTab === 'search'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Cari Novel</span>
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenLinkedDevices();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>Perangkat Tertaut (HP / Laptop)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                {linkedDevicesCount}
              </span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenFirebaseGuide();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Database className="w-4 h-4 text-purple-600" />
              <span>Info Database & Konfigurasi Firebase</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
