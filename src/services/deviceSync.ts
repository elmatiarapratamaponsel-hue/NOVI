import { Novel, User } from '../types';
import { StorageService } from './storage';

export type DeviceType = 'mobile' | 'laptop' | 'tablet' | 'desktop';

export interface LinkedDevice {
  id: string;
  name: string;
  type: DeviceType;
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
  ipLocation?: string;
}

const STORAGE_KEY_DEVICES = 'novi_linked_devices_v1';
const STORAGE_KEY_CURRENT_DEVICE_ID = 'novi_current_device_id_v1';

// BroadcastChannel for instant cross-tab / cross-window real-time synchronization
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('novi_device_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment', e);
}

export class DeviceSyncService {
  /**
   * Detect current device characteristics from navigator.userAgent
   */
  static detectCurrentDevice(): { type: DeviceType; name: string; browser: string; os: string } {
    if (typeof window === 'undefined') {
      return { type: 'laptop', name: 'Browser Web', browser: 'Chrome', os: 'Windows' };
    }

    const ua = navigator.userAgent;
    let type: DeviceType = 'laptop';
    let os = 'Windows';
    let browser = 'Chrome';

    // Detect OS & Device Type
    if (/iPad|tablet|PlayBook/i.test(ua)) {
      type = 'tablet';
      os = 'iPadOS / Tablet';
    } else if (/iPhone/i.test(ua)) {
      type = 'mobile';
      os = 'iOS (iPhone)';
    } else if (/Android/i.test(ua)) {
      if (/Mobile/i.test(ua)) {
        type = 'mobile';
        os = 'Android';
      } else {
        type = 'tablet';
        os = 'Android Tablet';
      }
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      type = 'laptop';
      os = 'macOS';
    } else if (/Linux/i.test(ua)) {
      type = 'laptop';
      os = 'Linux';
    } else if (/Windows/i.test(ua)) {
      type = 'laptop';
      os = 'Windows 11/10';
    }

    // Detect Browser
    if (/Edg/i.test(ua)) {
      browser = 'Microsoft Edge';
    } else if (/Chrome/i.test(ua)) {
      browser = 'Google Chrome';
    } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
      browser = 'Apple Safari';
    } else if (/Firefox/i.test(ua)) {
      browser = 'Mozilla Firefox';
    }

    const name = type === 'mobile' 
      ? `Smartphone (${os})` 
      : type === 'tablet' 
      ? `Tablet (${os})` 
      : `Laptop / PC (${os})`;

