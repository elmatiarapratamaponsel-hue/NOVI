import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LibraryView } from './components/LibraryView';
import { SearchView } from './components/SearchView';
import { AddEditNovelModal } from './components/AddEditNovelModal';
import { NovelDetailModal } from './components/NovelDetailModal';
import { ReaderModal } from './components/ReaderModal';
import { AuthModal } from './components/AuthModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { LinkedDevicesModal } from './components/LinkedDevicesModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { StorageService } from './services/storage';
import { DeviceSyncService } from './services/deviceSync';
import { Novel, User } from './types';

export default function App() {
  // Initialize storage once on mount
  useEffect(() => {
    StorageService.initialize();
  }, []);

  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [novels, setNovels] = useState<Novel[]>([]);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'library' | 'search'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [selectedDetailNovel, setSelectedDetailNovel] = useState<Novel | null>(null);
  const [activeReadingNovel, setActiveReadingNovel] = useState<Novel | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [deletingNovel, setDeletingNovel] = useState<Novel | null>(null);
  const [isFirebaseGuideOpen, setIsFirebaseGuideOpen] = useState(false);
  const [isLinkedDevicesOpen, setIsLinkedDevicesOpen] = useState(false);
  const [linkedDevicesCount, setLinkedDevicesCount] = useState<number>(() => {
    return DeviceSyncService.getLinkedDevices().length;
  });

  // Listen to cross-device sync broadcasts
  useEffect(() => {
    const unsubscribe = DeviceSyncService.onSyncEvent((data) => {
      if (data.action === 'library_updated') {
        loadNovels();
        addToast('Koleksi diperbarui dari perangkat lain secara otomatis!', 'info');
      } else if (data.action === 'device_linked' || data.action === 'device_unlinked') {
        setLinkedDevicesCount(DeviceSyncService.getLinkedDevices().length);
      }
    });
    return unsubscribe;
  }, []);

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Load user novels whenever currentUser changes
  const loadNovels = () => {
    if (currentUser) {
      const userNovels = StorageService.getUserNovels(currentUser.id);
      setNovels(userNovels);
    } else {
      setNovels([]);
    }
  };

  useEffect(() => {
    loadNovels();
  }, [currentUser]);

  // Handler: Add or Edit Novel
  const handleSaveNovel = (novelData: Partial<Novel>) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      if (editingNovel) {
        // Update existing
        const updated = StorageService.updateNovel(editingNovel.id, novelData);
        if (updated) {
          addToast(`Novel "${updated.title}" berhasil diperbarui!`, 'success');
          loadNovels();
          // Update selected detail modal if open
          if (selectedDetailNovel?.id === updated.id) {
            setSelectedDetailNovel(updated);
          }
        }
      } else {
        // Add new
        const created = StorageService.addNovel({
          userId: currentUser.id,
          title: novelData.title || 'Novel Tanpa Judul',
          author: novelData.author || 'Anonim',
          genre: novelData.genre || 'Drama',
          publicationYear: novelData.publicationYear || new Date().getFullYear(),
          synopsis: novelData.synopsis || '',
          coverUrl: novelData.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          fileType: novelData.fileType || 'pdf',
          fileName: novelData.fileName || 'novel.pdf',
          fileSize: novelData.fileSize || '1.8 MB',
          fileData: novelData.fileData,
          totalPages: novelData.totalPages || 200,
          currentPage: 0,
          readingStatus: novelData.readingStatus || 'not_started',
          readingProgress: 0,
          chapters: novelData.chapters,
        });
        addToast(`Novel "${created.title}" berhasil ditambahkan ke koleksi!`, 'success');
        loadNovels();
      }

      setIsAddModalOpen(false);
      setEditingNovel(null);
    } catch (e) {
      addToast('Terjadi kesalahan saat menyimpan novel.', 'error');
    }
  };

  // Handler: Delete Novel
  const handleDeleteNovelConfirm = (novelId: string) => {
    const success = StorageService.deleteNovel(novelId);
    if (success) {
      addToast('Novel berhasil dihapus dari perpustakaan.', 'info');
      loadNovels();
      if (selectedDetailNovel?.id === novelId) {
        setSelectedDetailNovel(null);
      }
    } else {
      addToast('Gagal menghapus novel.', 'error');
    }
  };

  // Handler: Reading Progress Auto-save
  const handleSaveProgress = (novelId: string, currentPage: number, totalPages?: number) => {
    const updated = StorageService.updateReadingProgress(novelId, currentPage, totalPages);
    if (updated) {
      // Update in local state
      setNovels((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      if (activeReadingNovel?.id === updated.id) {
        setActiveReadingNovel(updated);
      }
      if (selectedDetailNovel?.id === updated.id) {
        setSelectedDetailNovel(updated);
      }
    }
  };

  // Auth handlers
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    addToast(`Selamat datang, ${user.name}!`, 'success');
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    addToast('Anda telah keluar dari akun.', 'info');
  };

  const handleResetDemoData = () => {
    if (currentUser) {
      StorageService.resetSampleData(currentUser.id);
      loadNovels();
      addToast('Koleksi contoh untuk Budi berhasil dipulihkan!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={() => {
          setEditingNovel(null);
          setIsAddModalOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenFirebaseGuide={() => setIsFirebaseGuideOpen(true)}
        onOpenLinkedDevices={() => setIsLinkedDevicesOpen(true)}
        linkedDevicesCount={linkedDevicesCount}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        totalNovelsCount={novels.length}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {currentTab === 'dashboard' && (
          <DashboardView
            novels={novels}
            currentUser={currentUser}
            onOpenAddModal={() => {
              setEditingNovel(null);
              setIsAddModalOpen(true);
            }}
            onNavigateToLibrary={() => setCurrentTab('library')}
            onNavigateToSearch={() => setCurrentTab('search')}
            onReadNovel={(novel) => setActiveReadingNovel(novel)}
            onViewDetail={(novel) => setSelectedDetailNovel(novel)}
            onEditNovel={(novel) => {
              setEditingNovel(novel);
              setIsAddModalOpen(true);
            }}
            onDeleteNovel={(novel) => setDeletingNovel(novel)}
            onSearchSubmit={(query) => {
              setSearchQuery(query);
              setCurrentTab('search');
            }}
            onOpenLinkedDevices={() => setIsLinkedDevicesOpen(true)}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView
            novels={novels}
            onOpenAddModal={() => {
              setEditingNovel(null);
              setIsAddModalOpen(true);
            }}
            onReadNovel={(novel) => setActiveReadingNovel(novel)}
            onViewDetail={(novel) => setSelectedDetailNovel(novel)}
            onEditNovel={(novel) => {
              setEditingNovel(novel);
              setIsAddModalOpen(true);
            }}
            onDeleteNovel={(novel) => setDeletingNovel(novel)}
          />
        )}

        {currentTab === 'search' && (
          <SearchView
            novels={novels}
            initialQuery={searchQuery}
            onReadNovel={(novel) => setActiveReadingNovel(novel)}
            onViewDetail={(novel) => setSelectedDetailNovel(novel)}
            onEditNovel={(novel) => {
              setEditingNovel(novel);
              setIsAddModalOpen(true);
            }}
            onDeleteNovel={(novel) => setDeletingNovel(novel)}
          />
        )}

      </main>

      {/* Modals */}
      <AddEditNovelModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingNovel(null);
        }}
        onSave={handleSaveNovel}
        initialNovel={editingNovel}
      />

      <NovelDetailModal
        novel={selectedDetailNovel}
        isOpen={!!selectedDetailNovel}
        onClose={() => setSelectedDetailNovel(null)}
        onRead={(novel) => {
          setSelectedDetailNovel(null);
          setActiveReadingNovel(novel);
        }}
        onEdit={(novel) => {
          setSelectedDetailNovel(null);
          setEditingNovel(novel);
          setIsAddModalOpen(true);
        }}
        onDelete={(novel) => {
          setSelectedDetailNovel(null);
          setDeletingNovel(novel);
        }}
      />

      <ReaderModal
        novel={activeReadingNovel}
        isOpen={!!activeReadingNovel}
        onClose={() => setActiveReadingNovel(null)}
        onSaveProgress={handleSaveProgress}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <DeleteConfirmModal
        novel={deletingNovel}
        isOpen={!!deletingNovel}
        onClose={() => setDeletingNovel(null)}
        onConfirm={handleDeleteNovelConfirm}
      />

      <FirebaseGuideModal
        isOpen={isFirebaseGuideOpen}
        onClose={() => setIsFirebaseGuideOpen(false)}
        onResetDemoData={handleResetDemoData}
      />

      <LinkedDevicesModal
        isOpen={isLinkedDevicesOpen}
        onClose={() => setIsLinkedDevicesOpen(false)}
        currentUser={currentUser}
        onNotify={(msg, type) => addToast(msg, type || 'info')}
        onLibrarySyncSuccess={() => {
          loadNovels();
          setLinkedDevicesCount(DeviceSyncService.getLinkedDevices().length);
        }}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer className="border-t border-purple-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-purple-700 dark:text-purple-400">NOVI</span>
            <span>&bull;</span>
            <span>Semua Novel, Satu Tempat.</span>
          </div>
          <p>
            Dibuat untuk memudahkan penikmat novel digital mengelola dan membaca koleksi kesayangan.
          </p>
        </div>
      </footer>

    </div>
  );
}
