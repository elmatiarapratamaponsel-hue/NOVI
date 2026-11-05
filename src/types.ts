export type ReadingStatus = 'not_started' | 'reading' | 'completed';

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Novel {
  id: string;
  userId: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  synopsis: string;
  coverUrl: string;
  fileType: 'pdf' | 'epub' | 'text';
  fileName: string;
  fileSize?: string;
  fileData?: string; // Base64 data URL for PDF/EPUB, or text content
  totalPages: number;
  currentPage: number;
  readingStatus: ReadingStatus;
  readingProgress: number; // 0 - 100
  rating?: number; // 1 - 5
  lastReadAt?: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export type SortOption = 'recent' | 'title' | 'author' | 'progress' | 'year';

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'navy';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: number; // 14 - 24
  fontFamily: 'serif' | 'sans';
  lineHeight: number; // 1.5 - 2.0
}
