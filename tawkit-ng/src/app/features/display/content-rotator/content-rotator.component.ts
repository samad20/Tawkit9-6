import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentItem } from '../../../core/models/content.model';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-content-rotator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-area">
      @if (content) {
        <div class="content-item fade-in" [class.ayat]="content.type === 'ayat'" [class.hadith]="content.type === 'hadith'">
          @if (content.type === 'ayat') {
            <div class="content-type-badge ayat-badge">
              <span>آية كريمة</span>
            </div>
          }
          @if (content.type === 'hadith') {
            <div class="content-type-badge hadith-badge">
              <span>حديث شريف</span>
            </div>
          }
          <p class="content-text" [style.font-family]="azkarFontFamily()">{{ content.text }}</p>
          @if (content.reference) {
            <span class="content-ref">{{ content.reference }}</span>
          }
        </div>
      } @else {
        <div class="content-placeholder">
          <span>بسم الله الرحمن الرحيم</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .fade-in {
      animation: fadeIn 0.8s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .content-area {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(4px, 1vh, 16px) clamp(8px, 2vw, 32px);
      position: relative;
    }

    .content-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(4px, 0.5vh, 8px);
      text-align: center;
      max-width: 90vw;
    }

    .content-type-badge {
      padding: 2px 14px;
      border-radius: 20px;
      font-size: clamp(0.55rem, 0.7vw, 0.7rem);
      font-family: 'Amiri', serif;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .ayat-badge {
      background: linear-gradient(135deg, #1565C0, #0D47A1);
      color: #fff;
      box-shadow: 0 2px 8px rgba(21, 101, 192, 0.5);
    }

    .hadith-badge {
      background: linear-gradient(135deg, #4A148C, #38006B);
      color: #fff;
      box-shadow: 0 2px 8px rgba(74, 20, 140, 0.5);
    }

    .content-text {
      font-size: clamp(1rem, 2.5vw, 2rem);
      color: #fff;
      text-shadow: 0 1px 8px rgba(0,0,0,0.6);
      line-height: 1.7;
      margin: 0;
      direction: rtl;
    }

    .ayat .content-text {
      color: #E3F2FD;
      font-size: clamp(1.1rem, 3vw, 2.2rem);
    }

    .content-ref {
      font-size: clamp(0.6rem, 0.8vw, 0.8rem);
      color: rgba(255,255,255,0.45);
      font-family: 'Amiri', serif;
    }

    .content-placeholder {
      font-size: clamp(1.2rem, 3vw, 2.4rem);
      color: rgba(255,255,255,0.4);
      font-family: 'Amiri', serif;
    }
  `],
})
export class ContentRotatorComponent {
  @Input() content: ContentItem | null = null;

  private readonly settingsService = inject(SettingsService);

  readonly azkarFontFamily = computed(() => {
    const font = this.settingsService.fonts().azkarFont;
    return `'${font}', 'KFGQPCUthmanTaha', serif`;
  });
}
