import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HeroSectionComponent } from '../../shared/hero-section/hero-section.component';
import { ClinicsSectionComponent } from '../../shared/clinics-section/clinics-section.component';
import { ContinousSwiperComponent } from '../../shared/continous-swiper/continous-swiper.component';
import { HomeContactComponent } from '../../shared/home-contact/home-contact.component';
import { StatsSectionComponent } from '../../shared/stats-section/stats-section.component';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    ClinicsSectionComponent,
    ContinousSwiperComponent,
    HomeContactComponent,
    StatsSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
        this.currentLanguage = lang;
        this.updateDocumentDirection();
      });
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  navigateToAppointment(): void {
    this.router.navigate(['/appointment']);
  }

  navigateToExplore(): void {
    this.router.navigate(['/doctors']);
  }

  navigateToAllClinics(): void {
    this.router.navigate(['/clinics']);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguage(newLang);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }

  private updateDocumentDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      if (this.currentLanguage === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        htmlElement.setAttribute('lang', 'ar');
        bodyElement.classList.add('rtl');
        bodyElement.classList.remove('ltr');
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        htmlElement.setAttribute('lang', 'en');
        bodyElement.classList.add('ltr');
        bodyElement.classList.remove('rtl');
      }
    }
  }
}
