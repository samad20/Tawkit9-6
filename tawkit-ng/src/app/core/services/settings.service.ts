import { Injectable, signal, computed } from '@angular/core';
import { AppSettings, DEFAULT_SETTINGS, LanguageCode, FontSettings } from '../models/settings.model';

const STORAGE_KEY = 'tawkit_settings_v2';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _settings = signal<AppSettings>(this.loadSettings());

  readonly settings = this._settings.asReadonly();
  readonly language = computed(() => this._settings().language);
  readonly theme = computed(() => this._settings().theme);
  readonly cityCode = computed(() => this._settings().cityCode);
  readonly mosqueName = computed(() => this._settings().mosqueName);
  readonly use24Hours = computed(() => this._settings().use24Hours);
  readonly useArabicDigits = computed(() => this._settings().useArabicDigits);
  readonly showSunrise = computed(() => this._settings().showSunrise);
  readonly fonts = computed(() => this._settings().fonts);
  readonly dimmPastPrayers = computed(() => this._settings().dimmPastPrayers);
  readonly namesInMiddle = computed(() => this._settings().namesInMiddle);
  readonly semiTransparentBgs = computed(() => this._settings().semiTransparentBgs);
  readonly counterColorAlert = computed(() => this._settings().counterColorAlert);
  readonly isRTL = computed(() => {
    const lang = this._settings().language;
    return ['AR', 'FA', 'UR', 'HE'].includes(lang);
  });

  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch { /* ignore */ }
    return { ...DEFAULT_SETTINGS };
  }

  update(partial: Partial<AppSettings>): void {
    this._settings.update(s => {
      const updated = { ...s, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._settings.set({ ...DEFAULT_SETTINGS });
  }
}
