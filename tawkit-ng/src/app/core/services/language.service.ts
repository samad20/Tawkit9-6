import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly settingsService = inject(SettingsService);

  private readonly _translations = signal<Record<string, string>>({});

  readonly translations = this._translations.asReadonly();
  readonly isRTL = computed(() => this.settingsService.isRTL());

  constructor() {
    effect(() => {
      const lang = this.settingsService.language();
      this.loadLanguage(lang);
    });

    effect(() => {
      const rtl = this.isRTL();
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = this.settingsService.language().toLowerCase();
    });
  }

  t(key: string, fallback = ''): string {
    return this._translations()[key] ?? fallback ?? key;
  }

  private loadLanguage(lang: string): void {
    this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`).subscribe({
      next: t => this._translations.set(t),
      error: () => {
        if (lang !== 'EN') {
          this.http.get<Record<string, string>>('assets/i18n/EN.json').subscribe({
            next: t => this._translations.set(t),
          });
        }
      },
    });
  }
}
