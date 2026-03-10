import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PrayerTime } from '../../../core/models/prayer-times.model';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-prayer-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="prayer-card"
         [class.active]="prayer.isActive"
         [class.next]="prayer.isNext"
         [class.past]="prayer.isPast && dimmPast()"
         [class.sunrise]="prayer.id === 'sunrise'">

      <div class="prayer-icon">
        <mat-icon>{{ getIcon(prayer.id) }}</mat-icon>
      </div>

      <div class="prayer-name" [class.centered]="namesInMiddle()">
        <span class="name-ar">{{ prayer.nameAr }}</span>
        <span class="name-en">{{ prayer.name }}</span>
      </div>

      <div class="prayer-time" [style.font-family]="timesFontFamily()">
        {{ formatTime(prayer.time) }}
      </div>

      @if (prayer.iqamaTime && prayer.id !== 'sunrise') {
        <div class="iqama-time">
          <span class="iqama-label">الإقامة</span>
          <span class="iqama-value" [style.font-family]="timesFontFamily()">{{ formatTime(prayer.iqamaTime) }}</span>
        </div>
      }

      @if (prayer.isActive) {
        <div class="active-indicator">
          <div class="pulse-ring"></div>
        </div>
      }

      @if (prayer.isNext) {
        <div class="next-badge">التالية</div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .prayer-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(6px, 1vh, 16px) clamp(4px, 0.5vw, 12px);
      border-radius: clamp(8px, 0.8vw, 16px);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s ease;
      gap: clamp(2px, 0.4vh, 6px);
      cursor: default;
      overflow: hidden;
      height: 100%;
    }

    .prayer-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent, rgba(0,0,0,0.2));
      border-radius: inherit;
    }

    .prayer-card.active {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(27, 94, 32, 0.4));
      border-color: #4CAF50;
      box-shadow: 0 0 20px rgba(76, 175, 80, 0.4), inset 0 0 20px rgba(76, 175, 80, 0.1);
      transform: scale(1.04);
    }

    .prayer-card.next {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.25));
      border-color: #FFC107;
      box-shadow: 0 0 15px rgba(255, 193, 7, 0.3);
    }

    .prayer-card.past {
      opacity: 0.45;
    }

    .prayer-card.sunrise {
      background: rgba(255, 200, 100, 0.08);
      border-color: rgba(255, 200, 100, 0.2);
    }

    .prayer-icon {
      color: rgba(255,255,255,0.5);
      line-height: 1;
      position: relative;
      z-index: 1;
    }

    .prayer-icon mat-icon {
      font-size: clamp(1rem, 1.5vw, 1.6rem);
    }

    .active .prayer-icon { color: #81C784; }
    .next .prayer-icon { color: #FFD54F; }
    .sunrise .prayer-icon { color: #FFCC80; }

    .prayer-name {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      position: relative;
      z-index: 1;
    }

    .prayer-name.centered {
      text-align: center;
    }

    .name-ar {
      font-size: clamp(0.9rem, 2.2vw, 1.6rem);
      font-weight: 700;
      color: #fff;
      font-family: 'Amiri', 'Andalus', serif;
    }

    .name-en {
      font-size: clamp(0.5rem, 0.9vw, 0.8rem);
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .prayer-time {
      font-size: clamp(1.4rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: #fff;
      letter-spacing: 1px;
      position: relative;
      z-index: 1;
    }

    .active .prayer-time { color: #A5D6A7; }
    .next .prayer-time { color: #FFE082; }

    .iqama-time {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2px;
      padding: clamp(2px, 0.3vh, 6px) clamp(4px, 0.5vw, 10px);
      background: rgba(0,0,0,0.25);
      border-radius: 6px;
      gap: 1px;
      position: relative;
      z-index: 1;
    }

    .iqama-label {
      font-size: clamp(0.5rem, 0.7vw, 0.7rem);
      color: rgba(255,255,255,0.4);
      font-family: 'Amiri', serif;
    }

    .iqama-value {
      font-size: clamp(0.8rem, 1.8vw, 1.2rem);
      color: rgba(255,255,255,0.75);
      font-weight: 600;
    }

    .active .iqama-value { color: #C8E6C9; }

    .active-indicator {
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 2;
    }

    .pulse-ring {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4CAF50;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(76,175,80,0.7); }
      50% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 6px rgba(76,175,80,0); }
    }

    .next-badge {
      position: absolute;
      top: 4px;
      left: 4px;
      font-size: clamp(0.45rem, 0.6vw, 0.6rem);
      background: #FFC107;
      color: #000;
      padding: 1px 4px;
      border-radius: 4px;
      font-weight: 700;
      font-family: 'Amiri', serif;
      z-index: 2;
    }
  `],
})
export class PrayerCardComponent {
  @Input({ required: true }) prayer!: PrayerTime;

  private readonly settingsService = inject(SettingsService);

  readonly dimmPast = computed(() => this.settingsService.dimmPastPrayers());
  readonly namesInMiddle = computed(() => this.settingsService.namesInMiddle());

  readonly timesFontFamily = computed(() => {
    const font = this.settingsService.fonts().timesFont;
    return `'${font}', 'Monofonto', monospace`;
  });

  formatTime(time: string): string {
    if (!time) return '--:--';
    const settings = this.settingsService.settings();

    if (settings.use24Hours) return time;

    const [h, m] = time.split(':').map(Number);
    const h12 = h % 12 || 12;
    const suffix = h < 12 ? 'ص' : 'م';
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  getIcon(id: string): string {
    const icons: Record<string, string> = {
      fajr: 'brightness_3',
      sunrise: 'wb_twilight',
      dhuhr: 'wb_sunny',
      asr: 'light_mode',
      maghrib: 'wb_twilight',
      isha: 'nights_stay',
    };
    return icons[id] ?? 'schedule';
  }
}
