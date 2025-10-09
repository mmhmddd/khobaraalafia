import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { ClinicService } from '../../core/services/clinic.service';
import { Subscription } from 'rxjs';

// Define the Clinic interface
interface Clinic {
  id: string;
  status: 'active' | 'inactive';
}

interface ClinicCard {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  imageUrl: string;
  specialties: string[];
  color: string;
  gradient: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-clinics-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinics-section.component.html',
  styleUrls: ['./clinics-section.component.scss']
})
export class ClinicsSectionComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;
  clinics: ClinicCard[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    private clinicService: ClinicService,
    private router: Router
  ) {
    this.updateClinicsTranslations();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
        this.currentLanguage = lang;
        this.updateClinicsTranslations();
        this.updateDocumentDirection();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private updateClinicsTranslations(): void {
    const clinicsData = this.translationService.getTranslation<Clinic[]>('clinics_data');

    // Clinic styles with CDN images from Unsplash
    const clinicStyles: { [key: string]: { imageUrl: string; color: string; gradient: string } } = {
      dentistry: {
        imageUrl: '/assets/images/clinics/dentist-img.jpg',
        color: '#0EA5E9',
        gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)'
      },
      pediatrics: {
       imageUrl: '/assets/images/clinics/children-img.jpg',
        color: '#10B981',
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
      },
      urology: {
      imageUrl: '/assets/images/clinics/Urology and Reproductive Clinic.jpg',
        color: '#6B7280',
        gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
      },
          ophthalmology: {
      imageUrl: '/assets/images/clinics/eye-img.jpg',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    },
    dermatology: {
      imageUrl: '/assets/images/clinics/Dermatology & Cosmetic-img.jpg',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
    },
      orthopedics: {
      imageUrl: '/assets/images/clinics/boon-img.jpg',
        color: '#F59E0B',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
      }
    };

    this.clinics = clinicsData.map(clinic => ({
      id: clinic.id,
      name: this.getTranslation(`${clinic.id}_title`),
      nameEn: this.getTranslation(`${clinic.id}_title_en`),
      description: this.getTranslation(`${clinic.id}_description`),
      specialties: this.getSpecialties(clinic.id),
      imageUrl: clinicStyles[clinic.id]?.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      color: clinicStyles[clinic.id]?.color || '#0EA5E9',
      gradient: clinicStyles[clinic.id]?.gradient || 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      status: clinic.status
    })).slice(0, 6);
  }

  navigateToClinicDetails(clinicName: string): void {
    const encodedName = encodeURIComponent(clinicName);
    this.router.navigate(['/clinics', encodedName]);
  }

  bookAppointment(clinicId: string): void {
    console.log('Booking appointment for clinic:', clinicId);
    // Implement booking logic or navigation here
  }

  navigateToAllClinics(): void {
    this.router.navigate(['/clinics']);
  }

  getTranslation(key: string): string {
    return this.translationService.getStringTranslation(key);
  }

  getSpecialties(clinicId: string): string[] {
    const specialties = this.translationService.getTranslation<string[]>(
      `clinics-section.${clinicId}_specialties`
    );
    return Array.isArray(specialties) ? specialties : [];
  }

  private updateDocumentDirection(): void {
    const clinicsSection = document.querySelector('.clinics-section') as HTMLElement;
    const direction = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (clinicsSection) {
      clinicsSection.setAttribute('dir', direction);
    }
    document.documentElement.setAttribute('lang', this.currentLanguage);
  }

  trackByClinicId(index: number, clinic: ClinicCard): string {
    return clinic.id;
  }
}
