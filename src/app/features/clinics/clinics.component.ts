import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { ClinicService } from '../../core/services/clinic.service';
import { Subscription } from 'rxjs';

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
  selector: 'app-clinics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss']
})
export class ClinicsComponent implements OnInit, OnDestroy, AfterViewInit {
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;
  clinics: ClinicCard[] = [];

  @ViewChildren('animateSection') animateSections!: QueryList<ElementRef>;

  private clinicStyles: { [key: string]: { imageUrl: string; color: string; gradient: string } } = {
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
    'general-medicine': {
      imageUrl: '/assets/images/clinics/General Medicine Clinics-img.jpg',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    },
    'internal-medicine': {
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
    },
    orthopedics: {
      imageUrl: '/assets/images/clinics/boon-img.jpg',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
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
    gynecology: {
      imageUrl: '/assets/images/clinics/Gynecology & Obstetrics.jpg',
      color: '#F97316',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
    },
    laboratory: {
      imageUrl: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80',
      color: '#6EE7B7',
      gradient: 'linear-gradient(135deg, #6EE7B7 0%, #34D399 100%)'
    },
    radiology: {
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
      color: '#6366F1',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #4B46F1 100%)'
    }
  };

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

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, index) => {
              if (entry.isIntersecting) {
                const element = entry.target as HTMLElement;
                element.classList.add('animate-in');
                element.style.setProperty('--index', index.toString());
                observer.unobserve(element);
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
          }
        );

        const sections = document.querySelectorAll('[data-animate]');
        sections.forEach((section) => {
          observer.observe(section);
        });
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private updateClinicsTranslations(): void {
    const clinicsData = this.translationService.getTranslation<Clinic[]>('clinics_data');

    this.clinics = clinicsData
      .filter(clinic => clinic.id !== 'ent')
      .map(clinic => {
        const normalizedId = clinic.id.replace('-', '_'); // Normalize hyphen to underscore
        const description = this.getTranslation(`${normalizedId}_description`);
        console.log(`Clinic: ${clinic.id}, Normalized ID: ${normalizedId}, Description: ${description}`); // Debug log
        return {
          id: clinic.id,
          name: this.getTranslation(`${normalizedId}_title`),
          nameEn: this.getTranslation(`${normalizedId}_title_en`),
          description: description,
          specialties: this.getSpecialties(clinic.id),
          imageUrl: this.clinicStyles[clinic.id]?.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
          color: this.clinicStyles[clinic.id]?.color || '#0EA5E9',
          gradient: this.clinicStyles[clinic.id]?.gradient || 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
          status: clinic.status
        };
      });
  }

  navigateToClinicDetails(clinicName: string): void {
    const encodedName = encodeURIComponent(clinicName);
    this.router.navigate(['/clinics', encodedName]);
  }

  bookAppointment(clinicId?: string): void {
    if (clinicId) {
      console.log('Booking appointment for clinic:', clinicId);
      this.router.navigate(['/appointment'], { state: { clinicId } });
    } else {
      this.router.navigate(['/booking']);
    }
  }

  contactWhatsApp(): void {
    const phoneNumber = '+1234567890';
    const message = encodeURIComponent('Hello, I would like to know more about your clinic services.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  getTranslation(key: string): string {
    const translation = this.translationService.getStringTranslation(key);
    if (translation === key) {
      console.warn(`Translation key "${key}" not found for language "${this.currentLanguage}"`);
      return ''; // Fallback to empty string
    }
    return translation;
  }

  getSpecialties(clinicId: string): string[] {
    const normalizedId = clinicId.replace('-', '_');
    const specialties = this.translationService.getTranslation<string[]>(
      `clinics-section.${normalizedId}_specialties`
    );
    return Array.isArray(specialties) ? specialties : [];
  }

  private updateDocumentDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const clinicsSection = document.querySelector('.clinics-page') as HTMLElement;
      const direction = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
      if (clinicsSection) {
        clinicsSection.setAttribute('dir', direction);
      }
      document.documentElement.setAttribute('lang', this.currentLanguage);
    }
  }

  trackByClinicId(index: number, clinic: ClinicCard): string {
    return clinic.id;
  }
}
