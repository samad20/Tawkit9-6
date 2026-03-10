import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="clock-container">
      <div class="clock-time" [style.font-family]="clockFontFamily()">{{ timeDisplay() }}</div>
      <div class="clock-ampm" *ngIf="!use24Hours()">{{ ampm() }}</div>
    </div>
  `,
  styles: [`
    .clock-container {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .clock-time {
      font-size: clamp(2rem, 5vw, 4.5rem);
      font-weight: 700;
      letter-spacing: 2px;
      color: #fff;
      text-shadow: 0 0 20px rgba(255,255,255,0.3);
    }
    .clock-ampm {
      font-size: clamp(0.9rem, 1.8vw, 1.4rem);
      color: rgba(255,255,255,0.7);
      font-weight: 500;
    }
  `],
})
export class ClockComponent implements OnInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);
  private timer: ReturnType<typeof setInterval> | null = null;

  private readonly _now = signal<Date>(new Date());
  readonly use24Hours = computed(() => this.settingsService.use24Hours());

  readonly clockFontFamily = computed(() => {
    const font = this.settingsService.fonts().clockFont;
    return `'${font}', 'Monofonto', monospace`;
  });

  readonly timeDisplay = computed(() => {
    const now = this._now();
    const h24 = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    if (this.use24Hours()) {
      return `${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    } else {
      const h12 = h24 % 12 || 12;
      return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
  });

  readonly ampm = computed(() => {
    const h = this._now().getHours();
    return h < 12 ? 'AM' : 'PM';
  });

  ngOnInit(): void {
    this.timer = setInterval(() => this._now.set(new Date()), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
