export type PrayerId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface RawPrayerEntry {
  date: string;     // "DD-MM"
  fajr: string;     // "05:38"
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerTime {
  id: PrayerId;
  name: string;
  nameAr: string;
  time: string;
  iqamaTime: string;
  isActive: boolean;
  isNext: boolean;
  isPast: boolean;
}

export interface CountdownState {
  nextPrayerId: PrayerId | null;
  nextPrayerName: string;
  nextPrayerNameAr: string;
  remainingSeconds: number;
  remainingLabel: string;
  activePrayerId: PrayerId | null;
}
