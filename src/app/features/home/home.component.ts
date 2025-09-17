import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeroSectionComponent } from '../../shared/hero-section/hero-section.component';
import { ClinicsSectionComponent } from '../../shared/clinics-section/clinics-section.component';
import { ContinousSwiperComponent } from '../../shared/continous-swiper/continous-swiper.component';
import { HomeContactComponent } from '../../shared/home-contact/home-contact.component';
import { HomeTranslationService } from '../../core/services/home-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, ClinicsSectionComponent, ContinousSwiperComponent, HomeContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: HomeTranslationService
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
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  navigateToAppointment() {
    console.log('Navigating to appointment booking');
  }

  navigateToExplore() {
    console.log('Navigating to explore doctors/services');
  }

  navigateToAllClinics() {
    console.log('Navigating to all clinics');
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguage(newLang);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }

  private updateDocumentDirection(): void {
    const aboutSection = document.querySelector('.about-section') as HTMLElement;
    const ctaSection = document.querySelector('.cta-section') as HTMLElement;
    const direction = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (aboutSection) {
      aboutSection.setAttribute('dir', direction);
    }
    if (ctaSection) {
      ctaSection.setAttribute('dir', direction);
    }
    document.documentElement.setAttribute('lang', this.currentLanguage);
  }
}
