import { Component, Input, Output, EventEmitter, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Country { code: string; name: string; }
interface CityEntry { code: string; name: string; }

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatListModule, MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="location-selector">
      <p class="current-label">المدينة الحالية: <strong>{{ currentCode }}</strong></p>

      <!-- Country select -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>اختر الدولة</mat-label>
        <mat-select [(ngModel)]="selectedCountry" (ngModelChange)="onCountryChange($event)">
          @for (c of countries(); track c.code) {
            <mat-option [value]="c.code">{{ c.name }}</mat-option>
          }
        </mat-select>
        <mat-icon matSuffix>public</mat-icon>
      </mat-form-field>

      <!-- City search filter -->
      @if (selectedCountry) {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>البحث عن مدينة</mat-label>
          <input matInput [(ngModel)]="cityFilter" placeholder="اكتب للبحث..." />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      }

      <!-- City list -->
      @if (loadingCities()) {
        <div class="loading-cities">
          <mat-spinner diameter="30"></mat-spinner>
          <span>جاري تحميل المدن...</span>
        </div>
      } @else if (filteredCities().length > 0) {
        <div class="city-list-container">
          <mat-nav-list class="city-list">
            @for (city of filteredCities(); track city.code) {
              <mat-list-item
                [class.selected]="currentCode === selectedCountry + '.' + city.code"
                (click)="selectCity(city.code)">
                <mat-icon matListItemIcon>location_city</mat-icon>
                <span matListItemTitle>{{ city.name }}</span>
                @if (currentCode === selectedCountry + '.' + city.code) {
                  <mat-icon matListItemMeta color="accent">check_circle</mat-icon>
                }
              </mat-list-item>
            }
          </mat-nav-list>
        </div>
      } @else if (selectedCountry) {
        <div class="no-cities">
          <mat-icon>info</mat-icon>
          <span>لا توجد مدن متاحة لهذه الدولة</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .location-selector {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .current-label {
      color: rgba(255,255,255,0.6);
      font-size: 0.8rem;
      margin: 0;
      font-family: 'Amiri', serif;
    }

    .current-label strong {
      color: #FFC107;
    }

    .full-width { width: 100%; }

    .city-list-container {
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
    }

    .city-list {
      padding: 0 !important;
    }

    mat-list-item {
      cursor: pointer;
      transition: background 0.2s;
    }

    mat-list-item:hover {
      background: rgba(255,255,255,0.08);
    }

    mat-list-item.selected {
      background: rgba(255, 193, 7, 0.15);
    }

    .loading-cities {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      color: rgba(255,255,255,0.5);
      font-family: 'Amiri', serif;
    }

    .no-cities {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      color: rgba(255,255,255,0.4);
      font-family: 'Amiri', serif;
      font-size: 0.85rem;
    }
  `],
})
export class LocationSelectorComponent implements OnInit {
  @Input() currentCode = '';
  @Output() citySelected = new EventEmitter<string>();

  private readonly http = inject(HttpClient);

  readonly countries = signal<Country[]>([]);
  readonly cities = signal<CityEntry[]>([]);
  readonly loadingCities = signal(false);

  selectedCountry = '';
  cityFilter = '';

  readonly filteredCities = computed(() => {
    const filter = this.cityFilter.toLowerCase();
    return this.cities().filter(c =>
      !filter || c.name.toLowerCase().includes(filter) || c.code.toLowerCase().includes(filter)
    );
  });

  ngOnInit(): void {
    this.loadCountries();

    // Pre-select country from current code
    if (this.currentCode) {
      const parts = this.currentCode.split('.');
      if (parts.length >= 1) {
        this.selectedCountry = parts[0];
        this.loadCities(parts[0]);
      }
    }
  }

  private loadCountries(): void {
    this.http.get<Country[]>('assets/content/countries.json').subscribe({
      next: list => this.countries.set(list),
    });
  }

  onCountryChange(code: string): void {
    this.cityFilter = '';
    this.cities.set([]);
    if (code) this.loadCities(code);
  }

  private loadCities(countryCode: string): void {
    this.loadingCities.set(true);
    // Fetch index of available cities for this country
    this.http.get<CityEntry[]>(`assets/data/${countryCode}/cities.json`).subscribe({
      next: list => {
        this.cities.set(list);
        this.loadingCities.set(false);
      },
      error: () => {
        // If no cities.json, try to discover from known cities
        this.cities.set([]);
        this.loadingCities.set(false);
      },
    });
  }

  selectCity(cityCode: string): void {
    const fullCode = `${this.selectedCountry}.${cityCode}`;
    this.citySelected.emit(fullCode);
  }
}
