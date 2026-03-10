import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SettingsService } from '../../../core/services/settings.service';
import { LocationSelectorComponent } from '../location-selector/location-selector.component';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';
import { AppSettings, AVAILABLE_FONTS } from '../../../core/models/settings.model';

const LANGUAGES = [
  { code: 'AR', name: 'العربية' },
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
  { code: 'TR', name: 'Türkçe' },
  { code: 'ID', name: 'Bahasa Indonesia' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'ES', name: 'Español' },
  { code: 'RU', name: 'Русский' },
];

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LocationSelectorComponent,
    ThemeSelectorComponent,
  ],
  template: `
    <div class="settings-dialog" dir="rtl">
      <div mat-dialog-title class="dialog-title">
        <mat-icon>settings</mat-icon>
        <span>إعدادات التطبيق</span>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <mat-tab-group animationDuration="200ms" color="accent">

          <!-- Tab 1: General -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>mosque</mat-icon>&nbsp;عام
            </ng-template>
            <div class="tab-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>اسم المسجد</mat-label>
                <input matInput [(ngModel)]="formData.mosqueName" placeholder="المسجد" />
                <mat-icon matSuffix>mosque</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>اللغة</mat-label>
                <mat-select [(ngModel)]="formData.language">
                  @for (lang of languages; track lang.code) {
                    <mat-option [value]="lang.code">{{ lang.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-divider class="divider"></mat-divider>
              <h4 class="section-title">خيارات العرض</h4>

              <div class="toggles-row">
                <mat-slide-toggle [(ngModel)]="formData.use24Hours" color="accent">
                  نظام 24 ساعة
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.useArabicDigits" color="accent">
                  أرقام عربية
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.showSunrise" color="accent">
                  إظهار وقت الشروق
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.azanByVoice" color="accent">
                  الأذان بالصوت
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.showAzkar" color="accent">
                  عرض الأذكار
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.dimmPastPrayers" color="accent">
                  تعتيم الصلوات السابقة
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.namesInMiddle" color="accent">
                  أسماء الصلوات في المنتصف
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.semiTransparentBgs" color="accent">
                  خلفيات شبه شفافة
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.counterColorAlert" color="accent">
                  تنبيه لون العد التنازلي
                </mat-slide-toggle>

                <mat-slide-toggle [(ngModel)]="formData.blackScreenInPrayer" color="accent">
                  شاشة سوداء أثناء الصلاة
                </mat-slide-toggle>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>وضع العرض</mat-label>
                <mat-select [(ngModel)]="formData.displayMode">
                  <mat-option value="horizontal">أفقي</mat-option>
                  <mat-option value="vertical">عمودي</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-tab>

          <!-- Tab 2: Location -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>location_on</mat-icon>&nbsp;المدينة
            </ng-template>
            <div class="tab-content">
              <app-location-selector
                [currentCode]="formData.cityCode"
                (citySelected)="formData.cityCode = $event">
              </app-location-selector>
            </div>
          </mat-tab>

          <!-- Tab 3: Prayer Times (Iqama) -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>access_time</mat-icon>&nbsp;الإقامة
            </ng-template>
            <div class="tab-content">
              <p class="hint-text">وقت الإقامة بعد الأذان (بالدقائق)</p>

              @for (p of prayerIqamas; track p.key) {
                <mat-form-field appearance="outline" class="iqama-field">
                  <mat-label>{{ p.label }}</mat-label>
                  <input matInput type="number" min="0" max="60"
                         [(ngModel)]="formData.iqama[p.key]" />
                  <span matSuffix>دق</span>
                </mat-form-field>
              }

              <mat-divider class="divider"></mat-divider>
              <h4 class="section-title">تعديل التوقيت</h4>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>تعديل تاريخ هجري</mat-label>
                <mat-select [(ngModel)]="formData.hijriAdjustment">
                  <mat-option [value]="-2">-2 يوم</mat-option>
                  <mat-option [value]="-1">-1 يوم</mat-option>
                  <mat-option [value]="0">بدون تعديل</mat-option>
                  <mat-option [value]="1">+1 يوم</mat-option>
                  <mat-option [value]="2">+2 يوم</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-slide-toggle [(ngModel)]="formData.inSummerAdd1Hour" color="accent">
                التوقيت الصيفي (إضافة ساعة)
              </mat-slide-toggle>
            </div>
          </mat-tab>

          <!-- Tab 4: Fonts -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>text_fields</mat-icon>&nbsp;الخطوط
            </ng-template>
            <div class="tab-content">
              <p class="hint-text">اختر الخطوط لكل جزء من العرض</p>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>خط الشاشة الرئيسي</mat-label>
                <mat-select [(ngModel)]="formData.fonts.screenFont">
                  @for (font of availableFonts; track font) {
                    <mat-option [value]="font" [style.font-family]="font">{{ font }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>خط الساعة</mat-label>
                <mat-select [(ngModel)]="formData.fonts.clockFont">
                  @for (font of availableFonts; track font) {
                    <mat-option [value]="font" [style.font-family]="font">{{ font }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>خط أوقات الصلاة</mat-label>
                <mat-select [(ngModel)]="formData.fonts.timesFont">
                  @for (font of availableFonts; track font) {
                    <mat-option [value]="font" [style.font-family]="font">{{ font }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>خط الأذكار والآيات</mat-label>
                <mat-select [(ngModel)]="formData.fonts.azkarFont">
                  @for (font of availableFonts; track font) {
                    <mat-option [value]="font" [style.font-family]="font">{{ font }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
          </mat-tab>

          <!-- Tab 5: Themes -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>palette</mat-icon>&nbsp;الثيم
            </ng-template>
            <div class="tab-content">
              <app-theme-selector
                [currentTheme]="formData.theme"
                (themeSelected)="formData.theme = $event">
              </app-theme-selector>
            </div>
          </mat-tab>

        </mat-tab-group>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button color="warn" (click)="resetDefaults()">
          <mat-icon>restore</mat-icon> إعادة الضبط
        </button>
        <span class="spacer"></span>
        <button mat-stroked-button (click)="close()">إلغاء</button>
        <button mat-raised-button color="accent" (click)="save()">
          <mat-icon>save</mat-icon> حفظ
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .settings-dialog {
      background: #1a1a2e;
      color: #fff;
      min-height: 400px;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 8px;
      font-size: 1.2rem;
      font-family: 'Amiri', serif;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .dialog-title mat-icon:first-child {
      color: #FFC107;
    }

    .close-btn {
      margin-right: auto !important;
      margin-left: 0 !important;
    }

    .dialog-content {
      padding: 0 !important;
      max-height: 65vh;
      overflow-y: auto;
    }

    .tab-content {
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .full-width {
      width: 100%;
    }

    .toggles-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 4px;
    }

    .iqama-field {
      width: calc(50% - 6px);
    }

    .section-title {
      color: #FFC107;
      margin: 0;
      font-family: 'Amiri', serif;
      font-size: 1rem;
    }

    .hint-text {
      color: rgba(255,255,255,0.5);
      font-size: 0.8rem;
      margin: 0;
      font-family: 'Amiri', serif;
    }

    .divider {
      margin: 4px 0;
      border-color: rgba(255,255,255,0.1) !important;
    }

    .dialog-actions {
      padding: 12px 20px !important;
      border-top: 1px solid rgba(255,255,255,0.1);
      gap: 8px;
    }

    .spacer { flex: 1; }
  `],
})
export class SettingsDialogComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly dialogRef = inject(MatDialogRef<SettingsDialogComponent>);
  private readonly snackBar = inject(MatSnackBar);

  readonly languages = LANGUAGES;
  readonly availableFonts = AVAILABLE_FONTS;

  readonly prayerIqamas = [
    { key: 'fajr' as const,    label: 'الفجر'  },
    { key: 'dhuhr' as const,   label: 'الظهر'  },
    { key: 'asr' as const,     label: 'العصر'  },
    { key: 'maghrib' as const, label: 'المغرب' },
    { key: 'isha' as const,    label: 'العشاء'  },
  ];

  formData: AppSettings;

  constructor() {
    const current = this.settingsService.settings();
    this.formData = {
      ...current,
      fonts: { ...current.fonts },
      iqama: { ...current.iqama },
    };
  }

  save(): void {
    this.settingsService.update(this.formData);
    this.snackBar.open('تم حفظ الإعدادات ✓', '', {
      duration: 2500,
      panelClass: 'success-snack',
      horizontalPosition: 'center',
    });
    this.dialogRef.close();
  }

  resetDefaults(): void {
    this.settingsService.reset();
    const current = this.settingsService.settings();
    this.formData = {
      ...current,
      fonts: { ...current.fonts },
      iqama: { ...current.iqama },
    };
    this.snackBar.open('تم إعادة الضبط', '', { duration: 2000 });
  }

  close(): void {
    this.dialogRef.close();
  }
}
