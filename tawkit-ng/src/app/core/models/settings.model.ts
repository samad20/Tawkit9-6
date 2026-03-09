export type LanguageCode = 'AR' | 'EN' | 'FR' | 'TR' | 'ID' | 'DE' | 'ES' | 'RU' | 'BN';
export type DisplayMode = 'horizontal' | 'vertical';

export interface IqamaSettings {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface AppSettings {
  mosqueName: string;
  cityCode: string;
  language: LanguageCode;
  theme: number;
  use24Hours: boolean;
  useArabicDigits: boolean;
  displayMode: DisplayMode;
  iqama: IqamaSettings;
  showSunrise: boolean;
  showAzkar: boolean;
  azanByVoice: boolean;
  blackScreenInPrayer: boolean;
  inSummerAdd1Hour: boolean;
  hijriAdjustment: number;
  timeOffsetMinutes: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  mosqueName: 'المسجد',
  cityCode: 'SA.MAKKAH',
  language: 'AR',
  theme: 0,
  use24Hours: false,
  useArabicDigits: false,
  displayMode: 'horizontal',
  iqama: { fajr: 20, dhuhr: 10, asr: 5, maghrib: 5, isha: 10 },
  showSunrise: true,
  showAzkar: true,
  azanByVoice: false,
  blackScreenInPrayer: false,
  inSummerAdd1Hour: false,
  hijriAdjustment: 0,
  timeOffsetMinutes: 0,
};
