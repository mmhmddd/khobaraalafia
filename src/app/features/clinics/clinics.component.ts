import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClinicService } from '../../core/services/clinic.service';

interface ClinicCard {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  specialties: string[]; // Changed from services to specialties
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
export class ClinicsComponent {
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
    },
    {
      id: 'cardiology',
      name: 'عيادة القلب والأوعية الدموية',
      nameEn: 'Cardiology Clinic',
      description: 'تشخيص وعلاج أمراض القلب، قسطرة القلب، رسم القلب، إيكو القلب، ومتابعة ضغط الدم والكوليسترول بأحدث التقنيات الطبية.',
      icon: '❤️',
      specialties: ['قسطرة القلب', 'رسم القلب', 'إيكو القلب', 'متابعة ضغط الدم', 'علاج الكوليسترول'],
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
      specialties: ['أمراض الجهاز العصبي', 'علاج الصرع', 'الصداع المزمن', 'اضطرابات النوم', 'الجلطات الدماغية'],
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
      specialties: ['متابعة الحمل', 'الولادة الطبيعية', 'اضطرابات الدورة', 'الفحوصات النسائية', 'الرعاية الطارئة'],
      color: '#F97316',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      bgPattern: 'gynecology'
    },
    {
      id: 'internal-medicine',
      name: 'عيادة الباطنية',
      nameEn: 'Internal Medicine Clinic',
      description: 'تشخيص وعلاج الأمراض المزمنة مثل السكري وارتفاع ضغط الدم، اضطرابات الجهاز الهضمي، والأمراض الكلوية باستخدام أحدث الأساليب الطبية.',
      icon: '🩺',
      specialties: ['إدارة الأمراض المزمنة', 'علاج السكري', 'ارتفاع ضغط الدم', 'اضطرابات الجهاز الهضمي', 'الأمراض الكلوية'],
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      bgPattern: 'internal-medicine'
    },
    {
      id: 'laboratory',
      name: 'قسم المختبر',
      nameEn: 'Laboratory Department',
      description: 'إجراء الفحوصات المخبرية باستخدام أحدث الأجهزة لتشخيص الأمراض بدقة، بما في ذلك تحاليل الدم والبول والهرمونات.',
      icon: '🧪',
      specialties: ['تحاليل الدم', 'تحاليل البول', 'فحص الهرمونات', 'اختبارات التشخيص السريع', 'تحليل الأنسجة'],
      color: '#6EE7B7',
      gradient: 'linear-gradient(135deg, #6EE7B7 0%, #34D399 100%)',
      bgPattern: 'laboratory'
    },
    {
      id: 'radiology',
      name: 'قسم الأشعة',
      nameEn: 'Radiology Department',
      description: 'خدمات التصوير الطبي بما في ذلك الأشعة السينية، التصوير المقطعي، الرنين المغناطيسي، والموجات فوق الصوتية بأحدث التقنيات.',
      icon: '📷',
      specialties: ['الأشعة السينية', 'التصوير المقطعي', 'الرنين المغناطيسي', 'الموجات فوق الصوتية', 'تصوير الأوعية الدموية'],
      color: '#6366F1',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #4B46F1 100%)',
      bgPattern: 'radiology'
    },
    {
      id: 'general-medicine',
      name: 'عيادات الطب العام',
      nameEn: 'General Medicine Clinics',
      description: 'تقديم الرعاية الصحية الأولية، الفحوصات الروتينية، علاج الأمراض الشائعة، والإحالات إلى التخصصات عند الحاجة.',
      icon: '🏨',
      specialties: ['الرعاية الأولية', 'الفحوصات الروتينية', 'علاج الأمراض الشائعة', 'الإحالات التخصصية', 'الوقاية الصحية'],
      color: '#14B8A6',
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      bgPattern: 'general-medicine'
    }
  ];

  constructor(
    private clinicService: ClinicService,
    private router: Router
  ) {}

  navigateToClinicDetails(clinicName: string): void {
    // Navigate using the clinic name, properly encoded
    const encodedName = encodeURIComponent(clinicName);
    this.router.navigate(['/clinics', encodedName]);
  }

  bookAppointment(clinicId: string): void {
    console.log('Booking appointment for clinic:', clinicId);
    // Implement booking logic or navigation here
  }

  trackByClinicId(index: number, clinic: ClinicCard): string {
    return clinic.id;
  }
}
