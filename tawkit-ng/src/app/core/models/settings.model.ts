export type LanguageCode = 'AR' | 'EN' | 'FR' | 'TR' | 'ID' | 'DE' | 'ES' | 'RU' | 'BN';
export type DisplayMode = 'horizontal' | 'vertical';

export const AVAILABLE_FONTS = [
  'Amiri', 'Andalus', 'SULTAN', 'KFGQPCUthmanTaha', 'FreeSerifBold',
  'FreeSerif', 'FreeSans', 'FreeSansBold', 'FreeMono', 'FreeMonoBold',
  'KSA', 'STC', 'FODA', 'BaradaReqa', 'HSNOmar', 'NRTReg', 'MohammadBold',
  'Monofonto',
] as const;

export type FontName = typeof AVAILABLE_FONTS[number] | string;

export interface FontSettings {
  screenFont: FontName;
  clockFont: FontName;
  timesFont: FontName;
  azkarFont: FontName;
}

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
  fonts: FontSettings;
  dimmPastPrayers: boolean;
  namesInMiddle: boolean;
  semiTransparentBgs: boolean;
  slidesActive: boolean;
  slidesViewTime: number;
  tawkitViewTime: number;
  counterColorAlert: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  mosqueName: 'إسم المسجد',
  cityCode: 'SA.MAKKAH',
  language: 'AR',
  theme: 9,
  use24Hours: false,
  useArabicDigits: false,
  displayMode: 'horizontal',
  iqama: { fajr: 20, dhuhr: 10, asr: 5, maghrib: 5, isha: 10 },
  showSunrise: true,
  showAzkar: true,
  azanByVoice: false,
  blackScreenInPrayer: true,
  inSummerAdd1Hour: false,
  hijriAdjustment: 0,
  timeOffsetMinutes: 0,
  fonts: {
    screenFont: 'Amiri',
    clockFont: 'FreeSerifBold',
    timesFont: 'FreeSerifBold',
    azkarFont: 'SULTAN',
  },
  dimmPastPrayers: false,
  namesInMiddle: true,
  semiTransparentBgs: true,
  slidesActive: true,
  slidesViewTime: 15,
  tawkitViewTime: 12,
  counterColorAlert: true,
};
