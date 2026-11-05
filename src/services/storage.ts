import { Novel, User } from '../types';
import { INITIAL_SAMPLE_NOVELS } from '../data/sampleNovels';

const STORAGE_KEY_USERS = 'novi_users_v1';
const STORAGE_KEY_CURRENT_USER = 'novi_current_user_v1';
const STORAGE_KEY_NOVELS = 'novi_novels_v1';

// Default initial user: Budi Santoso
const DEFAULT_USER: User = {
  id: 'user-budi-01',
  name: 'Budi Santoso',
  email: 'budi@novi.id',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Pengoleksi dan penikmat novel digital Indonesia & internasional.'
};

export class StorageService {
  /**
   * Initialize local storage with default user & books if not present
   */
  static initialize(): void {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      if (!storedUsers) {
        const users: User[] = [DEFAULT_USER];
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      }

      const currentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (!currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(DEFAULT_USER));
      }

      const storedNovels = localStorage.getItem(STORAGE_KEY_NOVELS);
      if (!storedNovels) {
        const initialNovels: Novel[] = INITIAL_SAMPLE_NOVELS.map((novel) => ({
          ...novel,
          userId: DEFAULT_USER.id,
        }));
        localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(initialNovels));
      }
    } catch (e) {
      console.error('Failed to initialize storage:', e);
    }
  }

  // --- Auth & User Management ---

  static getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  }

  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      return data ? JSON.parse(data) : [DEFAULT_USER];
    } catch {
      return [DEFAULT_USER];
    }
  }

  static registerUser(name: string, email: string): { user: User; error?: string } {
    try {
      const users = this.getUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return { user: existing, error: 'Email ini sudah terdaftar. Silakan login langsung.' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim() || 'Pembaca NOVI',
        email: email.trim().toLowerCase(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      this.setCurrentUser(newUser);

      // Seed 2 initial starter novels for brand new user so they have starting material
      const starterNovels: Novel[] = INITIAL_SAMPLE_NOVELS.slice(0, 2).map((n) => ({
        ...n,
        id: `novel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: newUser.id,
        readingProgress: 0,
        currentPage: 0,
        readingStatus: 'not_started',
      }));
      const allNovels = this.getAllNovels();
      localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify([...allNovels, ...starterNovels]));

      return { user: newUser };
    } catch (e) {
      return { user: DEFAULT_USER, error: 'Gagal mendaftar akun: ' + String(e) };
    }
  }

  static loginUser(email: string): { user: User | null; error?: string } {
    try {
      const users = this.getUsers();
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        this.setCurrentUser(matched);
        return { user: matched };
      }
      return { user: null, error: 'Email belum terdaftar. Silakan buat akun baru.' };
    } catch (e) {
      return { user: null, error: 'Gagal masuk akun: ' + String(e) };
    }
  }

  // --- Novel Management ---

  static getAllNovels(): Novel[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOVELS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getUserNovels(userId: string): Novel[] {
    const all = this.getAllNovels();
    return all.filter((novel) => novel.userId === userId);
  }

  static addNovel(novelData: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>): Novel {
    const all = this.getAllNovels();
    const now = new Date().toISOString();
    const newNovel: Novel = {
      ...novelData,
      id: `novel-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    all.unshift(newNovel);
    localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(all));
    return newNovel;
  }

  static updateNovel(id: string, updates: Partial<Novel>): Novel | null {
    const all = this.getAllNovels();
    const index = all.findIndex((n) => n.id === id);
    if (index === -1) return null;

    const updated: Novel = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(all));
    return updated;
  }

  static deleteNovel(id: string): boolean {
    const all = this.getAllNovels();
    const filtered = all.filter((n) => n.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  static updateReadingProgress(id: string, currentPage: number, totalPages?: number): Novel | null {
    const all = this.getAllNovels();
    const index = all.findIndex((n) => n.id === id);
    if (index === -1) return null;

    const book = all[index];
    const total = totalPages || book.totalPages || 100;
    const clampedCurrent = Math.min(Math.max(currentPage, 0), total);
    const progress = Math.min(100, Math.round((clampedCurrent / total) * 100));

    let status: Novel['readingStatus'] = book.readingStatus;
    if (clampedCurrent >= total) {
      status = 'completed';
    } else if (clampedCurrent > 0) {
      status = 'reading';
    } else {
      status = 'not_started';
    }

    const updated: Novel = {
      ...book,
      currentPage: clampedCurrent,
      totalPages: total,
      readingProgress: progress,
      readingStatus: status,
      lastReadAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify(all));
    return updated;
  }

  static resetSampleData(userId: string): void {
    const all = this.getAllNovels();
    const withoutUser = all.filter((n) => n.userId !== userId);
    const seeded = INITIAL_SAMPLE_NOVELS.map((novel) => ({
      ...novel,
      userId,
    }));
    localStorage.setItem(STORAGE_KEY_NOVELS, JSON.stringify([...withoutUser, ...seeded]));
  }
}
