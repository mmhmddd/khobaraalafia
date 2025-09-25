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
export class TranslationService {
  private currentLanguage = new BehaviorSubject<string>('ar');
  private translations: Translations = {
    ar: {
      'home': 'الرئيسية',
      'about': 'من نحن',
      'appointment': 'احجز موعد',
      'doctors': 'الأطباء',
      'general_medicine': 'الطب العام',
      'specialized_departments': 'اقسام الطب الخاص',
      'obstetrics': 'قسم النساء',
      'internal_medicine': 'قسم الباطنة',
      'dentistry': 'قسم الأسنان',
      'urology': 'قسم المسالك',
      'pediatric_surgery': 'جراحة الأطفال',
      'orthopedics': 'العظام',
      'packages': 'الباقات',
      'clinics': 'العيادات',
      'contact': 'تواصل معنا',
      'login': 'تسجيل الدخول',
      'logout': 'تسجيل الخروج',
      'language_toggle': 'EN',
      'site_logo_alt': 'شعار الموقع',
      'home_page_label': 'الصفحة الرئيسية',
      'about_page_label': 'معلومات عنا',
      'appointment_page_label': 'حجز موعد طبي',
      'doctors_menu_label': 'قائمة الأطباء',
      'specialties_menu_label': 'قائمة التخصصات الطبية',
      'sub_specialties_menu_label': 'التخصصات الطبية الفرعية',
      'contact_page_label': 'صفحة التواصل',
      'language_change_to': 'تغيير اللغة إلى الإنجليزية',
      'language_changed_to_ar': 'تم تغيير اللغة إلى العربية',
      'language_changed_to_en': 'Language changed to English',
      'logout_success': 'تم تسجيل الخروج بنجاح',
      'company_name': 'مركز خبراء العافية الطبي',
      'footer_description': 'نحن نقدم أفضل الخدمات الطبية بأحدث التقنيات وفريق من الأطباء المتخصصين لضمان حصولكم على أفضل رعاية صحية ممكنة.',
      'quick_links': 'روابط سريعة',
      'medical_services': 'الخدمات الطبية',
      'contact_info': 'معلومات التواصل',
      'address_title': 'العنوان',
      'address': 'الرياض - حي القادسية - طريق الامام عبدالله بن سعود 3',
      'phone_title': 'الهاتف',
      'phone_1': '0551221322',
      'phone_2': '0551028800',
      'phone_3': '0112100329',
      'email_title': 'البريد الإلكتروني',
      'email': 'khobaraalafia@gmail.com',
      'hours_title': 'ساعات العمل',
      'hours': '24/7 - على مدار الساعة',
      'facebook': 'فيسبوك',
      'twitter': 'تويتر',
      'instagram': 'إنستغرام',
      'linkedin': 'لينكد إن',
      'whatsapp': 'واتساب',
      'newsletter_title': 'اشترك في النشرة الإخبارية',
      'newsletter_description': 'احصل على آخر الأخبار الطبية والعروض الحصرية',
      'newsletter_placeholder': 'أدخل بريدك الإلكتروني',
      'newsletter_input_label': 'البريد الإلكتروني للاشتراك',
      'newsletter_subscribe': 'اشتراك',
      'newsletter_subscribe_success': 'تم الاشتراك في النشرة الإخبارية بنجاح!',
      'all_rights_reserved': 'جميع الحقوق محفوظة',
      'privacy_policy': 'سياسة الخصوصية',
      'terms_conditions': 'الشروط والأحكام',
      'sitemap': 'خريطة الموقع',
      'back_to_top': 'العودة إلى الأعلى',
      'login_title': 'تسجيل الدخول',
      'email_label': 'البريد الإلكتروني',
      'email_placeholder': 'أدخل بريدك الإلكتروني',
      'password_label': 'كلمة المرور',
      'password_placeholder': 'أدخل كلمة المرور',
      'email_invalid': 'البريد الإلكتروني مطلوب ويجب أن يكون صالحًا',
      'password_invalid': 'كلمة المرور مطلوبة',
      'login_button': 'تسجيل الدخول',
      'forgot_password': 'نسيت كلمة المرور؟',
      'forgot_password_title': 'نسيت كلمة المرور',
      'send_reset_email': 'إرسال بريد إعادة التعيين',
      'forgot_password_success': 'تم إرسال بريد إعادة تعيين كلمة المرور. يرجى التحقق من بريدك الإلكتروني.',
      'forgot_password_failed': 'فشل إرسال بريد إعادة التعيين.',
      'reset_password_title': 'إعادة تعيين كلمة المرور',
      'new_password_label': 'كلمة المرور الجديدة',
      'new_password_placeholder': 'أدخل كلمة المرور الجديدة',
      'password_min_length': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      'reset_password_button': 'إعادة تعيين كلمة المرور',
      'reset_password_success': 'تم إعادة تعيين كلمة المرور بنجاح! يرجى تسجيل الدخول.',
      'reset_password_failed': 'فشل إعادة تعيين كلمة المرور.',
      'back_to_login': 'العودة إلى تسجيل الدخول',
      'login_success': 'تسجيل الدخول ناجح! مرحبًا، {name}',
      'login_failed': 'فشل تسجيل الدخول.',
      'register': 'إنشاء حساب',
      'register_title': 'إنشاء حساب',
      'name_label': 'الاسم',
      'name_placeholder': 'أدخل اسمك',
      'name_invalid': 'الاسم مطلوب',
      'phone_label': 'رقم الهاتف',
      'phone_placeholder': 'أدخل رقم هاتفك',
      'phone_invalid': 'رقم الهاتف مطلوب ويجب أن يكون بين 10-15 رقمًا',
      'address_label': 'العنوان',
      'address_placeholder': 'أدخل عنوانك',
      'address_invalid': 'العنوان مطلوب',
      'age_label': 'العمر',
      'age_placeholder': 'أدخل عمرك',
      'age_invalid': 'العمر مطلوب ويجب أن يكون بين 1 و120',
      'register_button': 'إنشاء حساب',
      'register_success': 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.',
      'register_failed': 'فشل إنشاء الحساب.',
      'hero_welcome': 'اهلا بكم في مركز خبراء العافية الطبي',
      'appointment_button': 'احجز موعدك مع طبيب',
      'explore_button': 'استكشف'
    },
    en: {
      'home': 'Home',
      'about': 'About Us',
      'appointment': 'Book Appointment',
      'doctors': 'Doctors',
      'general_medicine': 'General Medicine',
      'specialized_departments': 'Specialized Departments',
      'obstetrics': 'Obstetrics',
      'internal_medicine': 'Internal Medicine',
      'dentistry': 'Dentistry',
      'urology': 'Urology',
      'pediatric_surgery': 'Pediatric Surgery',
      'orthopedics': 'Orthopedics',
      'packages': 'Packages',
      'clinics': 'clinics',
      'contact': 'Contact Us',
      'login': 'Login',
      'logout': 'Logout',
      'language_toggle': 'AR',
      'site_logo_alt': 'Site Logo',
      'home_page_label': 'Home Page',
      'about_page_label': 'About Us',
      'appointment_page_label': 'Book a Medical Appointment',
      'doctors_menu_label': 'Doctors List',
      'specialties_menu_label': 'Medical Specialties List',
      'sub_specialties_menu_label': 'Sub-specialties List',
      'contact_page_label': 'Contact Page',
      'language_change_to': 'Change language to Arabic',
      'language_changed_to_ar': 'Language changed to Arabic',
      'language_changed_to_en': 'Language changed to English',
      'logout_success': 'Successfully logged out',
      'company_name': 'Experts Wellness Medical Center',
      'footer_description': 'We provide the best medical services with the latest technologies and a team of specialized doctors to ensure you receive the best possible healthcare.',
      'quick_links': 'Quick Links',
      'medical_services': 'Medical Services',
      'contact_info': 'Contact Information',
      'address_title': 'Address',
      'address': 'Riyadh - Al-Qadisiyah District - Imam Abdullah Bin Saud Road 3',
      'phone_title': 'Phone',
      'phone_1': '0551221322',
      'phone_2': '0551028800',
      'phone_3': '0112100329',
      'email_title': 'Email',
      'email': 'khobaraalafia@gmail.com',
      'hours_title': 'Working Hours',
      'hours': '24/7 - Around the Clock',
      'facebook': 'Facebook',
      'twitter': 'Twitter',
      'instagram': 'Instagram',
      'linkedin': 'LinkedIn',
      'whatsapp': 'WhatsApp',
      'newsletter_title': 'Subscribe to Our Newsletter',
      'newsletter_description': 'Get the latest medical news and exclusive offers',
      'newsletter_placeholder': 'Enter your email',
      'newsletter_input_label': 'Email for subscription',
      'newsletter_subscribe': 'Subscribe',
      'newsletter_subscribe_success': 'Successfully subscribed to the newsletter!',
      'all_rights_reserved': 'All Rights Reserved',
      'privacy_policy': 'Privacy Policy',
      'terms_conditions': 'Terms and Conditions',
      'sitemap': 'Sitemap',
      'back_to_top': 'Back to Top',
      'login_title': 'Login',
      'email_label': 'Email',
      'email_placeholder': 'Enter your email',
      'password_label': 'Password',
      'password_placeholder': 'Enter your password',
      'email_invalid': 'A valid email is required',
      'password_invalid': 'Password is required',
      'login_button': 'Login',
      'forgot_password': 'Forgot Password?',
      'forgot_password_title': 'Forgot Password',
      'send_reset_email': 'Send Reset Email',
      'forgot_password_success': 'Password reset email sent. Please check your inbox.',
      'forgot_password_failed': 'Failed to send reset email.',
      'reset_password_title': 'Reset Password',
      'new_password_label': 'New Password',
      'new_password_placeholder': 'Enter your new password',
      'password_min_length': 'Password must be at least 6 characters',
      'reset_password_button': 'Reset Password',
      'reset_password_success': 'Password reset successful! Please login.',
      'reset_password_failed': 'Failed to reset password.',
      'back_to_login': 'Back to Login',
      'login_success': 'Login successful! Welcome, {name}',
      'login_failed': 'Login failed.',
      'register': 'Create an Account',
      'register_title': 'Create an Account',
      'name_label': 'Name',
      'name_placeholder': 'Enter your name',
      'name_invalid': 'Name is required',
      'phone_label': 'Phone Number',
      'phone_placeholder': 'Enter your phone number',
      'phone_invalid': 'Valid phone number is required (10-15 digits)',
      'address_label': 'Address',
      'address_placeholder': 'Enter your address',
      'address_invalid': 'Address is required',
      'age_label': 'Age',
      'age_placeholder': 'Enter your age',
      'age_invalid': 'Valid age (1-120) is required',
      'register_button': 'Create an Account',
      'register_success': 'Registration successful! Please login.',
      'register_failed': 'Registration failed.',
      'hero_welcome': 'Welcome to Experts Wellness Medical Center',
      'appointment_button': 'Book Your Appointment',
      'explore_button': 'Explore'
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
