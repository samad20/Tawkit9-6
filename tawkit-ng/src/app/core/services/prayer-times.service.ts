import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { RawPrayerEntry } from '../models/prayer-times.model';

@Injectable({ providedIn: 'root' })
export class PrayerTimesService {
  private readonly http = inject(HttpClient);
  private readonly settingsService = inject(SettingsService);

  private readonly _allEntries = signal<RawPrayerEntry[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly allEntries = this._allEntries.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly todayPrayers = computed<RawPrayerEntry | null>(() => {
    return this.findEntryForDate(new Date(), this._allEntries());
  });

  constructor() {
    effect(() => {
      const cityCode = this.settingsService.cityCode();
      this.loadPrayerTimes(cityCode);
    });
  }

  private loadPrayerTimes(cityCode: string): void {
    const [country, city] = cityCode.split('.');
    if (!country || !city) return;

    this._loading.set(true);
    this._error.set(null);

    const url = `assets/data/${country}/wtimes-${country}.${city}.js`;

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (content) => {
        const entries = this.parseTimesFile(content);
        this._allEntries.set(entries);
        this._loading.set(false);
      },
      error: () => {
        this._error.set(`Could not load prayer times for ${cityCode}`);
        this._loading.set(false);
        // Fallback to Makkah if not already
        if (cityCode !== 'SA.MAKKAH') {
          this.loadPrayerTimes('SA.MAKKAH');
        }
      }
    });
  }

  private parseTimesFile(content: string): RawPrayerEntry[] {
    const match = content.match(/JS_TIMES\s*=\s*\[([\s\S]*?)\]/);
    if (!match) return [];

    const lines = match[1].match(/"([^"]+)"/g) || [];
    const entries: RawPrayerEntry[] = [];

    for (const line of lines) {
      const raw = line.replace(/"/g, '').trim();
      const separatorIdx = raw.indexOf('~~~~~');
      if (separatorIdx === -1) continue;

      const date = raw.substring(0, separatorIdx);
      const timeStr = raw.substring(separatorIdx + 5);
      const times = timeStr.split('|');

      if (times.length >= 6) {
        entries.push({
          date,
          fajr: times[0].trim(),
          sunrise: times[1].trim(),
          dhuhr: times[2].trim(),
          asr: times[3].trim(),
          maghrib: times[4].trim(),
          isha: times[5].trim(),
        });
      }
    }

    return entries;
  }

  private findEntryForDate(date: Date, entries: RawPrayerEntry[]): RawPrayerEntry | null {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Try DD-MM
    let entry = entries.find(e => e.date === `${day}-${month}`);
    // Try MM-DD
    if (!entry) entry = entries.find(e => e.date === `${month}-${day}`);
    // Fallback
    if (!entry && entries.length > 0) entry = entries[0];

    return entry ?? null;
  }

  getEntryForDate(date: Date): RawPrayerEntry | null {
    return this.findEntryForDate(date, this._allEntries());
  }
}
