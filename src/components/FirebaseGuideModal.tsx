import React from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Server, 
  RefreshCw, 
  Key,
  Info
} from 'lucide-react';

interface FirebaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDemoData: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({
  isOpen,
  onClose,
  onResetDemoData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white dark:from-slate-900 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Status Database & Panduan Firebase
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penyimpanan data koleksi novel digital NOVI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Active Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Penyimpanan Permanen Aktif
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
                Aplikasi NOVI saat ini menggunakan database browser terenkripsi (IndexedDB & LocalStorage). Seluruh novel yang Anda tambahkan, baca, edit, atau tandai halamannya <strong>tersimpan permanen dan tidak akan hilang saat aplikasi ditutup</strong>.
              </p>
            </div>
          </div>

          {/* Cloud Firestore & Auth Integration Guide */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-600" />
              <span>Petunjuk Konfigurasi Firebase (Cloud Database)</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Jika Anda ingin menyinkronkan perpustakaan novel digital antar-perangkat secara otomatis melalui cloud Google Firebase:
            </p>

            <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                <strong>Buat Proyek di Firebase Console:</strong> Kunjungi{' '}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-semibold underline inline-flex items-center gap-0.5"
                >
                  console.firebase.google.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                lalu buat proyek baru bernama <em>NOVI-Library</em>.
              </li>
              <li className="leading-relaxed">
                <strong>Aktifkan Firebase Authentication:</strong> Masuk ke tab <em>Authentication</em> &gt; <em>Sign-in method</em>, lalu aktifkan provider <strong>Email/Password</strong> dan <strong>Google Sign-In</strong>.
              </li>
              <li className="leading-relaxed">
                <strong>Aktifkan Cloud Firestore Database:</strong> Masuk ke tab <em>Firestore Database</em>, pilih <em>Create Database</em> pada mode Production di region terdekat.
              </li>
              <li className="leading-relaxed">
                <strong>Terapkan Aturan Keamanan (Security Rules):</strong> Pastikan koleksi novel hanya dapat diakses oleh pemilik akun:
                <pre className="mt-2 p-3 bg-slate-900 text-purple-300 rounded-xl text-[11px] overflow-x-auto font-mono">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /novels/{novelId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}`}
                </pre>
              </li>
              <li className="leading-relaxed">
                <strong>Salin Firebase Config:</strong> Dapatkan objek konfigurasi web app dan masukkan ke dalam proyek aplikasi.
              </li>
            </ol>
          </div>

          {/* Reset sample data */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Kembalikan Koleksi Contoh Budi
              </p>
              <p className="text-[11px] text-slate-500">
                Memulihkan 5 novel klasik contoh (Laskar Pelangi, Bumi Manusia, dll.)
              </p>
            </div>

            <button
              onClick={() => {
                onResetDemoData();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Contoh</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
          >
            Mengerti & Tutup
          </button>
        </div>

      </div>

    </div>
  );
};
