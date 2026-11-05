import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Monitor, 
  Plus, 
  QrCode, 
  Key, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Upload,
  ArrowRight,
  Radio,
  Sparkles
} from 'lucide-react';
import { DeviceSyncService, LinkedDevice, DeviceType } from '../services/deviceSync';
import { QRCodeDisplay } from './QRCodeDisplay';
import { User } from '../types';

interface LinkedDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onNotify: (message: string, type?: 'success' | 'error' | 'info') => void;
  onLibrarySyncSuccess: () => void;
}

export const LinkedDevicesModal: React.FC<LinkedDevicesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNotify,
  onLibrarySyncSuccess,
}) => {
  const [devices, setDevices] = useState<LinkedDevice[]>([]);
  const [viewState, setViewState] = useState<'list' | 'qr_pair' | 'code_pair' | 'import_export'>('list');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [inputPairingCode, setInputPairingCode] = useState<string>('');
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [qrExpiryCountdown, setQrExpiryCountdown] = useState(60);

  // Load devices on open
  useEffect(() => {
    if (isOpen) {
      loadDevices();
      setPairingCode(DeviceSyncService.generatePairingCode());
      setViewState('list');
      setQrExpiryCountdown(60);
    }
  }, [isOpen]);

  // QR Code expiry timer countdown like WhatsApp Web
  useEffect(() => {
    if (viewState === 'qr_pair' && qrExpiryCountdown > 0) {
      const timer = setInterval(() => {
        setQrExpiryCountdown((prev) => {
          if (prev <= 1) {
            setPairingCode(DeviceSyncService.generatePairingCode());
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [viewState, qrExpiryCountdown]);

  const loadDevices = () => {
    const list = DeviceSyncService.getLinkedDevices();
    setDevices(list);
  };

  if (!isOpen) return null;

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'desktop':
        return <Monitor className="w-5 h-5 text-slate-700 dark:text-slate-300" />;
      case 'laptop':
      default:
        return <Laptop className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const handleUnlink = (deviceId: string, deviceName: string) => {
    const success = DeviceSyncService.unlinkDevice(deviceId);
    if (success) {
      onNotify(`Perangkat "${deviceName}" berhasil diputuskan tautannya.`, 'info');
      loadDevices();
    }
  };

  const handleSimulateAddDevice = (type: DeviceType, name: string) => {
    const newDev = DeviceSyncService.linkNewDevice({
      name,
      type,
      browser: type === 'mobile' ? 'Mobile Safari / Chrome' : 'Chrome Desktop',
      os: type === 'mobile' ? 'iOS / Android' : 'Windows / macOS',
    });
    onNotify(`Perangkat baru "${newDev.name}" berhasil ditautkan!`, 'success');
    loadDevices();
    setViewState('list');
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(pairingCode);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2500);
    onNotify('Kode tautan disalin ke clipboard!', 'success');
  };

  const handleCopyAppUrl = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setHasCopiedUrl(true);
    setTimeout(() => setHasCopiedUrl(false), 2500);
    onNotify('Alamat tautan aplikasi NOVI disalin!', 'success');
  };

  const handleApplyInputCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPairingCode.trim()) return;

    // Simulate successful link from another device
    const code = inputPairingCode.trim().toUpperCase();
    handleSimulateAddDevice('mobile', `Perangkat Tertaut (${code})`);
    onNotify(`Berhasil terhubung dengan kode ${code}! Sinkronisasi selesai.`, 'success');
    setInputPairingCode('');
    setViewState('list');
    onLibrarySyncSuccess();
  };

  const handleExportJson = () => {
    if (!currentUser) return;
    const payload = DeviceSyncService.exportSyncPayload(currentUser);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOVI_Koleksi_${currentUser.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('File cadangan sinkronisasi perpustakaan berhasil diunduh!', 'success');
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      onNotify('Silakan tempel teks data cadangan JSON terlebih dahulu.', 'error');
      return;
    }
    const res = DeviceSyncService.importSyncPayload(importJsonText.trim());
    if (res.success) {
      onNotify(`Sinkronisasi berhasil! ${res.count} novel baru diperbarui.`, 'success');
      setImportJsonText('');
      setViewState('list');
      onLibrarySyncSuccess();
    } else {
      onNotify(res.error || 'Gagal menyinkronkan data.', 'error');
    }
  };

  const currentDevice = devices.find((d) => d.isCurrent) || devices[0];
  const otherDevices = devices.filter((d) => !d.isCurrent);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Perangkat Tertaut (Linked Devices)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
                  {devices.length} Perangkat
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gunakan NOVI di HP, Laptop, dan Tablet seperti aplikasi WhatsApp
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-bold gap-2">
            <button
              onClick={() => setViewState('list')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                viewState === 'list'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Daftar Perangkat ({devices.length})</span>
            </button>

            <button
              onClick={() => setViewState('qr_pair')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                viewState === 'qr_pair'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Pindai Kode QR (WA Style)</span>
            </button>

            <button
              onClick={() => setViewState('code_pair')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                viewState === 'code_pair'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Tautkan dengan Kode</span>
            </button>

            <button
              onClick={() => setViewState('import_export')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                viewState === 'import_export'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sinkronisasi File</span>
            </button>
          </div>

          {/* VIEW 1: LIST PERANGKAT TERTAUT */}
          {viewState === 'list' && (
            <div className="space-y-6">
              
              {/* WhatsApp Web Banner */}
              <div className="rounded-2xl p-5 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-600/20">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-purple-100">
                    <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                    <span>Sinkronisasi Multi-Perangkat Aktif</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">
                    Buka NOVI di HP dan Laptop Bersamaan
                  </h3>
                  <p className="text-xs text-purple-100/80 max-w-md">
                    Seluruh koleksi novel, progres halaman terakhir, dan bookmark otomatis tersambung di semua perangkat Anda.
                  </p>
                </div>

                <button
                  onClick={() => setViewState('qr_pair')}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-purple-900 hover:bg-purple-50 shadow-md transition-all shrink-0 flex items-center gap-2 transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4 text-purple-700" />
                  <span>Tautkan Perangkat Baru</span>
                </button>
              </div>

              {/* Perangkat Saat Ini (Current Device) */}
              {currentDevice && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Perangkat Anda Saat Ini
                  </span>
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-xl bg-purple-600 text-white shadow-xs">
                        {getDeviceIcon(currentDevice.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {currentDevice.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            Aktif Sekarang
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {currentDevice.browser} &bull; {currentDevice.ipLocation || 'Indonesia'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Daftar Perangkat Tertaut Lainnya */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Perangkat Tertaut Lainnya ({otherDevices.length})
                  </span>
                  {otherDevices.length > 0 && (
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                      Tersinkronisasi Otomatis
                    </span>
                  )}
                </div>

                {otherDevices.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <Smartphone className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-500">
                      Belum ada perangkat lain yang ditautkan. Tautkan HP atau tablet Anda untuk membaca di mana saja.
                    </p>
                    <button
                      onClick={() => setViewState('qr_pair')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tautkan Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {otherDevices.map((dev) => (
                      <div
                        key={dev.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {getDeviceIcon(dev.type)}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                              {dev.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {dev.browser} &bull; Terakhir aktif: {new Date(dev.lastActive).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUnlink(dev.id, dev.name)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Keluar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick simulation buttons for testing */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Coba Simulasi Hubungkan Perangkat (Demo Cepat):</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSimulateAddDevice('mobile', 'iPhone 15 Pro (Safari Mobile)')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300"
                  >
                    + Hubungkan iPhone
                  </button>
                  <button
                    onClick={() => handleSimulateAddDevice('mobile', 'Samsung Galaxy S24 (Chrome)')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300"
                  >
                    + Hubungkan Android HP
                  </button>
                  <button
                    onClick={() => handleSimulateAddDevice('tablet', 'iPad Air M2 (E-Reader Mode)')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300"
                  >
                    + Hubungkan iPad / Tablet
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: PINDAI KODE QR (WHATSAPP WEB STYLE) */}
          {viewState === 'qr_pair' && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-purple-100 dark:border-slate-800">
                
                {/* QR Code Container */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <QRCodeDisplay value={`novi://pair?code=${pairingCode}&user=${encodeURIComponent(currentUser?.email || 'budi@novi.id')}&t=${Date.now()}`} size={210} />
                  
                  <div className="text-center">
                    <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
                      <span>Kode diperbarui dalam <strong>{qrExpiryCountdown} detik</strong></span>
                    </span>
                  </div>
                </div>

                {/* WhatsApp Web Style Steps */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-purple-600" />
                    <span>Langkah Menghubungkan NOVI di HP:</span>
                  </h3>

                  <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                    <li>
                      Buka browser di HP atau laptop Anda dan buka URL aplikasi ini:
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={typeof window !== 'undefined' ? window.location.href : 'https://novi-library.app'}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-purple-600 dark:text-purple-400 select-all max-w-[260px] truncate"
                        />
                        <button
                          onClick={handleCopyAppUrl}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700"
                        >
                          {hasCopiedUrl ? 'Tersalin!' : 'Salin URL'}
                        </button>
                      </div>
                    </li>
                    <li>
                      Ketuk menu <strong>Perangkat Tertaut</strong> di navbar bagian atas.
                    </li>
                    <li>
                      Arahkan kamera ke layar ini untuk memindai kode QR, atau masukkan kode tautan di bawah.
                    </li>
                  </ol>

                  {/* Switch to text code */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setViewState('code_pair')}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Atau tautkan dengan kode 6-digit ({pairingCode})</span>
                    </button>
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setViewState('list')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  &larr; Kembali ke Daftar Perangkat
                </button>

                <button
                  onClick={() => {
                    handleSimulateAddDevice('mobile', 'Smartphone Terhubung (via QR)');
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30"
                >
                  Konfirmasi Pindai Berhasil
                </button>
              </div>

            </div>
          )}

          {/* VIEW 3: TAUTKAN DENGAN KODE 6-DIGIT */}
          {viewState === 'code_pair' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-800 space-y-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Kode Sinkronisasi Perangkat Anda
                </span>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-widest text-slate-900 dark:text-slate-100 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border-2 border-purple-300 dark:border-purple-700 shadow-sm">
                    {pairingCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    title="Salin Kode"
                    className="p-3 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-all"
                  >
                    {hasCopiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Masukkan kode di atas pada perangkat HP atau laptop lain untuk menghubungkan akun Budi secara instan.
                </p>
              </div>

              {/* Form to enter code from another device */}
              <form onSubmit={handleApplyInputCode} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Punya Kode dari Perangkat Lain?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: NV-8492"
                    value={inputPairingCode}
                    onChange={(e) => setInputPairingCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono uppercase tracking-wider text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30"
                  >
                    Tautkan Perangkat
                  </button>
                </div>
              </form>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setViewState('list')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  &larr; Kembali
                </button>
                <button
                  onClick={() => setViewState('qr_pair')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Gunakan Kode QR Sebagai Gantinya &rarr;
                </button>
              </div>

            </div>
          )}

          {/* VIEW 4: SINKRONISASI FILE / CADANGAN */}
          {viewState === 'import_export' && (
            <div className="space-y-5">
              
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                    Cadangan & Pindah Perangkat Tanpa Kehilangan Buku
                  </h4>
                  <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                    Anda dapat mengunduh seluruh koleksi novel digital beserta posisi halaman terakhir yang dibaca, lalu mengimpornya ke HP atau laptop baru dalam satu klik.
                  </p>
                </div>
              </div>

              {/* Export Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Ekspor Koleksi Novel Saat Ini
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Unduh file JSON cadangan seluruh buku dan bookmark Anda
                  </p>
                </div>
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Data</span>
                </button>
              </div>

              {/* Import Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Impor / Pulihkan Koleksi dari Perangkat Lain
                </h4>
                <textarea
                  rows={3}
                  placeholder="Tempel teks JSON cadangan koleksi novel di sini..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
                <button
                  onClick={handleImportJson}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Impor & Sinkronkan Sekarang</span>
                </button>
              </div>

              <button
                onClick={() => setViewState('list')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                &larr; Kembali ke Daftar Perangkat
              </button>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Koleksi terlindungi dengan enkripsi sinkronisasi perangkat</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  );
};
