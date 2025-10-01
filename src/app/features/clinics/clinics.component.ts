import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClinicService } from '../../core/services/clinic.service';
import { TranslationService } from '../../core/services/translation.service';

interface ClinicCard {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  icon: string;
  status: 'active' | 'inactive';
  color: string;
  gradient: string;
  bgPattern: string;
}

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss']
})
export class ClinicsComponent implements OnInit, AfterViewInit {
  clinics: ClinicCard[] = [];
  heroStats: { number: string; label: string }[] = [
    { number: '', label: '' },
    { number: '50+', label: '' },
    { number: '24/7', label: '' }
  ];
  floatingCards: { icon: string; text: string }[] = [
    { icon: '🏥', text: '' },
    { icon: '👨‍⚕️', text: '' },
    { icon: '🔬', text: '' }
  ];

  @ViewChildren('animateSection') animateSections!: QueryList<ElementRef>;

  constructor(
    private clinicService: ClinicService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.updateTranslations();
    this.translationService.getCurrentLanguage().subscribe(() => {
      this.updateTranslations();
    });
    console.log('ClinicsComponent initialized');
  }

  ngAfterViewInit(): void {
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
      { threshold: 0.2 }
    );

    this.animateSections.forEach((section) => {
      observer.observe(section.nativeElement);
    });
  }

  getT(key: string): string {
    return this.translationService.getStringTranslation(key);
  }

  getClinics(): ClinicCard[] {
    const clinicsData = this.translationService.getTranslation('clinics_data') as ClinicCard[];
    return clinicsData.map((clinic, index) => ({
      ...clinic,
      icon: this.getClinicIcon(clinic.id),
      color: this.getClinicColor(clinic.id),
      gradient: this.getClinicGradient(clinic.id),
      bgPattern: this.getClinicBgPattern(clinic.id)
    }));
  }

  updateTranslations(): void {
    // Update clinics data
    this.clinics = this.getClinics();

    // Update hero stats
    this.heroStats[0].number = `${this.clinics.length}+`;
    this.heroStats[0].label = this.getT('clinics-section.clinics_badge');
    this.heroStats[1].label = this.getT('clinics-section.specialized_doctors');
    this.heroStats[2].label = this.getT('clinics-section.emergency_service');

    // Update floating cards
    this.floatingCards[0].text = this.getT('clinics-section.comprehensive_care');
    this.floatingCards[1].text = this.getT('clinics-section.specialized_doctors');
    this.floatingCards[2].text = this.getT('clinics-section.advanced_tech');
  }

  getStatusText(status: string): string {
    return this.getT(`clinics-section.${status === 'active' ? 'available_now' : 'unavailable_now'}`);
  }

  navigateToClinicDetails(clinicName: string): void {
    const encodedName = encodeURIComponent(clinicName);
    this.router.navigate(['/clinics', encodedName]);
  }

  bookAppointment(clinicId: string): void {
    this.router.navigate(['/appointment'], { state: { clinicId } });
  }

  trackByClinicId(index: number, clinic: ClinicCard): string {
    return clinic.id;
  }

  private getClinicIcon(id: string): string {
    const icons: { [key: string]: string } = {
      dental: '🦷',
      pediatrics: '👶',
      orthopedics: '🦴',
      ophthalmology: '👁️',
      urology: '🚻',
      ent: '👂',
      dermatology: '✨',
      gynecology: '🤱',
      'internal-medicine': '🩺',
      laboratory: '🧪',
      radiology: '📷',
      'general-medicine': '🏨'
    };
    return icons[id] || '🏥';
  }

  private getClinicColor(id: string): string {
    const colors: { [key: string]: string } = {
      dental: '#0EA5E9',
      pediatrics: '#10B981',
      orthopedics: '#F59E0B',
      ophthalmology: '#8B5CF6',
      urology: '#0284C7',
      ent: '#EF4444',
      dermatology: '#EC4899',
      gynecology: '#F97316',
      'internal-medicine': '#3B82F6',
      laboratory: '#6EE7B7',
      radiology: '#6366F1',
      'general-medicine': '#14B8A6'
    };
    return colors[id] || '#000000';
  }

  private getClinicGradient(id: string): string {
    const gradients: { [key: string]: string } = {
      dental: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      pediatrics: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      orthopedics: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      ophthalmology: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      urology: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      ent: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      dermatology: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      gynecology: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      'internal-medicine': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      laboratory: 'linear-gradient(135deg, #6EE7B7 0%, #34D399 100%)',
      radiology: 'linear-gradient(135deg, #6366F1 0%, #4B46F1 100%)',
      'general-medicine': 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)'
    };
    return gradients[id] || 'linear-gradient(135deg, #000000 0%, #333333 100%)';
  }

  private getClinicBgPattern(id: string): string {
    return id;
  }
}
