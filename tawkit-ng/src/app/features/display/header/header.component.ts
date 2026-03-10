import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettingsService } from '../../../core/services/settings.service';
import { HijriService } from '../../../core/services/hijri.service';
import { ClockComponent } from '../clock/clock.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, ClockComponent],
  template: `
    <header class="app-header" [class.rtl]="isRTL()">
      <!-- Logo -->
      <div class="header-logo">
        <img src="assets/logo.png" alt="Logo" class="mosque-logo" (error)="onLogoError($event)" />
      </div>

      <!-- Mosque Name -->
      <div class="header-center">
        <h1 class="mosque-name" [style.font-family]="screenFontFamily()">{{ mosqueName() }}</h1>
        <div class="header-dates">
          <span class="hijri-date">{{ hijriDate() }}</span>
          <span class="date-sep">|</span>
          <span class="gregorian-date">{{ gregorianDate() }}</span>
        </div>
      </div>

      <!-- Clock -->
      <div class="header-clock">
        <app-clock></app-clock>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      padding: 1vh 2vw;
      background: rgba(0,0,0,0.45);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      gap: clamp(8px, 1.5vw, 24px);
      flex-shrink: 0;
    }

    .app-header.rtl {
      direction: rtl;
    }

    .header-logo {
      display: flex;
      align-items: center;
    }

    .mosque-logo {
      height: clamp(40px, 7vh, 80px);
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
    }

    .header-center {
      text-align: center;
    }

    .mosque-name {
      font-size: clamp(1.4rem, 4vw, 3.5rem);
      font-weight: 700;
      color: #fff;
      margin: 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      letter-spacing: 1px;
      line-height: 1.2;
    }

    .header-dates {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: clamp(6px, 1vw, 14px);
      margin-top: 2px;
    }

    .hijri-date {
      font-size: clamp(0.7rem, 1.6vw, 1.15rem);
      color: #FFD54F;
      font-family: 'Amiri', serif;
    }

    .gregorian-date {
      font-size: clamp(0.7rem, 1.6vw, 1.15rem);
      color: rgba(255,255,255,0.65);
      font-family: 'Amiri', serif;
    }

    .date-sep {
      color: rgba(255,255,255,0.3);
      font-size: 0.8rem;
    }

    .header-clock {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  `],
})
export class HeaderComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly hijriService = inject(HijriService);

  readonly mosqueName = computed(() => this.settingsService.mosqueName());
  readonly isRTL = computed(() => this.settingsService.isRTL());
  readonly hijriDate = computed(() => this.hijriService.hijriDate());
  readonly gregorianDate = computed(() => this.hijriService.gregorianDate());

  readonly screenFontFamily = computed(() => {
    const font = this.settingsService.fonts().screenFont;
    return `'${font}', 'SULTAN', serif`;
  });

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
