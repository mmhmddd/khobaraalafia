import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicService, Clinic, ClinicDoctor } from '../../core/services/clinic.service';
import { DoctorsService, Doctor } from '../../core/services/doctors.service';
import { AuthService } from '../../core/services/auth.service';

interface ClinicCard {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  services: string[];
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
export class ClinicsComponent implements OnInit {

  clinics: ClinicCard[] = [
    {
      id: 'dental',
      name: 'عيادة الأسنان',
      nameEn: 'Dental Clinic',
      description: 'حشوات تجميلية بمواد أمريكية، معالجة العصب بأحدث الأجهزة، تركيبات ألمانية (إيماكس، لومينير)، تنظيف وتجميل الأسنان واللثة.',
      icon: '🦷',
      services: ['حشوات تجميلية', 'معالجة العصب', 'تركيبات ألمانية', 'تنظيف الأسنان', 'تجميل اللثة'],
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
      services: ['الأمراض الصدرية', 'التبول اللاإرادي', 'تأخر النمو', 'حساسية الصدر', 'الفحوصات المعملية'],
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
      services: ['علاج الكسور', 'إصابات الملاعب', 'خشونة المفاصل', 'التهاب المفاصل', 'هشاشة العظام'],
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
      services: ['المياه البيضاء والزرقاء', 'أمراض الشبكية', 'تصحيح النظر بالليزر', 'فحص قاع العين', 'قياس ضغط العين'],
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
      services: ['الصداع النصفي', 'مشاكل الأنف والحنجرة', 'خلل وظائف التوازن', 'الجراحات المتقدمة', 'العلاج الطبي'],
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      bgPattern: 'ent'
    },
    {
      id: 'dermatology',
      name: 'قسم الجلدية والتجميل',
      nameEn: 'Dermatology & Cosmetics',
      description: 'رعاية شاملة للجلد والشعر والبشرة بأحدث التقنيات تحت إشراف د. ياسمين، مع خدمات متنوعة لنتائج مثالية.',
      icon: '✨',
      services: ['رعاية الجلد', 'علاج الشعر', 'تجميل البشرة', 'أحدث التقنيات', 'استشارات متخصصة'],
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      bgPattern: 'dermatology'
    },
    {
      id: 'cardiology',
      name: 'عيادة القلب والأوعية الدموية',
      nameEn: 'Cardiology Clinic',
      description: 'تشخيص وعلاج أمراض القلب، قسطرة القلب، رسم القلب، إيكو القلب، ومتابعة ضغط الدم والكوليسترول بأحدث التقنيات الطبية.',
      icon: '❤️',
      services: ['قسطرة القلب', 'رسم القلب', 'إيكو القلب', 'متابعة ضغط الدم', 'علاج الكوليسترول'],
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      bgPattern: 'cardiology'
    },
    {
      id: 'neurology',
      name: 'عيادة الأعصاب',
      nameEn: 'Neurology Clinic',
      description: 'علاج أمراض الجهاز العصبي، الصرع، الصداع المزمن، اضطرابات النوم، والجلطات الدماغية باستخدام أحدث التقنيات التشخيصية.',
      icon: '🧠',
      services: ['أمراض الجهاز العصبي', 'علاج الصرع', 'الصداع المزمن', 'اضطرابات النوم', 'الجلطات الدماغية'],
      color: '#7C3AED',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
      bgPattern: 'neurology'
    },
    {
      id: 'gynecology',
      name: 'عيادة النساء والتوليد',
      nameEn: 'Gynecology & Obstetrics',
      description: 'رعاية صحة المرأة، متابعة الحمل والولادة، علاج اضطرابات الدورة الشهرية، والفحوصات النسائية الدورية والطارئة.',
      icon: '🤱',
      services: ['متابعة الحمل', 'الولادة الطبيعية', 'اضطرابات الدورة', 'الفحوصات النسائية', 'الرعاية الطارئة'],
      color: '#F97316',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      bgPattern: 'gynecology'
    }
  ];

  selectedClinic: ClinicCard | null = null;
  isModalOpen = false;

  constructor(
    private clinicService: ClinicService,
    private doctorsService: DoctorsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Load clinic data from service if needed
    this.loadClinicsData();
  }

  loadClinicsData(): void {
    // Integrate with your existing services
    // this.clinicService.getClinics().subscribe(clinics => {
    //   // Merge with static data if needed
    // });
  }

  openClinicDetails(clinic: ClinicCard): void {
    this.selectedClinic = clinic;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedClinic = null;
  }

  bookAppointment(clinicId: string): void {
    // Navigate to appointment booking
    console.log('Booking appointment for clinic:', clinicId);
  }

  trackByClinicId(index: number, clinic: ClinicCard): string {
    return clinic.id;
  }
}
