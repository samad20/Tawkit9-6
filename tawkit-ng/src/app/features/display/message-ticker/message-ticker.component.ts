import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../core/models/content.model';

@Component({
  selector: 'app-message-ticker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ticker-wrapper" *ngIf="messages.length > 0">
      <div class="ticker-label">
        <span>إعلانات</span>
      </div>
      <div class="ticker-track">
        <div class="ticker-content" [style.animation-duration]="animDuration + 's'">
          @for (msg of messages; track msg.text) {
            <span class="ticker-item">{{ msg.text }}</span>
            <span class="ticker-sep">✦</span>
          }
          @for (msg of messages; track msg.text + '_dup') {
            <span class="ticker-item">{{ msg.text }}</span>
            <span class="ticker-sep">✦</span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .ticker-wrapper {
      display: flex;
      align-items: center;
      background: rgba(0,0,0,0.5);
      border-top: 1px solid rgba(255,193,7,0.3);
      overflow: hidden;
      height: clamp(30px, 4vh, 44px);
    }

    .ticker-label {
      flex-shrink: 0;
      padding: 0 clamp(8px, 1vw, 18px);
      background: linear-gradient(135deg, #F9A825, #F57F17);
      height: 100%;
      display: flex;
      align-items: center;
      font-size: clamp(0.6rem, 0.9vw, 0.8rem);
      font-family: 'Amiri', serif;
      font-weight: 700;
      color: #000;
      white-space: nowrap;
    }

    .ticker-track {
      flex: 1;
      overflow: hidden;
      position: relative;
      height: 100%;
    }

    .ticker-content {
      display: flex;
      align-items: center;
      height: 100%;
      white-space: nowrap;
      animation: tickerScroll linear infinite;
    }

    .ticker-item {
      font-size: clamp(0.7rem, 1.4vw, 1.05rem);
      color: #fff;
      font-family: 'Amiri', serif;
      padding: 0 clamp(8px, 1vw, 16px);
    }

    .ticker-sep {
      color: #FFC107;
      font-size: clamp(0.5rem, 0.7vw, 0.75rem);
    }

    @keyframes tickerScroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `],
})
export class MessageTickerComponent implements OnChanges {
  @Input() messages: Message[] = [];

  animDuration = 30;

  ngOnChanges(): void {
    const totalChars = this.messages.reduce((sum, m) => sum + m.text.length, 0);
    this.animDuration = Math.max(15, totalChars * 0.2);
  }
}
