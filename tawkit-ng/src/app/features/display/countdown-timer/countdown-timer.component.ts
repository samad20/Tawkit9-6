import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CountdownState } from '../../../core/models/prayer-times.model';
import { SettingsService } from '../../../core/services/settings.service';

const MAX_INTERVAL_SECS = 6 * 3600; // 6 hours = max countdown interval

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="countdown-container"
         [class.has-active]="countdown.activePrayerId"
         [class.alert-color]="counterColorAlert() && countdown.remainingSeconds < 300">

      <div class="countdown-label">
        <span class="label-ar">الوقت المتبقي لـ</span>
        <span class="prayer-name-ar">{{ countdown.nextPrayerNameAr }}</span>
      </div>

      <div class="countdown-display">
        <span class="countdown-time" [style.font-family]="clockFontFamily()">{{ countdown.remainingLabel }}</span>
      </div>

      <mat-progress-bar
        mode="determinate"
        [value]="progressValue"
        color="accent">
      </mat-progress-bar>

      @if (countdown.activePrayerId) {
        <div class="active-prayer-badge">
          <span>وقت الصلاة</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .countdown-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(8px, 1vh, 16px) clamp(8px, 1vw, 20px);
      border-radius: clamp(8px, 0.8vw, 16px);
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.1);
      gap: clamp(4px, 0.5vh, 8px);
      position: relative;
      height: 100%;
    }

    .countdown-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
    }

    .label-ar {
      font-size: clamp(0.55rem, 0.8vw, 0.75rem);
      color: rgba(255,255,255,0.5);
      font-family: 'Amiri', serif;
    }

    .prayer-name-ar {
      font-size: clamp(0.9rem, 2vw, 1.5rem);
      font-weight: 700;
      color: #FFD54F;
      font-family: 'Amiri', serif;
    }

    .countdown-display {
      display: flex;
      align-items: center;
    }

    .countdown-time {
      font-size: clamp(1.6rem, 4vw, 3.5rem);
      font-weight: 800;
      color: #fff;
      letter-spacing: 2px;
      text-shadow: 0 0 15px rgba(255,255,255,0.3);
    }

    .alert-color .countdown-time {
      color: #FF5252;
      text-shadow: 0 0 20px rgba(255,82,82,0.5);
      animation: alertPulse 1s ease-in-out infinite;
    }

    @keyframes alertPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    mat-progress-bar {
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
    }

    .active-prayer-badge {
      position: absolute;
      top: -10px;
      background: linear-gradient(135deg, #4CAF50, #2E7D32);
      padding: 2px 10px;
      border-radius: 12px;
      font-size: clamp(0.55rem, 0.7vw, 0.75rem);
      color: #fff;
      font-family: 'Amiri', serif;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(76,175,80,0.5);
      animation: fadeInDown 0.5s ease;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class CountdownTimerComponent {
  @Input({ required: true }) countdown!: CountdownState;

  private readonly settingsService = inject(SettingsService);

  readonly counterColorAlert = computed(() => this.settingsService.counterColorAlert());

  readonly clockFontFamily = computed(() => {
    const font = this.settingsService.fonts().clockFont;
    return `'${font}', 'Monofonto', monospace`;
  });

  get progressValue(): number {
    const remaining = this.countdown.remainingSeconds;
    const pct = Math.max(0, Math.min(100, (1 - remaining / MAX_INTERVAL_SECS) * 100));
    return pct;
  }
}
