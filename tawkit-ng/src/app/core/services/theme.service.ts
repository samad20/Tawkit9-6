import { Injectable, inject, effect } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly settingsService = inject(SettingsService);

  constructor() {
    effect(() => {
      const theme = this.settingsService.theme();
      this.applyTheme(theme);
    });
  }

  private applyTheme(themeIndex: number): void {
    document.documentElement.setAttribute('data-theme', String(themeIndex));
  }

  getThemeUrl(index: number, mode: 'HR' | 'VR' = 'HR'): string {
    return `assets/themes/${mode}-${index}.jpg`;
  }
}