    return { type, name, browser, os };
  }

  /**
   * Get or create current device ID
   */
  static getCurrentDeviceId(): string {
    let id = localStorage.getItem(STORAGE_KEY_CURRENT_DEVICE_ID);
    if (!id) {
      id = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      localStorage.setItem(STORAGE_KEY_CURRENT_DEVICE_ID, id);
    }
    return id;
  }

  /**
   * Initialize default devices list if empty (simulate WhatsApp linked devices for Budi)
   */
  static getLinkedDevices(): LinkedDevice[] {
    try {
      const currentId = this.getCurrentDeviceId();
      const detected = this.detectCurrentDevice();
      const raw = localStorage.getItem(STORAGE_KEY_DEVICES);

      let devices: LinkedDevice[] = [];
      if (raw) {
        devices = JSON.parse(raw);
      } else {
        // Pre-seed realistic multi-device sessions for Budi
        devices = [
          {
            id: currentId,
            name: `${detected.browser} di ${detected.os}`,
            type: detected.type,
            browser: detected.browser,
            os: detected.os,
            lastActive: new Date().toISOString(),
            isCurrent: true,
            ipLocation: 'Jakarta, Indonesia',
          },
          {
            id: 'dev-hp-samsung',
            name: 'Samsung Galaxy S23 (NOVI Mobile)',
            type: 'mobile',
            browser: 'Chrome Mobile',
            os: 'Android 14',
            lastActive: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
            isCurrent: false,
            ipLocation: 'Jakarta, Indonesia',
          },
          {
            id: 'dev-tablet-ipad',
            name: 'iPad Pro 11" (E-Reader)',
            type: 'tablet',
            browser: 'Safari',
            os: 'iPadOS 17',
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
            isCurrent: false,
            ipLocation: 'Bandung, Indonesia',
          },
        ];
        localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
      }

      // Ensure current device is marked as isCurrent: true
      return devices.map((d) => ({
        ...d,
        isCurrent: d.id === currentId,
        lastActive: d.id === currentId ? new Date().toISOString() : d.lastActive,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Save linked devices list
   */
  static saveLinkedDevices(devices: LinkedDevice[]): void {
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
  }

  /**
   * Link a new device via pairing code or QR code
   */
  static linkNewDevice(deviceData: { name: string; type: DeviceType; browser?: string; os?: string }): LinkedDevice {
    const devices = this.getLinkedDevices();
    const newDevice: LinkedDevice = {
      id: `dev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: deviceData.name,
      type: deviceData.type,
      browser: deviceData.browser || 'Web Browser',
      os: deviceData.os || 'Multi-platform',
      lastActive: new Date().toISOString(),
      isCurrent: false,
      ipLocation: 'Indonesia',
    };

    devices.push(newDevice);
    this.saveLinkedDevices(devices);
    this.broadcastSync('device_linked', { device: newDevice });
    return newDevice;
  }

  /**
   * Remove a linked device (Keluar dari perangkat)
   */
  static unlinkDevice(deviceId: string): boolean {
    const devices = this.getLinkedDevices();
    const filtered = devices.filter((d) => d.id !== deviceId);
    if (filtered.length !== devices.length) {
      this.saveLinkedDevices(filtered);
      this.broadcastSync('device_unlinked', { deviceId });
      return true;
    }
    return false;
  }

  /**
   * Generate a 6-character random pairing code (e.g., NV-7492)
   */
  static generatePairingCode(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'NV-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Export library snapshot for device-to-device sync
   */
  static exportSyncPayload(currentUser: User): string {
    const novels = StorageService.getUserNovels(currentUser.id);
    const payload = {
      version: 1,
      appName: 'NOVI',
      timestamp: new Date().toISOString(),
      user: currentUser,
      novelsCount: novels.length,
      novels,
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Import library snapshot from another device
   */
  static importSyncPayload(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.appName || data.appName !== 'NOVI' || !Array.isArray(data.novels)) {
        return { success: false, count: 0, error: 'Format data sinkronisasi tidak valid untuk NOVI.' };
      }

      const allNovels = StorageService.getAllNovels();
      let importedCount = 0;

      data.novels.forEach((incoming: Novel) => {
        const existingIdx = allNovels.findIndex((n) => n.id === incoming.id || (n.title.toLowerCase() === incoming.title.toLowerCase() && n.userId === incoming.userId));
        if (existingIdx !== -1) {
          // Merge with latest progress
          allNovels[existingIdx] = {
            ...allNovels[existingIdx],
            ...incoming,
            currentPage: Math.max(allNovels[existingIdx].currentPage, incoming.currentPage),
            readingProgress: Math.max(allNovels[existingIdx].readingProgress, incoming.readingProgress),
            updatedAt: new Date().toISOString(),
          };
        } else {
          allNovels.push(incoming);
          importedCount++;
        }
      });

      localStorage.setItem('novi_novels_v1', JSON.stringify(allNovels));
      this.broadcastSync('library_updated', { count: importedCount });
      return { success: true, count: importedCount };
    } catch (e) {
      return { success: false, count: 0, error: 'Gagal mengurai data sinkronisasi: ' + String(e) };
    }
  }

  /**
   * Broadcast real-time sync event across open browser tabs / windows
   */
  static broadcastSync(action: string, payload?: any): void {
    if (syncChannel) {
      try {
        syncChannel.postMessage({ action, payload, timestamp: Date.now() });
      } catch (e) {
        console.warn('Failed to broadcast message', e);
      }
    }
  }

  /**
   * Listen to sync events from other tabs/windows
   */
  static onSyncEvent(callback: (data: { action: string; payload?: any }) => void): () => void {
    if (!syncChannel) return () => {};

    const handler = (event: MessageEvent) => {
      if (event.data && event.data.action) {
        callback(event.data);
      }
    };

    syncChannel.addEventListener('message', handler);
    return () => {
      syncChannel?.removeEventListener('message', handler);
    };
  }
}
