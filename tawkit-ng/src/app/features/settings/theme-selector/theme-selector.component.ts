import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const TOTAL_THEMES = 40;

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="theme-selector">
      <p class="selector-hint">اختر خلفية العرض</p>

      <!-- Mode toggle -->
      <div class="mode-toggle">
        <button class="mode-btn" [class.active]="previewMode() === 'HR'" (click)="setMode('HR')">
          <mat-icon>crop_landscape</mat-icon> أفقي
        </button>
        <button class="mode-btn" [class.active]="previewMode() === 'VR'" (click)="setMode('VR')">
          <mat-icon>crop_portrait</mat-icon> عمودي
        </button>
      </div>

      <div class="theme-grid">
        @for (i of themeIndices; track i) {
          <div class="theme-thumb"
               [class.selected]="currentTheme === i"
               [matTooltip]="'ثيم ' + (i + 1)"
               (click)="selectTheme(i)">
            <img
              [src]="getThumbUrl(i)"
              [alt]="'Theme ' + i"
              loading="lazy"
              (error)="onImgError($event, i)" />
            <div class="theme-num">{{ i + 1 }}</div>
            @if (currentTheme === i) {
              <div class="theme-selected-badge">
                <mat-icon>check</mat-icon>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .theme-selector {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .selector-hint {
      color: rgba(255,255,255,0.5);
      font-size: 0.8rem;
      margin: 0;
      font-family: 'Amiri', serif;
    }

    .mode-toggle {
      display: flex;
      gap: 8px;
    }

    .mode-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.2);
      background: transparent;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      font-size: 0.8rem;
      font-family: 'Amiri', serif;
      transition: all 0.2s;
    }

    .mode-btn.active {
      background: rgba(255, 193, 7, 0.2);
      border-color: #FFC107;
      color: #FFD54F;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
      max-height: 300px;
      overflow-y: auto;
    }

    .theme-thumb {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;
      aspect-ratio: 16/9;
      background: rgba(255,255,255,0.05);
    }

    .theme-thumb:hover {
      border-color: rgba(255,255,255,0.4);
      transform: scale(1.03);
    }

    .theme-thumb.selected {
      border-color: #FFC107;
      box-shadow: 0 0 12px rgba(255, 193, 7, 0.5);
    }

    .theme-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .theme-num {
      position: absolute;
      bottom: 2px;
      left: 4px;
      font-size: 0.6rem;
      color: rgba(255,255,255,0.7);
      background: rgba(0,0,0,0.5);
      padding: 1px 4px;
      border-radius: 4px;
    }

    .theme-selected-badge {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 193, 7, 0.25);
    }

    .theme-selected-badge mat-icon {
      color: #FFC107;
      font-size: 2rem !important;
    }
  `],
})
export class ThemeSelectorComponent {
  @Input() currentTheme = 0;
  @Output() themeSelected = new EventEmitter<number>();

  readonly themeIndices = Array.from({ length: TOTAL_THEMES }, (_, i) => i);
  private readonly _mode = signal<'HR' | 'VR'>('HR');
  readonly previewMode = this._mode.asReadonly();

  setMode(mode: 'HR' | 'VR'): void {
    this._mode.set(mode);
  }

  getThumbUrl(index: number): string {
    return `assets/themes/${this._mode()}-${index}.jpg`;
  }

  selectTheme(index: number): void {
    this.themeSelected.emit(index);
  }

  onImgError(event: Event, index: number): void {
    const img = event.target as HTMLImageElement;
    img.style.background = `hsl(${index * 9}, 50%, 20%)`;
    img.style.display = 'none';
  }
}
