import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Translation {
  [key: string]: string;
}

interface Translations {
  ar: Translation;
  en: Translation;
}

@Injectable({
  providedIn: 'root'
})
export class HomeTranslationService {
  private currentLanguage = new BehaviorSubject<string>('ar');
  private translations: Translations = {
    ar: {
      'about_title': 'من نحن',
      'about_description': 'مجمع خبراء عافية هو مركز طبي رائد يقدم خدمات صحية متكاملة بجودة عالمية. نحن ملتزمون بتحسين جودة حياة مرضانا من خلال تقديم رعاية طبية شاملة باستخدام أحدث التقنيات. فريقنا المتخصص يضمن تجربة علاجية آمنة ومريحة.',
      'about_feature_1': 'فريق طبي متخصص وذو خبرة عالية',
      'about_feature_2': 'مرافق طبية حديثة ومتطورة',
      'about_feature_3': 'رعاية شاملة تركز على المريض',
      'explore_doctors_button': 'استكشف أطباءنا',
      'book_appointment_button': 'احجز موعد',
      'medical_services_button': 'خدماتنا الطبية',
      'about_image_alt': 'مرافق طبية حديثة ومتطورة',
      'cta_title': 'استكشف أطباءنا وعيادتنا الآن',
      'cta_description': 'قم بحجز موعدك عبر موقعنا الإلكتروني واملأ جميع البيانات وسنتواصل معك. وفر وقتك!',
      'cta_button': 'احجز موعدك الآن',
      'clinics_title': 'أقسامنا وعيادتنا',
      'clinics_subtitle': 'اكتشف مجموعة واسعة من التخصصات الطبية المتاحة في مستشفانا',
      'dentistry_title': 'عيادة الأسنان',
      'dentistry_title_en': 'Dental Clinic',
      'dentistry_description': 'حشوات تجميلية بمواد أمريكية، معالجة العصب بأحدث الأجهزة، تركيبات ألمانية (إيماكس، لومينير)، تنظيف وتجميل الأسنان واللثة.',
      'pediatrics_title': 'عيادة الأطفال',
      'pediatrics_title_en': 'Pediatrics Clinic',
      'pediatrics_description': 'علاج الأمراض الصدرية، التبول اللاإرادي، تأخر النمو، حساسية الصدر، النزلات المعوية، والفحوصات المعملية للأطفال.',
      'orthopedics_title': 'عيادة جراحة العظام',
      'orthopedics_title_en': 'Orthopedics Clinic',
      'orthopedics_description': 'علاج الكسور، إصابات الملاعب، خشونة المفاصل، التهاب المفاصل الروماتويدي، هشاشة العظام، وأمراض العمود الفقري.',
      'ophthalmology_title': 'عيادة العيون',
      'ophthalmology_title_en': 'Ophthalmology Clinic',
      'ophthalmology_description': 'تشخيص المياه البيضاء والزرقاء، متابعة أمراض الشبكية، تصحيح النظر بالليزر، فحص قاع العين وقياس ضغط العين.',
      'ent_title': 'عيادة الأنف والأذن',
      'ent_title_en': 'ENT Clinic',
      'ent_description': 'علاج الصداع النصفي، مشاكل الأنف والأذن والحنجرة، وخلل وظائف التوازن باستخدام تقنيات طبية وجراحية متقدمة.',
      'dermatology_title': 'قسم الجلدية والتجميل',
      'dermatology_title_en': 'Dermatology & Cosmetics',
      'dermatology_description': 'رعاية شاملة للجلد والشعر والبشرة بأحدث التقنيات تحت إشراف د. ياسمين، مع خدمات متنوعة لنتائج مثالية.',
      'clinic_book_button': 'احجز موعدك ',
      'all_clinics_button': 'عرض جميع الأقسام',
      'available_now': 'متاح الآن',
      'available_services': 'الخدمات المتاحة',
      'more': 'المزيد',
      'more_info': 'المزيد',
      'clinic_overview': 'نبذة عن العيادة',
      'contact_us': 'تواصل معنا',
      'hero_title': 'مرحبًا بكم في مجمع خبراء عافية',
      'hero_subtitle': 'نقدم رعاية طبية شاملة بأحدث التقنيات لضمان راحتكم وسلامتكم',
      'hero_appointment_button': 'احجز موعد طبي',
      'hero_explore_button': 'استكشف خدماتنا',
      'hero_image_alt': 'فريق طبي محترف يقدم أفضل الخدمات الصحية',
      'hero_facebook_aria': 'تابعنا على فيسبوك',
      'hero_instagram_aria': 'تابعنا على إنستغرام',
      'hero_whatsapp_aria': 'تواصل معنا عبر واتساب',
      'hero_twitter_aria': 'تواصل معنا عبر تويتر',
      'contact_title': 'تواصل معنا',
      'contact_description': 'املأ النموذج أدناه وسنتواصل معك في أقرب وقت. فريقنا جاهز للإجابة!',
      'contact_name_label': 'الاسم',
      'contact_name_placeholder': 'أدخل اسمك',
      'contact_email_label': 'البريد الإلكتروني',
      'contact_email_placeholder': 'أدخل بريدك الإلكتروني',
      'contact_message_label': 'رسالتك',
      'contact_message_placeholder': 'اكتب رسالتك هنا',
      'contact_submit_button': 'إرسال',
      'contact_info_title': 'معلومات التواصل',
      'contact_address': 'الرياض - حي القادسية - طريق الامام عبدالله بن سعود 3',
      'contact_phone_1': '0551221322',
      'contact_phone_2': '0551028800',
      'contact_phone_3': '0112100329',
      'contact_email': 'khobaraalafia@gmail.com',
      'contact_hours': '24/7 - على مدار الساعة',
      'contact_map_aria': 'خريطة موقع مجمع خبراء عافية',
      'partners_title': 'شركاؤنا',
      'partner_logo_alt_1': 'شعار الشريك 1',
      'partner_logo_alt_2': 'شعار الشريك 2',
      'partner_logo_alt_3': 'شعار الشريك 3',
      'partner_logo_alt_4': 'شعار الشريك 4',
      'partner_logo_alt_5': 'شعار الشريك 5',
      'partner_logo_alt_6': 'شعار الشريك 6',
      'partner_logo_alt_7': 'شعار الشريك 7',
      'partner_logo_alt_8': 'شعار الشريك 8',
      'partner_logo_alt_9': 'شعار الشريك 9',
      'partner_logo_alt_10': 'شعار الشريك 10'
    },
    en: {
      'about_title': 'About Us',
      'about_description': 'Experts Wellness Medical Center is a leading healthcare facility offering comprehensive medical services with world-class quality. We are committed to improving our patients’ quality of life by providing holistic care using the latest technologies. Our specialized team ensures a safe and comfortable treatment experience.',
      'about_feature_1': 'Highly experienced and specialized medical team',
      'about_feature_2': 'Modern and advanced medical facilities',
      'about_feature_3': 'Patient-centered comprehensive care',
      'explore_doctors_button': 'Explore Our Doctors',
      'book_appointment_button': 'Book Appointment',
      'medical_services_button': 'Our Medical Services',
      'about_image_alt': 'Modern and advanced medical facilities',
      'cta_title': 'Explore Our Doctors and Clinics Now',
      'cta_description': 'Book your appointment through our website, fill in all the details, and we will contact you. Save your time!',
      'cta_button': 'Book Your Appointment Now',
      'clinics_title': 'Our Departments and Clinics',
      'clinics_subtitle': 'Discover a wide range of medical specialties available at our hospital',
      'dentistry_title': 'Dentistry Clinic',
      'dentistry_title_en': 'Dental Clinic',
      'dentistry_description': 'Cosmetic fillings with American materials, root canal treatment with the latest devices, German restorations (Emax, Lumineers), teeth and gum cleaning and enhancement.',
      'pediatrics_title': 'Pediatrics Clinic',
      'pediatrics_title_en': 'Pediatrics Clinic',
      'pediatrics_description': 'Treatment of respiratory diseases, bedwetting, growth delays, chest allergies, gastrointestinal issues, and laboratory tests for children.',
      'orthopedics_title': 'Orthopedic Surgery Clinic',
      'orthopedics_title_en': 'Orthopedics Clinic',
      'orthopedics_description': 'Treatment of fractures, sports injuries, joint osteoarthritis, rheumatoid arthritis, osteoporosis, and spinal disorders.',
      'ophthalmology_title': 'Ophthalmology Clinic',
      'ophthalmology_title_en': 'Ophthalmology Clinic',
      'ophthalmology_description': 'Diagnosis of cataracts and glaucoma, retinal disease monitoring, laser vision correction, fundus examination, and eye pressure measurement.',
      'ent_title': 'ENT Clinic',
      'ent_title_en': 'ENT Clinic',
      'ent_description': 'Treatment of migraines, ear, nose, and throat issues, and balance disorders using advanced medical and surgical techniques.',
      'dermatology_title': 'Dermatology and Cosmetic Department',
      'dermatology_title_en': 'Dermatology & Cosmetics',
      'dermatology_description': 'Comprehensive skin, hair, and facial care with the latest technologies under Dr. Yasmin’s supervision, offering diverse services for optimal results.',
      'clinic_book_button': 'Book Your Appointment Now',
      'all_clinics_button': 'View All Departments',
      'available_now': 'Available Now',
      'available_services': 'Available Services',
      'more': 'More',
      'more_info': 'More Info',
      'clinic_overview': 'Clinic Overview',
      'contact_us': 'Contact Us',
      'hero_title': 'Welcome to Experts Wellness Medical Center',
      'hero_subtitle': 'We provide comprehensive medical care with cutting-edge technology for your comfort and safety',
      'hero_appointment_button': 'Book a Medical Appointment',
      'hero_explore_button': 'Explore Our Services',
      'hero_image_alt': 'Professional medical team providing the best healthcare services',
      'hero_facebook_aria': 'Follow us on Facebook',
      'hero_instagram_aria': 'Follow us on Instagram',
      'hero_whatsapp_aria': 'Contact us via WhatsApp',
      'hero_twitter_aria': 'Contact us via Twitter',
      'contact_title': 'Contact Us',
      'contact_description': 'Fill out the form below, and we’ll get back to you as soon as possible. Our team is ready to assist!',
      'contact_name_label': 'Name',
      'contact_name_placeholder': 'Enter your name',
      'contact_email_label': 'Email',
      'contact_email_placeholder': 'Enter your email',
      'contact_message_label': 'Your Message',
      'contact_message_placeholder': 'Write your message here',
      'contact_submit_button': 'Send',
      'contact_info_title': 'Contact Information',
      'contact_address': 'Riyadh - Al Qadisiyah District - Imam Abdullah Bin Saud Road 3',
      'contact_phone_1': '0551221322',
      'contact_phone_2': '0551028800',
      'contact_phone_3': '0112100329',
      'contact_email': 'khobaraalafia@gmail.com',
      'contact_hours': '24/7 - Around the clock',
      'contact_map_aria': 'Map of Experts Wellness Medical Center location',
      'partners_title': 'Our Partners',
      'partner_logo_alt_1': 'Partner Logo 1',
      'partner_logo_alt_2': 'Partner Logo 2',
      'partner_logo_alt_3': 'Partner Logo 3',
      'partner_logo_alt_4': 'Partner Logo 4',
      'partner_logo_alt_5': 'Partner Logo 5',
      'partner_logo_alt_6': 'Partner Logo 6',
      'partner_logo_alt_7': 'Partner Logo 7',
      'partner_logo_alt_8': 'Partner Logo 8',
      'partner_logo_alt_9': 'Partner Logo 9',
      'partner_logo_alt_10': 'Partner Logo 10'
    }
  };

  constructor() {
    const savedLanguage = typeof localStorage !== 'undefined' ? localStorage.getItem('preferred-language') : null;
    if (savedLanguage) {
      this.currentLanguage.next(savedLanguage);
    }
  }

  getCurrentLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

  setLanguage(lang: string): void {
    if (['ar', 'en'].includes(lang)) {
      this.currentLanguage.next(lang);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('preferred-language', lang);
      }
    }
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage.value as keyof Translations][key] || key;
  }

  getCurrentLanguageValue(): string {
    return this.currentLanguage.value;
  }
}
