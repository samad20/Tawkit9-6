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
         [class.past]="prayer.isPast"
         [class.sunrise]="prayer.id === 'sunrise'">

      <div class="prayer-icon">
        <mat-icon>{{ getIcon(prayer.id) }}</mat-icon>
      </div>

      <div class="prayer-name">
        <span class="name-ar">{{ prayer.nameAr }}</span>
        <span class="name-en">{{ prayer.name }}</span>
      </div>

      <div class="prayer-time">
        {{ formatTime(prayer.time) }}
      </div>

      @if (prayer.iqamaTime && prayer.id !== 'sunrise') {
        <div class="iqama-time">
          <span class="iqama-label">الإقامة</span>
          <span class="iqama-value">{{ formatTime(prayer.iqamaTime) }}</span>
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
    .prayer-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px 8px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s ease;
      min-width: 100px;
      gap: 4px;
      cursor: default;
      overflow: hidden;
    }

    .prayer-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent, rgba(0,0,0,0.2));
      border-radius: 12px;
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
      opacity: 0.55;
    }

    .prayer-card.sunrise {
      background: rgba(255, 200, 100, 0.08);
      border-color: rgba(255, 200, 100, 0.2);
    }

    .prayer-icon {
      color: rgba(255,255,255,0.5);
      line-height: 1;
    }

    .prayer-icon mat-icon {
      font-size: 1.2rem;
    }

    .active .prayer-icon { color: #81C784; }
    .next .prayer-icon { color: #FFD54F; }
    .sunrise .prayer-icon { color: #FFCC80; }

    .prayer-name {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
    }

    .name-ar {
      font-size: clamp(0.9rem, 2vw, 1.4rem);
      font-weight: 700;
      color: #fff;
      font-family: 'Amiri', 'Andalus', serif;
    }

    .name-en {
      font-size: clamp(0.55rem, 1vw, 0.75rem);
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .prayer-time {
      font-size: clamp(1.3rem, 3vw, 2.2rem);
      font-weight: 800;
      color: #fff;
      letter-spacing: 1px;
      font-family: 'Monofonto', monospace;
    }

    .active .prayer-time { color: #A5D6A7; }
    .next .prayer-time { color: #FFE082; }

    .iqama-time {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2px;
      padding: 4px 8px;
      background: rgba(0,0,0,0.25);
      border-radius: 6px;
      gap: 1px;
    }

    .iqama-label {
      font-size: 0.6rem;
      color: rgba(255,255,255,0.4);
      font-family: 'Amiri', serif;
    }

    .iqama-value {
      font-size: clamp(0.8rem, 1.8vw, 1.1rem);
      color: rgba(255,255,255,0.75);
      font-family: 'Monofonto', monospace;
      font-weight: 600;
    }

    .active .iqama-value { color: #C8E6C9; }

    .active-indicator {
      position: absolute;
      top: 6px;
      right: 6px;
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
      font-size: 0.55rem;
      background: #FFC107;
      color: #000;
      padding: 1px 4px;
      border-radius: 4px;
      font-weight: 700;
      font-family: 'Amiri', serif;
    }
  `],
})
export class PrayerCardComponent {
  @Input({ required: true }) prayer!: PrayerTime;

  private readonly settingsService = inject(SettingsService);

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
