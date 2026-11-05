import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Check, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { Novel, ReadingStatus } from '../types';
import { GENRE_LIST } from '../data/sampleNovels';

interface AddEditNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novelData: Partial<Novel>) => void;
  initialNovel?: Novel | null;
}

const PRESET_COVERS = [
  { label: 'Eksplorasi Alam', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Klasik Perpustakaan', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
  { label: 'Petualangan & Cahaya', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80' },
  { label: 'Misteri & Malam', url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Kopi & Cerita', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80' },
  { label: 'Langit Senja', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80' }
];

export const AddEditNovelModal: React.FC<AddEditNovelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNovel,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Drama');
  const [customGenre, setCustomGenre] = useState('');
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [synopsis, setSynopsis] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'epub' | 'text'>('pdf');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileData, setFileData] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(250);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>('not_started');
  const [customChapterText, setCustomChapterText] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialNovel) {
      setTitle(initialNovel.title);
      setAuthor(initialNovel.author);
      setGenre(initialNovel.genre || 'Drama');
      setPublicationYear(initialNovel.publicationYear || new Date().getFullYear());
      setSynopsis(initialNovel.synopsis || '');
      setCoverUrl(initialNovel.coverUrl || '');
      setFileType(initialNovel.fileType || 'pdf');
      setFileName(initialNovel.fileName || '');
      setFileSize(initialNovel.fileSize || '');
      setFileData(initialNovel.fileData || '');
      setTotalPages(initialNovel.totalPages || 200);
      setReadingStatus(initialNovel.readingStatus || 'not_started');
      if (initialNovel.chapters && initialNovel.chapters.length > 0) {
        setCustomChapterText(initialNovel.chapters[0].content);
      }
    } else {
      // Reset form
      setTitle('');
      setAuthor('');
      setGenre('Drama');
      setCustomGenre('');
      setPublicationYear(new Date().getFullYear());
      setSynopsis('');
      setCoverUrl(PRESET_COVERS[0].url);
      setFileType('pdf');
      setFileName('novel_digital.pdf');
      setFileSize('2.5 MB');
      setFileData('');
      setTotalPages(250);
      setReadingStatus('not_started');
      setCustomChapterText('');
    }
    setErrors({});
  }, [initialNovel, isOpen]);

  if (!isOpen) return null;

  // Handle local image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local novel document upload (.pdf, .epub, .txt)
  const handleNovelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.name;
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setFileName(name);
      setFileSize(sizeStr);

      const ext = name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        setFileType('pdf');
      } else if (ext === 'epub') {
        setFileType('epub');
      } else {
        setFileType('text');
      }

      // Read file data
      const reader = new FileReader();
      if (ext === 'txt') {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setFileData(reader.result);
            setCustomChapterText(reader.result);
          }
        };
        reader.readAsText(file);
      } else {
        // PDF or EPUB read as Data URL
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setFileData(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Judul novel wajib diisi.';
    }
    if (!author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi.';
    }
    if (!coverUrl.trim()) {
      newErrors.coverUrl = 'Silakan pilih atau unggah sampul novel.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalGenre = genre === 'Lainnya' && customGenre.trim() ? customGenre.trim() : genre;

    // Create chapters representation for reader
    const chapters = customChapterText.trim()
      ? [
          {
            id: 'c1',
            title: `Bab 1: Permulaan ${title}`,
            content: customChapterText.trim(),
          },
        ]
      : initialNovel?.chapters || [
          {
            id: 'c1',
            title: `Bab 1: Awal Kisah ${title}`,
            content: synopsis
              ? `${synopsis}\n\nKisah ini berlanjut dengan perjalanan yang menakjubkan. Setiap lembaran menyimpan rahasia dan petualangan baru yang dinantikan pembaca.`
              : 'Isi novel ini siap dinikmati di aplikasi NOVI.',
          },
        ];

    onSave({
      title: title.trim(),
      author: author.trim(),
      genre: finalGenre,
      publicationYear: Number(publicationYear) || new Date().getFullYear(),
      synopsis: synopsis.trim(),
      coverUrl: coverUrl.trim(),
      fileType,
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.${fileType}`,
      fileSize: fileSize || '1.8 MB',
      fileData: fileData || undefined,
      totalPages: Number(totalPages) || 200,
      readingStatus,
      chapters,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white dark:from-slate-900 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                {initialNovel ? 'Edit Informasi Novel' : 'Tambah Novel ke Perpustakaan'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lengkapi formulir di bawah ini untuk menyimpan novel ke database koleksi NOVI.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Judul Novel */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Judul Novel <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Laskar Pelangi, Bumi Manusia..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Penulis & Tahun Terbit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Nama Penulis <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Andrea Hirata, Pramoedya Ananta Toer"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {errors.author && <p className="text-xs text-rose-500 mt-1">{errors.author}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Tahun Terbit
              </label>
              <input
                type="number"
                min="1800"
                max="2099"
                value={publicationYear}
                onChange={(e) => setPublicationYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Genre & Total Halaman */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Genre Novel
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {GENRE_LIST.filter((g) => g !== 'Semua Genre').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="Lainnya">+ Tambah Genre Lainnya</option>
              </select>

              {genre === 'Lainnya' && (
                <input
                  type="text"
                  placeholder="Ketik nama genre baru..."
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-300 dark:border-purple-700 text-sm"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Total Jumlah Halaman
              </label>
              <input
                type="number"
                min="1"
                max="5000"
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value) || 100)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Sinopsis Singkat */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Sinopsis Singkat
            </label>
            <textarea
              rows={3}
              placeholder="Ceritakan gambaran alur cerita atau premis menarik dari novel ini..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Sampul Novel (Cover) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Gambar Sampul Novel <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Preview Box */}
              <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm relative group">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Belum ada sampul</span>
                  </div>
                )}
              </div>

              {/* Upload or Preset Options */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah File Gambar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-400 self-center">atau gunakan URL gambar / preset</span>
                </div>

                <input
                  type="url"
                  placeholder="Atau masukkan URL gambar sampul online (https://...)"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                />

                {/* Preset Picker */}
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Pilih Cepat Sampul Estetik:</span>
                  <div className="flex gap-2 mt-1 overflow-x-auto pb-1 scrollbar-none">
                    {PRESET_COVERS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setCoverUrl(preset.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold whitespace-nowrap transition-all ${
                          coverUrl === preset.url
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {errors.coverUrl && <p className="text-xs text-rose-500">{errors.coverUrl}</p>}
          </div>

          {/* File Novel (PDF, EPUB, TXT) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                File Novel (Format PDF / EPUB / Teks)
              </label>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                Dapat dibaca langsung di NOVI
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border-2 border-dashed border-purple-200 dark:border-purple-800/80 text-center space-y-2">
              <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto" />
              
              {fileName ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-xs font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{fileName} ({fileSize || '1.8 MB'})</span>
                  <span className="uppercase text-[10px] px-1 bg-purple-200 dark:bg-purple-800 rounded">
                    {fileType}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pilih file PDF atau EPUB novel Anda untuk disimpan di database
                </p>
              )}

              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File PDF / EPUB / TXT</span>
                  <input
                    type="file"
                    accept=".pdf,.epub,.txt"
                    onChange={handleNovelFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Status Membaca Awal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Status Membaca Awal
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReadingStatus('not_started')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  readingStatus === 'not_started'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                Belum Dibaca
              </button>
              <button
                type="button"
                onClick={() => setReadingStatus('reading')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  readingStatus === 'reading'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                Sedang Dibaca
              </button>
              <button
                type="button"
                onClick={() => setReadingStatus('completed')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  readingStatus === 'completed'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>

          {/* Action Buttons: Simpan & Batalkan */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batalkan
            </button>
            
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-md shadow-purple-600/30 transition-all transform hover:scale-102 active:scale-98"
            >
              {initialNovel ? 'Simpan Perubahan' : 'Simpan Novel'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
