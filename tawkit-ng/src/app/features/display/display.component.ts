import { Component, inject, computed, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { SettingsService } from '../../core/services/settings.service';
import { CountdownService } from '../../core/services/countdown.service';
import { ContentService } from '../../core/services/content.service';

import { HeaderComponent } from './header/header.component';
import { PrayerCardComponent } from './prayer-card/prayer-card.component';
import { CountdownTimerComponent } from './countdown-timer/countdown-timer.component';
import { ContentRotatorComponent } from './content-rotator/content-rotator.component';
import { MessageTickerComponent } from './message-ticker/message-ticker.component';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    HeaderComponent,
    PrayerCardComponent,
    CountdownTimerComponent,
    ContentRotatorComponent,
    MessageTickerComponent,
  ],
  template: `
    <div class="display-root"
         [class.rtl]="isRTL()"
         [class.vertical-mode]="isVertical()"
         [style.background-image]="themeBg()">

      <!-- Background overlay for readability -->
      <div class="bg-overlay"></div>

      <!-- Header -->
      <app-header></app-header>

      <!-- Prayer Times Grid -->
      <section class="prayers-section">
        <div class="prayers-grid" [class.vertical-grid]="isVertical()">
          @for (prayer of prayers(); track prayer.id) {
            <app-prayer-card [prayer]="prayer"></app-prayer-card>
          }
          <app-countdown-timer [countdown]="countdown()"></app-countdown-timer>
        </div>
      </section>

      <!-- Divider -->
      <div class="section-divider"></div>

      <!-- Content Rotator (Ayat / Hadith) -->
      <section class="content-section">
        <app-content-rotator [content]="currentContent()"></app-content-rotator>
      </section>

      <!-- Message Ticker -->
      <app-message-ticker [messages]="messages()"></app-message-ticker>

      <!-- Settings FAB -->
      <button mat-mini-fab
              class="settings-fab"
              matTooltip="الإعدادات"
              (click)="openSettings()"
              [class.hidden]="!showFab()">
        <mat-icon>settings</mat-icon>
      </button>

      <!-- Loading overlay -->
      @if (loading()) {
        <div class="loading-overlay">
          <div class="loading-spinner">
            <mat-icon class="spin">sync</mat-icon>
            <span>جاري التحميل...</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .display-root {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0,0,0,0.55) 0%,
        rgba(0,0,0,0.35) 50%,
        rgba(0,0,0,0.65) 100%
      );
      z-index: 0;
    }

    app-header,
    .prayers-section,
    .content-section,
    app-message-ticker,
    .section-divider {
      position: relative;
      z-index: 1;
    }

    .prayers-section {
      padding: 12px 16px;
    }

    .prayers-grid {
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: stretch;
    }

    .prayers-grid app-prayer-card {
      flex: 1;
      min-width: 0;
    }

    .prayers-grid app-countdown-timer {
      flex-shrink: 0;
      min-width: 140px;
    }

    .vertical-grid {
      flex-direction: column;
    }

    .section-divider {
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
      margin: 0 16px;
    }

    .content-section {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 0 8px;
    }

    .settings-fab {
      position: fixed !important;
      bottom: 50px;
      left: 16px;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: rgba(30,30,30,0.9) !important;
    }

    .settings-fab:hover,
    .settings-fab:focus {
      opacity: 1 !important;
    }

    .display-root:hover .settings-fab:not(.hidden) {
      opacity: 0.6;
    }

    .display-root:hover .settings-fab:not(.hidden):hover {
      opacity: 1;
    }

    .settings-fab.hidden {
      display: none;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.6);
      z-index: 200;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #fff;
      font-family: 'Amiri', serif;
    }

    .spin {
      font-size: 3rem !important;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class DisplayComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly countdownService = inject(CountdownService);
  private readonly contentService = inject(ContentService);
  private readonly dialog = inject(MatDialog);

  readonly isRTL = computed(() => this.settingsService.isRTL());
  readonly prayers = computed(() => this.countdownService.prayers());
  readonly countdown = computed(() => this.countdownService.countdown());
  readonly currentContent = computed(() => this.contentService.currentContent());
  readonly messages = computed(() => this.contentService.todayMessages());
  readonly loading = signal(false);

  readonly themeBg = computed(() => {
    const theme = this.settingsService.theme();
    const isV = this.isVertical();
    const prefix = isV ? 'VR' : 'HR';
    return `url('assets/themes/${prefix}-${theme}.jpg')`;
  });

  readonly isVertical = computed(() => {
    const s = this.settingsService.settings();
    return s.displayMode === 'vertical';
  });

  showFab = signal(true);

  openSettings(): void {
    import('../settings/settings-dialog/settings-dialog.component').then(m => {
      this.dialog.open(m.SettingsDialogComponent, {
        width: '90vw',
        maxWidth: '800px',
        maxHeight: '90vh',
        panelClass: 'tawkit-dialog',
      });
    });
  }

  @HostListener('document:keydown.F11')
  toggleFullScreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
}
