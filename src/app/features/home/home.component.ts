import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HeroSectionComponent } from '../../shared/hero-section/hero-section.component';
import { ClinicsSectionComponent } from '../../shared/clinics-section/clinics-section.component';
import { ContinousSwiperComponent } from '../../shared/continous-swiper/continous-swiper.component';
import { HomeContactComponent } from '../../shared/home-contact/home-contact.component';
import { StatsSectionComponent } from '../../shared/stats-section/stats-section.component';
import { TranslationService } from '../../core/services/translation.service';
import { DoctorsService, Doctor } from '../../core/services/doctors.service';
import { Subscription } from 'rxjs';

type Language = 'ar' | 'en';

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
  currentLanguage: Language = 'ar';
  doctors: Doctor[] = [];
  private languageSubscription: Subscription | undefined;
  private doctorsSubscription: Subscription | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    private doctorsService: DoctorsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
        this.currentLanguage = lang as Language;
        this.updateDocumentDirection();
      });

      this.doctorsSubscription = this.doctorsService.getAllDoctors().subscribe({
        next: (doctors) => {
          this.doctors = doctors.filter(doctor => doctor.image).slice(0, 5); // Limit to 5 doctors with images
        },
        error: (err) => {
          console.error('Error fetching doctors:', err);
          this.doctors = [];
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.doctorsSubscription?.unsubscribe();
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
    const newLang: Language = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguage(newLang);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }

  getDoctorName(doctor: Doctor): string {
    return this.currentLanguage === 'en' && doctor.name.en ? doctor.name.en : doctor.name.ar;
  }

  getDoctorSpecialization(doctor: Doctor): string {
    return this.currentLanguage === 'en' && doctor.specialization.en ? doctor.specialization.en : doctor.specialization.ar;
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
