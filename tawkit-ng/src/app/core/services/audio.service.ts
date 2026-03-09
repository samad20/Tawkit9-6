import { Injectable, inject } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly settingsService = inject(SettingsService);
  private audio: HTMLAudioElement | null = null;

  playAzan(isFajr = false): void {
    if (!this.settingsService.settings().azanByVoice) return;
    const src = isFajr ? 'assets/audio/audio_fajr.mp3' : 'assets/audio/audio_azan.mp3';
    this.play(src);
  }

  playIqama(): void {
    this.play('assets/audio/short_iqama.mp3');
  }

  playAlert(): void {
    this.play('assets/audio/1drop.wav');
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  private play(src: string): void {
    this.stop();
    this.audio = new Audio(src);
    this.audio.play().catch(() => { /* autoplay may be blocked */ });
  }
}
