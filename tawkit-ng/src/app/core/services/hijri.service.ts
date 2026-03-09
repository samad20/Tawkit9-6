import { Injectable, inject, computed } from '@angular/core';
import { SettingsService } from './settings.service';

const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
];

const WEEKDAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Injectable({ providedIn: 'root' })
export class HijriService {
  private readonly settingsService = inject(SettingsService);

  readonly hijriDate = computed(() => {
    const adj = this.settingsService.settings().hijriAdjustment;
    const isAr = this.settingsService.settings().language === 'AR';
    return this.getHijriDate(new Date(), adj, isAr);
  });

  readonly gregorianDate = computed(() => {
    const isAr = this.settingsService.settings().language === 'AR';
    const now = new Date();
    const weekdays = isAr ? WEEKDAYS_AR : WEEKDAYS_EN;
    const day = weekdays[now.getDay()];
    const d = now.getDate();
    const months = isAr
      ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
      : ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const m = months[now.getMonth()];
    const y = now.getFullYear();
    return isAr ? `${day} ${d} ${m} ${y}` : `${day}, ${d} ${m} ${y}`;
  });

  private getHijriDate(date: Date, adjustment: number, isAr: boolean): string {
    // Standard Gregorian to Hijri conversion (Umm al-Qura approximation)
    const julianDay = this.gregorianToJulian(date) + adjustment;
    const hijri = this.julianToHijri(julianDay);
    const months = isAr ? HIJRI_MONTHS_AR : HIJRI_MONTHS_EN;
    const month = months[hijri.month - 1];
    return isAr
      ? `${hijri.day} ${month} ${hijri.year} هـ`
      : `${hijri.day} ${month} ${hijri.year} AH`;
  }

  private gregorianToJulian(date: Date): number {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const a = Math.floor((14 - m) / 12);
    const yr = y + 4800 - a;
    const mo = m + 12 * a - 3;
    return d + Math.floor((153 * mo + 2) / 5) + 365 * yr
      + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  }

  private julianToHijri(jd: number): { day: number; month: number; year: number } {
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor(50 * l2 / 17719)
      + Math.floor(l2 / 5670) * Math.floor(43 * l2 / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50)
      - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
    const month = Math.floor(24 * l3 / 709);
    const day = l3 - Math.floor(709 * month / 24);
    const year = 30 * n + j - 30;
    return { day, month, year };
  }
}
