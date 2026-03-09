import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContentItem, Message } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class ContentService implements OnDestroy {
  private readonly http = inject(HttpClient);

  private readonly _ayats = signal<ContentItem[]>([]);
  private readonly _ahadith = signal<ContentItem[]>([]);
  private readonly _messages = signal<Message[]>([]);
  private readonly _currentIndex = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly currentContent = computed<ContentItem | null>(() => {
    const all = [...this._ayats(), ...this._ahadith()];
    if (all.length === 0) return null;
    return all[this._currentIndex() % all.length];
  });

  readonly todayMessages = computed<Message[]>(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 5=Fri
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateKey = `${month}/${day}`;

    return this._messages().filter(msg => {
      if (!msg.enabled) return false;
      if (msg.schedule === 'DAILY') return true;
      if (msg.schedule === 'JOMOA' && dayOfWeek === 5) return true;
      if (msg.schedule === dateKey) return true;
      return false;
    });
  });

  constructor() {
    this.loadContent();
    this.startRotation();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private loadContent(): void {
    this.http.get<ContentItem[]>('assets/content/ayats.json').subscribe({
      next: items => this._ayats.set(items),
    });
    this.http.get<ContentItem[]>('assets/content/ahadith.json').subscribe({
      next: items => this._ahadith.set(items),
    });
    this.http.get<Message[]>('assets/content/messages.json').subscribe({
      next: items => this._messages.set(items),
    });
  }

  private startRotation(): void {
    this.timer = setInterval(() => {
      this._currentIndex.update(i => i + 1);
    }, 30_000);
  }
}
