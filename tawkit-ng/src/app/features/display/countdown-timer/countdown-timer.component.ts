import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CountdownState } from '../../../core/models/prayer-times.model';

const MAX_INTERVAL_SECS = 6 * 3600; // 6 hours = max countdown interval

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="countdown-container" [class.has-active]="countdown.activePrayerId">
      <div class="countdown-label">
        <span class="label-ar">الوقت المتبقي لـ</span>
        <span class="prayer-name-ar">{{ countdown.nextPrayerNameAr }}</span>
      </div>

      <div class="countdown-display">
        <span class="countdown-time">{{ countdown.remainingLabel }}</span>
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
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 120px;
      gap: 6px;
      position: relative;
    }

    .countdown-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
    }

    .label-ar {
      font-size: 0.65rem;
      color: rgba(255,255,255,0.5);
      font-family: 'Amiri', serif;
    }

    .prayer-name-ar {
      font-size: clamp(0.9rem, 2vw, 1.3rem);
      font-weight: 700;
      color: #FFD54F;
      font-family: 'Amiri', serif;
    }

    .countdown-display {
      display: flex;
      align-items: center;
    }

    .countdown-time {
      font-size: clamp(1.4rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: #fff;
      font-family: 'Monofonto', monospace;
      letter-spacing: 2px;
      text-shadow: 0 0 15px rgba(255,255,255,0.3);
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
      font-size: 0.7rem;
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

  get progressValue(): number {
    const remaining = this.countdown.remainingSeconds;
    const pct = Math.max(0, Math.min(100, (1 - remaining / MAX_INTERVAL_SECS) * 100));
    return pct;
  }
}
