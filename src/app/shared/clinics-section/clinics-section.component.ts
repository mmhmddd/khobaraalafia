import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HomeTranslationService } from '../../core/services/home-translation.service';
import { ClinicService } from '../../core/services/clinic.service';
import { Subscription } from 'rxjs';

interface ClinicCard {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  specialties: string[];
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
      name: 'عيادة الأسنان',
      nameEn: 'Dental Clinic',
      description: 'حشوات تجميلية بمواد أمريكية، معالجة العصب بأحدث الأجهزة، تركيبات ألمانية (إيماكس، لومينير)، تنظيف وتجميل الأسنان واللثة.',
      icon: '🦷',
      specialties: ['حشوات تجميلية', 'معالجة العصب', 'تركيبات ألمانية', 'تنظيف الأسنان', 'تجميل اللثة'],
      color: '#0EA5E9',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      bgPattern: 'dental'
    },
    {
      id: 'pediatrics',
      name: 'عيادة الأطفال',
      nameEn: 'Pediatrics Clinic',
      description: 'علاج الأمراض الصدرية، التبول اللاإرادي، تأخر النمو، حساسية الصدر، النزلات المعوية، والفحوصات المعملية للأطفال.',
      icon: '👶',
      specialties: ['الأمراض الصدرية', 'التبول اللاإرادي', 'تأخر النمو', 'حساسية الصدر', 'الفحوصات المعملية'],
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      bgPattern: 'pediatrics'
    },
    {
      id: 'orthopedics',
      name: 'عيادة جراحة العظام',
      nameEn: 'Orthopedics Clinic',
      description: 'علاج الكسور، إصابات الملاعب، خشونة المفاصل، التهاب المفاصل الروماتويدي، هشاشة العظام، وأمراض العمود الفقري.',
      icon: '🦴',
      specialties: ['علاج الكسور', 'إصابات الملاعب', 'خشونة المفاصل', 'التهاب المفاصل', 'هشاشة العظام'],
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      bgPattern: 'orthopedics'
    },
    {
      id: 'ophthalmology',
      name: 'عيادة العيون',
      nameEn: 'Ophthalmology Clinic',
      description: 'تشخيص المياه البيضاء والزرقاء، متابعة أمراض الشبكية، تصحيح النظر بالليزر، فحص قاع العين وقياس ضغط العين.',
      icon: '👁️',
      specialties: ['المياه البيضاء والزرقاء', 'أمراض الشبكية', 'تصحيح النظر بالليزر', 'فحص قاع العين', 'قياس ضغط العين'],
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      bgPattern: 'ophthalmology'
    },
    {
      id: 'ent',
      name: 'عيادة الأنف والأذن',
      nameEn: 'ENT Clinic',
      description: 'علاج الصداع النصفي، مشاكل الأنف والأذن والحنجرة، وخلل وظائف التوازن باستخدام تقنيات طبية وجراحية متقدمة.',
      icon: '👂',
      specialties: ['الصداع النصفي', 'مشاكل الأنف والحنجرة', 'خلل وظائف التوازن', 'الجراحات المتقدمة', 'العلاج الطبي'],
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      bgPattern: 'ent'
    },
    {
      id: 'dermatology',
      name: 'عيادة الجلدية والتجميل',
      nameEn: 'Dermatology & Cosmetics',
      description: 'رعاية شاملة للجلد والشعر والبشرة بأحدث التقنيات تحت إشراف د. ياسمين، مع خدمات متنوعة لنتائج مثالية.',
      icon: '✨',
      specialties: ['رعاية الجلد', 'علاج الشعر', 'تجميل البشرة', 'أحدث التقنيات', 'استشارات متخصصة'],
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      bgPattern: 'dermatology'
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: HomeTranslationService,
    private clinicService: ClinicService,
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
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
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
