import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HomeTranslationService } from '../../core/services/home-translation.service';
import { Subscription } from 'rxjs';

interface ClinicCard {
  id: string;
  nameKey: string;
  nameEnKey: string;
  descriptionKey: string;
  icon: string;
  services: string[];
  color: string;
  gradient: string;
  bgPattern: string;
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

  clinics: ClinicCard[] = [
    {
      id: 'dental',
      nameKey: 'dentistry_title',
      nameEnKey: 'dentistry_title_en',
      descriptionKey: 'dentistry_description',
      icon: '🦷',
      services: ['حشوات تجميلية', 'معالجة العصب', 'تركيبات ألمانية', 'تنظيف الأسنان', 'تجميل اللثة'],
      color: '#0EA5E9',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      bgPattern: 'dental'
    },
    {
      id: 'pediatrics',
      nameKey: 'pediatrics_title',
      nameEnKey: 'pediatrics_title_en',
      descriptionKey: 'pediatrics_description',
      icon: '👶',
      services: ['الأمراض الصدرية', 'التبول اللاإرادي', 'تأخر النمو', 'حساسية الصدر', 'الفحوصات المعملية'],
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      bgPattern: 'pediatrics'
    },
    {
      id: 'orthopedics',
      nameKey: 'orthopedics_title',
      nameEnKey: 'orthopedics_title_en',
      descriptionKey: 'orthopedics_description',
      icon: '🦴',
      services: ['علاج الكسور', 'إصابات الملاعب', 'خشونة المفاصل', 'التهاب المفاصل', 'هشاشة العظام'],
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      bgPattern: 'orthopedics'
    },
    {
      id: 'ophthalmology',
      nameKey: 'ophthalmology_title',
      nameEnKey: 'ophthalmology_title_en',
      descriptionKey: 'ophthalmology_description',
      icon: '👁️',
      services: ['المياه البيضاء والزرقاء', 'أمراض الشبكية', 'تصحيح النظر بالليزر', 'فحص قاع العين', 'قياس ضغط العين'],
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      bgPattern: 'ophthalmology'
    },
    {
      id: 'ent',
      nameKey: 'ent_title',
      nameEnKey: 'ent_title_en',
      descriptionKey: 'ent_description',
      icon: '👂',
      services: ['الصداع النصفي', 'مشاكل الأنف والحنجرة', 'خلل وظائف التوازن', 'الجراحات المتقدمة', 'العلاج الطبي'],
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      bgPattern: 'ent'
    },
    {
      id: 'dermatology',
      nameKey: 'dermatology_title',
      nameEnKey: 'dermatology_title_en',
      descriptionKey: 'dermatology_description',
      icon: '✨',
      services: ['رعاية الجلد', 'علاج الشعر', 'تجميل البشرة', 'أحدث التقنيات', 'استشارات متخصصة'],
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      bgPattern: 'dermatology'
    }
  ];

  selectedClinic: ClinicCard | null = null;
  isModalOpen = false;

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

  navigateToAllClinics() {
    console.log('Navigating to all clinics');
  }

  navigateToBooking(clinicId: string) {
    console.log('Navigating to booking page for clinic:', clinicId);
  }

  openClinicDetails(clinic: ClinicCard): void {
    this.selectedClinic = clinic;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedClinic = null;
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
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
