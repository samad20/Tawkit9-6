import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { PrayerTimesService } from './prayer-times.service';
import { SettingsService } from './settings.service';
import { PrayerTime, PrayerId, CountdownState, RawPrayerEntry } from '../models/prayer-times.model';

const PRAYER_META: Array<{ id: PrayerId; name: string; nameAr: string }> = [
  { id: 'fajr',    name: 'Fajr',    nameAr: 'الفجر'  },
  { id: 'sunrise', name: 'Sunrise', nameAr: 'الشروق' },
  { id: 'dhuhr',   name: 'Dhuhr',   nameAr: 'الظهر'  },
  { id: 'asr',     name: 'Asr',     nameAr: 'العصر'  },
  { id: 'maghrib', name: 'Maghrib', nameAr: 'المغرب' },
  { id: 'isha',    name: 'Isha',    nameAr: 'العشاء'  },
];

function toMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function addMinutes(timeStr: string, mins: number): string {
  const total = toMinutes(timeStr) + mins;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function secondsToLabel(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class CountdownService implements OnDestroy {
  private readonly prayerService = inject(PrayerTimesService);
  private readonly settingsService = inject(SettingsService);

  private readonly _now = signal<Date>(new Date());
  private readonly timer: ReturnType<typeof setInterval>;

  readonly prayers = computed<PrayerTime[]>(() => {
    const raw = this.prayerService.todayPrayers();
    const now = this._now();
    const settings = this.settingsService.settings();
    if (!raw) return [];

    return this.buildPrayerList(raw, now, settings);
  });

  readonly countdown = computed<CountdownState>(() => {
    const list = this.prayers();
    const now = this._now();

    const next = list.find(p => p.isNext);
    const active = list.find(p => p.isActive);

    if (!next) {
      return {
        nextPrayerId: null,
        nextPrayerName: 'Fajr',
        nextPrayerNameAr: 'الفجر',
        remainingSeconds: 0,
        remainingLabel: '--:--:--',
        activePrayerId: active?.id ?? null,
      };
    }

    const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const prayerSecs = toMinutes(next.time) * 60;
    const remaining = Math.max(0, prayerSecs - nowSecs);

    return {
      nextPrayerId: next.id,
      nextPrayerName: next.name,
      nextPrayerNameAr: next.nameAr,
      remainingSeconds: remaining,
      remainingLabel: secondsToLabel(remaining),
      activePrayerId: active?.id ?? null,
    };
  });

  constructor() {
    this.timer = setInterval(() => this._now.set(new Date()), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private buildPrayerList(raw: RawPrayerEntry, now: Date, settings: any): PrayerTime[] {
    const allMeta = settings.showSunrise
      ? PRAYER_META
      : PRAYER_META.filter(p => p.id !== 'sunrise');

    const nowMins = now.getHours() * 60 + now.getMinutes();
    let lastPassedIdx = -1;
    let nextIdx = -1;

    const times: Array<{ meta: typeof PRAYER_META[0]; time: string }> = allMeta.map(meta => ({
      meta,
      time: (raw as any)[meta.id] as string,
    }));

    // Determine active and next
    for (let i = 0; i < times.length; i++) {
      const mins = toMinutes(times[i].time);
      if (mins <= nowMins) {
        lastPassedIdx = i;
      } else if (nextIdx === -1) {
        nextIdx = i;
      }
    }

    return times.map(({ meta, time }, i) => {
      const iqamaOffset: number = (settings.iqama as any)[meta.id] ?? 0;
      const iqamaTime = meta.id === 'sunrise' ? '' : addMinutes(time, iqamaOffset);

      return {
        id: meta.id,
        name: meta.name,
        nameAr: meta.nameAr,
        time,
        iqamaTime,
        isActive: i === lastPassedIdx,
        isNext: i === nextIdx,
        isPast: i < lastPassedIdx,
      };
    });
  }
}
