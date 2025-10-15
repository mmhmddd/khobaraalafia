import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define interfaces for data structures
interface Value {
  id: number;
  label: string;
  suffix?: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  image_alt: string;
}

interface Clinic {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  status: string;
}

interface Video {
  title: string;
  description: string;
  shortDescription: string;
}

interface Specialty {
  label: string;
}

interface VisionMissionValue {
  label: string;
  description: string;
}

interface Stat {
  label: string;
  count: number | string;
  prefix: string;
  suffix: string;
  ringOffset: number;
}

interface Translation {
  [key: string]:
    | string
    | string[]
    | Value[]
    | Clinic[]
    | Article[]
    | Video[]
    | Specialty[]
    | VisionMissionValue[]
    | Stat[]
    | Translation
    | ((count: number) => string);
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
      hero_stats_patients: 'مريض',
      hero_stats_doctors: 'طبيب',
      hero_stats_price: 'ريال',
      hero_book_appointment: 'حجز موعد الآن',
      hero_contact_us: 'تواصل معنا',
      about_section_title: 'نبذة عن العيادة',
      about_no_info: 'لا توجد معلومات متاحة',
      info_section_title: 'معلومات عنا',
      info_available_days: 'الأيام المتاحة',
      info_approximate_cost: 'التكلفة التقريبية',
      info_phone: 'رقم الهاتف',
      info_address: 'العنوان',
      info_call_now: 'اتصل الآن',
      info_view_map: 'عرض على الخريطة',
      info_unavailable: 'غير متاحة الآن',
      info_not_specified: 'غير محدد',
      doctors_section_title: 'الأطباء المتخصصون',
      doctors_section_subtitle: 'تعرف على فريقنا الطبي المتميز',
      doctor_specialization: 'التخصص',
      doctor_years_of_experience: 'سنوات الخبرة',
      doctor_email: 'البريد الإلكتروني',
      doctor_about_title: 'نبذة عن الطبيب',
      doctor_specialties_title: 'التخصصات الفرعية',
      doctor_book_appointment: 'حجز موعد',
      doctor_certified_badge: 'طبيب معتمد',
      videos_section_title: 'الفيديوهات التوضيحية',
      videos_section_subtitle: 'شاهد المزيد حول خدماتنا الطبية',
      videos_not_supported: 'عذرًا، متصفحك لا يدعم تشغيل الفيديو',
      videos_loading: 'جاري تحميل الفيديو...',
      videos_playlist_title: 'قائمة الفيديوهات',
      cta_title: 'احجز موعدك الآن',
      cta_subtitle: 'لا تتردد في التواصل معنا لحجز موعدك والحصول على أفضل رعاية طبية',
      cta_book_appointment: 'حجز موعد',
      cta_contact_us: 'تواصل معنا',
      stats_section_title: 'إحصائيات العيادة',
      stats_bookings_today: 'حجوزات اليوم',
      stats_bookings_last_7_days: 'آخر 7 أيام',
      stats_bookings_last_30_days: 'آخر 30 يوم',
      stats_total_patients: 'إجمالي المرضى',
      loading_text: 'جاري تحميل تفاصيل العيادة...',
      error_title: 'عذراً',
      error_message: 'لم يتم العثور على تفاصيل العيادة',
      error_retry: 'إعادة المحاولة',
      day_monday: 'الإثنين',
      day_tuesday: 'الثلاثاء',
      day_wednesday: 'الأربعاء',
      day_thursday: 'الخميس',
      day_friday: 'الجمعة',
      day_saturday: 'السبت',
      day_sunday: 'الأحد',
      day_all: 'كل الأيام',
      hero_stats_support: 'مواعيدنا',
      home: 'الرئيسية',
      about: 'من نحن',
      appointment: 'احجز موعد',
      doctors: 'الأطباء',
      gallery: 'معرض الصور',
      general_medicine: 'الطب العام',
      specialized_departments: 'اقسام الطب الخاص',
      obstetrics: 'قسم النساء',
      internal_medicine: 'قسم الباطنة',
      dentistry: 'قسم الأسنان',
      urology: 'قسم المسالك',
      pediatric_surgery: 'جراحة الأطفال',
      orthopedics: 'العظام',
      packages: 'الباقات',
      clinics: 'العيادات',
      contact: 'تواصل معنا',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      language_toggle: 'EN',
      site_logo_alt: 'شعار الموقع',
      home_page_label: 'الصفحة الرئيسية',
      about_page_label: 'معلومات عنا',
      appointment_page_label: 'حجز موعد طبي',
      doctors_menu_label: 'قائمة الأطباء',
      specialties_menu_label: 'قائمة التخصصات الطبية',
      sub_specialties_menu_label: 'التخصصات الطبية الفرعية',
      contact_page_label: 'صفحة التواصل',
      language_change_to: 'تغيير اللغة إلى الإنجليزية',
      language_changed_to_ar: 'تم تغيير اللغة إلى العربية',
      language_changed_to_en: 'تم تغيير اللغة إلى الإنجليزية',
      logout_success: 'تم تسجيل الخروج بنجاح',
      company_name: 'مجمع خبراء العافية الطبي',
      footer_description: 'نحن نقدم أفضل الخدمات الطبية بأحدث التقنيات وفريق من الأطباء المتخصصين لضمان حصولكم على أفضل رعاية صحية ممكنة.',
      quick_links: 'روابط سريعة',
      medical_services: 'الخدمات الطبية',
      contact_info: 'معلومات التواصل',
      address_title: 'العنوان',
      address: 'الرياض - حي القادسية - طريق الامام عبدالله بن سعود 3',
      phone_title: 'الهاتف',
      phone_1: '0551028800',
      phone_2: '0551221322',
      phone_3: '0112100329',
      email_title: 'البريد الإلكتروني',
      email: 'info@khobaraalafia.com',
      hours_title: 'ساعات العمل',
      hours: '24/7 - على مدار الساعة',
      facebook: 'فيسبوك',
      twitter: 'تويتر',
      instagram: 'إنستغرام',
      linkedin: 'لينكد إن',
      whatsapp: 'واتساب',
      newsletter_title: 'اشترك في النشرة الإخبارية',
      newsletter_description: 'احصل على آخر الأخبار الطبية والعروض الحصرية',
      newsletter_placeholder: 'أدخل بريدك الإلكتروني',
      newsletter_input_label: 'البريد الإلكتروني للاشتراك',
      newsletter_subscribe: 'اشتراك',
      newsletter_subscribe_success: 'تم الاشتراك في النشرة الإخبارية بنجاح!',
      all_rights_reserved: 'جميع الحقوق محفوظة',
      privacy_policy: 'سياسة الخصوصية',
      terms_conditions: 'الشروط والأحكام',
      sitemap: 'خريطة الموقع',
      back_to_top: 'العودة إلى الأعلى',
      login_title: 'تسجيل الدخول',
      email_label: 'البريد الإلكتروني',
      email_placeholder: 'أدخل بريدك الإلكتروني',
      password_label: 'كلمة المرور',
      password_placeholder: 'أدخل كلمة المرور',
      email_invalid: 'البريد الإلكتروني مطلوب ويجب أن يكون صالحًا',
      password_invalid: 'كلمة المرور مطلوبة',
      login_button: 'تسجيل الدخول',
      forgot_password: 'نسيت كلمة المرور؟',
      forgot_password_title: 'نسيت كلمة المرور',
      send_reset_email: 'إرسال بريد إعادة التعيين',
      forgot_password_success: 'تم إرسال بريد إعادة تعيين كلمة المرور. يرجى التحقق من بريدك الإلكتروني.',
      forgot_password_failed: 'فشل إرسال بريد إعادة التعيين.',
      reset_password_title: 'إعادة تعيين كلمة المرور',
      new_password_label: 'كلمة المرور الجديدة',
      new_password_placeholder: 'أدخل كلمة المرور الجديدة',
      password_min_length: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      reset_password_button: 'إعادة تعيين كلمة المرور',
      reset_password_success: 'تم إعادة تعيين كلمة المرور بنجاح! يرجى تسجيل الدخول.',
      reset_password_failed: 'فشل إعادة تعيين كلمة المرور.',
      back_to_login: 'العودة إلى تسجيل الدخول',
      login_success: 'تم تسجيل الدخول بنجاح! مرحبًا، {name}',
      login_failed: 'فشل تسجيل الدخول.',
      register: 'إنشاء حساب',
      register_title: 'إنشاء حساب',
      name_label: 'الاسم',
      name_placeholder: 'أدخل اسمك',
      doctors_title: 'أطباؤنا',
      name_invalid: 'الاسم مطلوب',
      phone_label: 'رقم الهاتف',
      phone_placeholder: 'أدخل رقم هاتفك',
      phone_invalid: 'رقم الهاتف مطلوب ويجب أن يكون بين 10-15 رقمًا',
      address_label: 'العنوان',
      address_placeholder: 'أدخل عنوانك',
      address_invalid: 'العنوان مطلوب',
      age_label: 'العمر',
      age_placeholder: 'أدخل عمرك',
      age_invalid: 'العمر مطلوب ويجب أن يكون بين 1 و120',
      register_button: 'إنشاء حساب',
      register_success: 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.',
      register_failed: 'فشل إنشاء الحساب.',
      hero_welcome: 'اهلا بكم في مجمع خبراء العافية الطبي',
      appointment_button: 'احجز موعدك مع طبيب',
      explore_button: 'استكشف',
      about_title: 'من نحن',
      about_description: 'مجمع خبراء العافية هو مجمع طبي رائد يقدم خدمات صحية متكاملة بجودة عالمية. نحن ملتزمون بتحسين جودة حياة مرضانا من خلال تقديم رعاية طبية شاملة باستخدام أحدث التقنيات. فريقنا المتخصص يضمن تجربة علاجية آمنة ومريحة.',
      about_feature_1: 'فريق طبي متخصص وذو خبرة عالية',
      about_feature_2: 'مرافق طبية حديثة ومتطورة',
      about_feature_3: 'رعاية شاملة تركز على المريض',
      explore_doctors_button: 'استكشف أطباءنا',
      book_appointment_button: 'احجز موعد',
      medical_services_button: 'خدماتنا الطبية',
      about_image_alt: 'مرافق طبية حديثة ومتطورة',
      cta_description: 'قم بحجز موعدك عبر موقعنا الإلكتروني واملأ جميع البيانات وسنتواصل معك. وفر وقتك!',
      cta_button: 'احجز موعدك الآن',
      doctors_section: {
        hero_subtitle: 'أطباؤنا المتميزون',
        hero_title: 'يشرفنا أن نعتني بصحتك بخبرة واهتمام.',
        hero_description: 'ابحث عن أفضل الأطباء المتخصصين لتقديم الرعاية الصحية التي تستحقها، مع خبرة وتفانٍ لضمان سلامتك.',
        hero_button: 'استكشف فريقنا',
        section_title: 'فريقنا الطبي المتميز',
        section_subtitle: 'نفخر بوجود نخبة من أفضل الأطباء المتخصصين الذين يقدمون خدمات طبية متميزة بأحدث التقنيات العالمية',
        search_placeholder: 'ابحث عن طبيب أو تخصص...',
        book_consultation: 'احجز استشارة',
        book_now: 'احجز الآن',
        book_appointment: 'حجز موعد استشارة',
        all_specialties: 'جميع التخصصات',
        years_of_experience: (count: number) => `${count}+ سنوات الخبرة`
      },
      booking_section: {
        hero_title: 'حجز موعد طبي',
        hero_description: 'احجز موعدك بسهولة في عياداتنا المتخصصة. اختر العيادة، حدد الوقت، وأكمل بياناتك في خطوات بسيطة.',
        step_1_label: 'بياناتك الشخصية',
        step_2_label: 'اختيار العيادة',
        step_3_label: 'موعد الحجز',
        step_1_title: 'بياناتك الشخصية',
        step_1_description: 'يرجى إدخال معلوماتك الشخصية بدقة',
        step_2_title: 'اختيار العيادة',
        step_2_description: 'اختر العيادة التي ترغب بحجز موعد بها',
        step_3_title: 'موعد الحجز',
        step_3_description: 'اختر التاريخ والوقت المناسبين لك',
        name_label: 'الاسم الكامل',
        name_placeholder: 'أدخل اسمك الكامل',
        email_label: 'البريد الإلكتروني',
        email_placeholder: 'أدخل بريدك الإلكتروني',
        phone_label: 'رقم الهاتف',
        phone_placeholder: 'أدخل رقم هاتفك',
        address_label: 'العنوان',
        address_placeholder: 'أدخل عنوانك',
        clinic_label: 'العيادة',
        appointment_date_label: 'تاريخ الموعد',
        appointment_time_label: 'وقت الموعد',
        previous_button: 'السابق',
        next_button: 'التالي',
        submit_button: 'تأكيد الحجز',
        load_previous_times: 'عرض السابق',
        load_more_times: 'تحميل المزيد',
        time_period_am: 'صباحًا',
        time_period_pm: 'مساءً',
        success_title: 'تم تأكيد الحجز!',
        success_message: 'شكرًا لك! لقد تم حجز موعدك بنجاح. سيتم إرسال تأكيد الحجز إلى بريدك الإلكتروني.',
        booking_number_label: 'رقم الحجز',
        confirmation_code_label: 'كود التأكيد',
        clinic_name_label: 'العيادة',
        date_label: 'التاريخ',
        time_label: 'الوقت',
        book_another_button: 'حجز موعد آخر',
        back_to_home_button: 'العودة إلى الرئيسية',
        login_required_error: 'يرجى تسجيل الدخول لحجز موعد',
        server_error: 'حدث خطأ أثناء تأكيد الحجز. حاول مرة أخرى.',
        download_booking_details: 'تحميل تفاصيل حجزك',
        screenshot_hint: 'يمكنك التقاط صورة للشاشة لحفظ تفاصيل حجزك'
      },
      media: {
        hero_badge: 'الرعاية الصحية المتميزة',
        hero_title_highlight: 'علاجات متميزة',
        hero_title_main: 'لأسلوب حياة صحي',
        hero_description: 'نقدم حلول طبية متقدمة مع فريق من الأطباء المتخصصين، باستخدام أحدث التقنيات الطبية لضمان أفضل رعاية صحية لك ولعائلتك.',
        hero_primary_button: 'عرض مقاطع الفيديو',
        hero_secondary_button: 'خدماتنا',
        stats: [
          { id: 1, label: 'عملاء سعداء', suffix: '+' },
          { id: 2, label: 'غرفة مجمع', suffix: '+' },
          { id: 3, label: 'أطباء ', suffix: '+' },
          { id: 4, label: 'سيارة إسعاف', suffix: '+' }
        ],
        floating_cards: [
          { id: 1, label: 'رعاية القلب' },
          { id: 2, label: 'حماية صحية' },
          { id: 3, label: '24/7 خدمة' }
        ],
        articles_title: 'المقالات',
        articles: [
          {
            id: 1,
            title: 'كيف تحافظ على صحة قلبك',
            description: 'تعرف على أفضل الممارسات للحفاظ على صحة القلب من خلال التغذية السليمة، التمارين الرياضية، وإدارة الإجهاد.',
            image_alt: 'صحة القلب'
          },
          {
            id: 2,
            title: 'أهمية الصحة النفسية',
            description: 'اكتشف كيف يمكن للصحة النفسية أن تؤثر على حياتك اليومية وتعلم استراتيجيات لتحسين سلامتك العقلية.',
            image_alt: 'الصحة النفسية'
          },
          {
            id: 3,
            title: 'دليل التغذية الصحية',
            description: 'نصائح عملية لتحسين نظامك الغذائي واختيار الأطعمة التي تعزز صحتك وطاقتك اليومية.',
            image_alt: 'التغذية الصحية'
          }
        ],
        article_read_more: 'اقرأ المزيد',
        article_share: 'مشاركة',
        video_not_supported: 'المتصفح الخاص بك لا يدعم تشغيل الفيديو',
        play_video: 'تشغيل الفيديو',
        pause_video: 'إيقاف الفيديو مؤقتًا',
        play: 'تشغيل',
        pause: 'إيقاف مؤقت',
        stop: 'إيقاف',
        replay: 'إعادة تشغيل',
        mute: 'كتم الصوت',
        unmute: 'تفعيل الصوت',
        fullscreen: 'شاشة كاملة',
        exit_fullscreen: 'الخروج من الشاشة الكاملة',
        playlist_title: 'قائمة الفيديوهات',
        videos_count: 'فيديو',
        autoplay: 'تشغيل تلقائي',
        repeat: (count: number) => 'تكرار الفيديو',
        video_element_missing: 'عنصر الفيديو غير متوفر',
        play_error: 'فشل في تشغيل الفيديو. يرجى المحاولة يدويًا.',
        video_load_error: 'حدث خطأ في تحميل الفيديو',
        video_format_error: 'تنسيق الفيديو غير مدعوم أو الملف غير موجود.',
        network_error: 'خطأ في الشبكة. تأكد من وجود الملف.',
        unknown_error: 'خطأ غير معروف في الفيديو.',
        videos: [
          {
            title: 'مرحباً بكم في مجمعنا الطبي المتطور',
            description: 'جولة شاملة داخل مجمعنا الطبي ومرافقه المتطورة...',
            shortDescription: 'جولة شاملة داخل مجمعنا الطبي والمرافق المتطورة'
          },
          {
            title: 'قسم الطوارئ - خدمة على مدار الساعة',
            description: 'تعرف على قسم الطوارئ المجهز بأحدث التقنيات...',
            shortDescription: 'قسم الطوارئ والخدمات العاجلة المتقدمة'
          },
          {
            title: 'عيادات التخصصات الطبية المتقدمة',
            description: 'استعراض لعياداتنا المتخصصة في مختلف المجالات الطبية...',
            shortDescription: 'العيادات المتخصصة والخدمات الطبية المتنوعة'
          },
          {
            title: 'مختبر التشخيص والتحاليل الطبية',
            description: 'جولة في مختبرنا المجهز بأحدث الأجهزة...',
            shortDescription: 'مختبر التحاليل والتشخيص المتقدم بأحدث التقنيات'
          }
        ]
      },
      'clinics-section': {
        aria_label: 'قسم العيادات - مجمع خبراء العافية الطبي',
        clinics_badge: 'عياداتنا',
        clinics_title: 'أقسامنا وعياداتنا',
        clinics_subtitle: 'اكتشف مجموعة واسعة من التخصصات الطبية المتاحة في مجمعنا',
        available_services: 'الخدمات المتاحة',
        clinic_book_button: 'احجز موعدك',
        all_clinics_button: 'عرض جميع الأقسام',
        more: 'المزيد',
        more_info: 'تفاصيل العيادة',
        available_now: 'متاح الآن',
        unavailable_now: 'غير متاح الآن',
        no_services: 'لا توجد خدمات متاحة',
        comprehensive_care: 'رعاية طبية شاملة',
        specialized_doctors: 'أطباء متخصصون',
        advanced_tech: 'تقنيات طبية متقدمة',
        emergency_service: 'خدمة الطوارئ على مدار الساعة',
        dentistry_specialties: [
          'حشوات تجميلية',
          'معالجة العصب',
          'تركيبات ألمانية',
          'تنظيف الأسنان',
          'تجميل اللثة'
        ],
        pediatrics_specialties: [
          'الأمراض الصدرية',
          'التبول اللاإرادي',
          'تأخر النمو',
          'حساسية الصدر',
          'الفحوصات المعملية'
        ],
        orthopedics_specialties: [
          'علاج الكسور',
          'إصابات الملاعب',
          'خشونة المفاصل',
          'التهاب المفاصل',
          'هشاشة العظام'
        ],
        ophthalmology_specialties: [
          'المياه البيضاء والزرقاء',
          'أمراض الشبكية',
          'تصحيح النظر بالليزر',
          'فحص قاع العين',
          'قياس ضغط العين'
        ],
        urology_specialties: [
          'علاج حصوات الكلى',
          'جراحات المسالك البولية',
          'فحوصات الجهاز التناسلي'
        ],
        ent_specialties: [
          'الصداع النصفي',
          'مشاكل الأنف والحنجرة',
          'خلل وظائف التوازن',
          'الجراحات المتقدمة',
          'العلاج الطبي'
        ],
        dermatology_specialties: [
          'رعاية الجلد',
          'علاج الشعر',
          'تجميل البشرة',
          'أحدث التقنيات',
          'استشارات متخصصة'
        ],
        gynecology_specialties: [
          'متابعة الحمل',
          'الولادة الطبيعية',
          'اضطرابات الدورة',
          'الفحوصات النسائية',
          'الرعاية الطارئة'
        ],
        internal_medicine_specialties: [
          'إدارة الأمراض المزمنة',
          'علاج السكري',
          'ارتفاع ضغط الدم',
          'اضطرابات الجهاز الهضمي',
          'الأمراض الكلوية'
        ],
        laboratory_specialties: [
          'تحاليل الدم',
          'تحاليل البول',
          'فحص الهرمونات',
          'اختبارات التشخيص السريع',
          'تحليل الأنسجة'
        ],
        radiology_specialties: [
          'الأشعة السينية',
          'التصوير المقطعي',
          'الرنين المغناطيسي',
          'الموجات فوق الصوتية',
          'تصوير الأوعية الدموية'
        ],
        general_medicine_specialties: [
          'الرعاية الأولية',
          'الفحوصات الروتينية',
          'علاج الأمراض الشائعة',
          'الإحالات التخصصية',
          'الوقاية الصحية'
        ]
      },
      clinics_data: [
        {
          id: 'dentistry',
          name: 'عيادة الأسنان',
          description: 'حشوات تجميلية بمواد أمريكية، معالجة العصب بأحدث الأجهزة، تركيبات ألمانية (إيماكس، لومينير)، تنظيف وتجميل الأسنان واللثة.',
          specialties: ['حشوات تجميلية', 'معالجة العصب', 'تركيبات ألمانية', 'تنظيف الأسنان', 'تجميل اللثة'],
          status: 'active'
        },
        {
          id: 'pediatrics',
          name: 'عيادة الأطفال',
          description: 'علاج الأمراض الصدرية، التبول اللاإرادي، تأخر النمو، حساسية الصدر، النزلات المعوية، والفحوصات المعملية للأطفال.',
          specialties: ['الأمراض الصدرية', 'التبول اللاإرادي', 'تأخر النمو', 'حساسية الصدر', 'الفحوصات المعملية'],
          status: 'active'
        },
        {
          id: 'orthopedics',
          name: 'عيادة جراحة العظام',
          description: 'علاج الكسور، إصابات الملاعب، خشونة المفاصل، التهاب المفاصل الروماتويدي، هشاشة العظام، وأمراض العمود الفقري.',
          specialties: ['علاج الكسور', 'إصابات الملاعب', 'خشونة المفاصل', 'التهاب المفاصل', 'هشاشة العظام'],
          status: 'active'
        },
        {
          id: 'ophthalmology',
          name: 'عيادة العيون',
          description: 'تشخيص المياه البيضاء والزرقاء، متابعة أمراض الشبكية، تصحيح النظر بالليزر، فحص قاع العين وقياس ضغط العين.',
          specialties: ['المياه البيضاء والزرقاء', 'أمراض الشبكية', 'تصحيح النظر بالليزر', 'فحص قاع العين', 'قياس ضغط العين'],
          status: 'inactive'
        },
        {
          id: 'urology',
          name: 'عيادة المسالك البولية والتناسلية',
          description: 'تشخيص وعلاج أمراض المسالك البولية، حصوات الكلى، اضطرابات الجهاز التناسلي، باستخدام تقنيات تشخيصية وجراحية.',
          specialties: ['علاج حصوات الكلى', 'اضطرابات البروستات', 'جراحات المسالك البولية', 'فحوصات الجهاز التناسلي'],
          status: 'active'
        },
        {
          id: 'dermatology',
          name: 'عيادة الجلدية والتجميل',
          description: 'رعاية شاملة للجلد والشعر والبشرة بأحدث التقنيات تحت إشراف د. ياسمين، مع خدمات متنوعة لنتائج مثالية.',
          specialties: ['رعاية الجلد', 'علاج الشعر', 'تجميل البشرة', 'أحدث التقنيات', 'استشارات متخصصة'],
          status: 'active'
        },
        {
          id: 'gynecology',
          name: 'عيادة النساء والتوليد',
          description: 'رعاية صحة المرأة، متابعة الحمل والولادة، علاج اضطرابات الدورة الشهرية، والفحوصات النسائية الدورية والطارئة.',
          specialties: ['متابعة الحمل', 'الولادة الطبيعية', 'اضطرابات الدورة', 'الفحوصات النسائية', 'الرعاية الطارئة'],
          status: 'active'
        },
        {
          id: 'internal-medicine',
          name: 'عيادة الباطنية',
          description: 'تشخيص وعلاج الأمراض المزمنة مثل السكري وارتفاع ضغط الدم، اضطرابات الجهاز الهضمي، والأمراض الكلوية باستخدام أحدث الأساليب الطبية.',
          specialties: ['إدارة الأمراض المزمنة', 'علاج السكري', 'ارتفاع ضغط الدم', 'اضطرابات الجهاز الهضمي', 'الأمراض الكلوية'],
          status: 'active'
        },
        {
          id: 'laboratory',
          name: 'قسم المختبر',
          description: 'إجراء الفحوصات المخبرية باستخدام أحدث الأجهزة لتشخيص الأمراض بدقة، بما في ذلك تحاليل الدم والبول والهرمونات.',
          specialties: ['تحاليل الدم', 'تحاليل البول', 'فحص الهرمونات', 'اختبارات التشخيص السريع', 'تحليل الأنسجة'],
          status: 'active'
        },
        {
          id: 'radiology',
          name: 'قسم الأشعة',
          description: 'خدمات التصوير الطبي بما في ذلك الأشعة السينية، التصوير المقطعي، الرنين المغناطيسي، والموجات فوق الصوتية بأحدث التقنيات.',
          specialties: ['الأشعة السينية', 'التصوير المقطعي', 'الرنين المغناطيسي', 'الموجات فوق الصوتية', 'تصوير الأوعية الدموية'],
          status: 'active'
        },
        {
          id: 'general-medicine',
          name: 'عيادات الطب العام',
          description: 'تقديم الرعاية الصحية الأولية، الفحوصات الروتينية، علاج الأمراض الشائعة، والإحالات إلى التخصصات عند الحاجة.',
          specialties: ['الرعاية الأولية', 'الفحوصات الروتينية', 'علاج الأمراض الشائعة', 'الإحالات التخصصية', 'الوقاية الصحية'],
          status: 'active'
        }
      ],
      dentistry_title: 'عيادة الأسنان',
      dentistry_title_en: 'Dentistry',
      dentistry_description: 'حشوات تجميلية بمواد أمريكية، معالجة العصب بأحدث الأجهزة، تركيبات ألمانية (إيماكس، لومينير)، تنظيف وتجميل الأسنان واللثة.',
      pediatrics_title: 'عيادة الأطفال',
      pediatrics_title_en: 'Pediatrics',
      pediatrics_description: 'علاج الأمراض الصدرية، التبول اللاإرادي، تأخر النمو، حساسية الصدر، النزلات المعوية، والفحوصات المعملية للأطفال.',
      orthopedics_title: 'عيادة جراحة العظام',
      orthopedics_title_en: 'Orthopedics',
      orthopedics_description: 'علاج الكسور، إصابات الملاعب، خشونة المفاصل، التهاب المفاصل الروماتويدي، هشاشة العظام، وأمراض العمود الفقري.',
      ophthalmology_title: 'عيادة العيون',
      ophthalmology_title_en: 'Ophthalmology',
      ophthalmology_description: 'تشخيص المياه البيضاء والزرقاء، متابعة أمراض الشبكية، تصحيح النظر بالليزر، فحص قاع العين وقياس ضغط العين.',
      ent_title: 'عيادة الأنف والأذن والحنجرة',
      ent_title_en: 'ENT',
      ent_description: 'علاج الصداع النصفي، مشاكل الأنف والأذن والحنجرة، وخلل وظائف التوازن باستخدام تقنيات طبية وجراحية متقدمة.',
      dermatology_title: 'عيادة الجلدية والتجميل',
      dermatology_title_en: 'Dermatology & Cosmetics',
      dermatology_description: 'رعاية شاملة للجلد والشعر والبشرة بأحدث التقنيات تحت إشراف د. ياسمين، مع خدمات متنوعة لنتائج مثالية.',
      urology_title: 'عيادة المسالك البولية والتناسلية',
      urology_title_en: 'Urology',
      urology_description: 'تشخيص وعلاج أمراض المسالك البولية، حصوات الكلى، العقم، اضطرابات الجهاز التناسلي، باستخدام تقنيات تشخيصية وجراحية متطورة.',
      gynecology_title: 'عيادة النساء والتوليد',
      gynecology_title_en: 'Gynecology & Obstetrics',
      gynecology_description: 'رعاية صحة المرأة، متابعة الحمل والولادة، علاج اضطرابات الدورة الشهرية، والفحوصات النسائية الدورية والطارئة.',
      internal_medicine_title: 'عيادة الباطنية',
      internal_medicine_title_en: 'Internal Medicine',
      internal_medicine_description: 'تشخيص وعلاج الأمراض المزمنة مثل السكري وارتفاع ضغط الدم، اضطرابات الجهاز الهضمي، والأمراض الكلوية باستخدام أحدث الأساليب الطبية.',
      laboratory_title: 'قسم المختبر',
      laboratory_title_en: 'Laboratory',
      laboratory_description: 'إجراء الفحوصات المخبرية باستخدام أحدث الأجهزة لتشخيص الأمراض بدقة، بما في ذلك تحاليل الدم والبول والهرمونات.',
      radiology_title: 'قسم الأشعة',
      radiology_title_en: 'Radiology',
      radiology_description: 'خدمات التصوير الطبي بما في ذلك الأشعة السينية، التصوير المقطعي، الرنين المغناطيسي، والموجات فوق الصوتية بأحدث التقنيات.',
      general_medicine_title: 'عيادات الطب العام',
      general_medicine_title_en: 'General Medicine',
      general_medicine_description: 'تقديم الرعاية الصحية الأولية، الفحوصات الروتينية، علاج الأمراض الشائعة، والإحالات إلى التخصصات عند الحاجة.',
      clinic_book_button: 'احجز موعدك',
      all_clinics_button: 'عرض جميع الأقسام',
      available_now: 'متاح الآن',
      available_services: 'الخدمات المتاحة',
      more: 'المزيد',
      doctor_sub_specialties: 'التخصصات الفرعية',
      more_info: 'المزيد',
      clinic_overview: 'نبذة عن العيادة',
      contact_us: 'تواصل معنا',
      hero_title: 'مرحبًا بكم في مجمع خبراء العافية',
      hero_subtitle: 'نقدم رعاية طبية شاملة بأحدث التقنيات لضمان راحتكم وسلامتكم',
      hero_appointment_button: 'احجز موعد طبي',
      hero_explore_button: 'استكشف أطبائنا',
      hero_image_alt: 'فريق طبي محترف يقدم أفضل الخدمات الصحية',
      hero_facebook_aria: 'تابعنا على فيسبوك',
      hero_instagram_aria: 'تابعنا على إنستغرام',
      hero_whatsapp_aria: 'تواصل معنا عبر واتساب',
      hero_twitter_aria: 'تواصل معنا عبر تويتر',
      contact_title: 'تواصل معنا',
      contact_description: 'املأ النموذج أدناه وسنتواصل معك في أقرب وقت. فريقنا جاهز للإجابة!',
      contact_name_label: 'الاسم',
      contact_name_placeholder: 'أدخل اسمك',
      contact_email_label: 'البريد الإلكتروني',
      contact_email_placeholder: 'أدخل بريدك الإلكتروني',
      contact_message_label: 'رسالتك',
      contact_message_placeholder: 'اكتب رسالتك هنا',
      contact_submit_button: 'إرسال',
      contact_info_title: 'معلومات التواصل',
      contact_address: 'الرياض - حي القادسية - طريق الامام عبدالله بن سعود 3',
      contact_phone_1: '0551221322',
      contact_phone_2: '0551028800',
      contact_phone_3: '0112100329',
      contact_email: 'info@khobaraalafia.com',
      contact_hours: '24/7 - على مدار الساعة',
      contact_map_aria: 'خريطة موقع مجمع خبراء العافية',
      partners_title: 'شركات التأمين',
      'partners-section': {
        partners_title: 'متعاقدين مع جميع شركات التأمين الطبي',
        partners_subtitle: 'نفخر بشراكاتنا مع مؤسسات رائدة لتعزيز الابتكار والجودة في الرعاية الصحية'
      },
      partner_logo_alt_1: 'شعار الشريك 1',
      partner_logo_alt_2: 'شعار الشريك 2',
      partner_logo_alt_3: 'شعار الشريك 3',
      partner_logo_alt_4: 'شعار الشريك 4',
      partner_logo_alt_5: 'شعار الشريك 5',
      partner_logo_alt_6: 'شعار الشريك 6',
      partner_logo_alt_7: 'شعار الشريك 7',
      partner_logo_alt_8: 'شعار الشريك 8',
      partner_logo_alt_9: 'شعار الشريك 9',
      partner_logo_alt_10: 'شعار الشريك 10',
      hero_section: {
        aria_label: 'قسم البطل - من نحن',
        badge: 'مجمع طبي متخصص',
        title_main: 'مجمع خبراء العافية الطبي',
        title_sub: 'رعاية صحية متميزة',
        description: 'نقدم خدمات طبية شاملة بجودة عالية واهتمام شخصي لكل مريض، مع فريق من الأطباء المؤهلين وأحدث التقنيات الطبية.',
        book_appointment_button: 'احجز موعدك الآن',
        explore_services_button: 'اكتشف خدماتنا',
        stats: {
          patients: 'مريض راضي',
          doctors: 'طبيب متخصص',
          support: 'دعم طبي'
        },
        socials: {
          facebook_aria: 'فيسبوك',
          twitter_aria: 'تويتر',
          instagram_aria: 'إنستغرام',
          linkedin_aria: 'لينكد إن'
        },
        logo_alt: 'شعار مجمع خبراء العافية الطبي'
      },
      about_intro: {
        aria_label: 'مقدمة عن المركز',
        badge: 'من نحن',
        title: 'مقدمة عن مجمع خبراء العافية الطبي',
        description_1: 'مجمع خبراء العافية الطبي هو مؤسسة رائدة في تقديم الرعاية الصحية الشاملة، ملتزمون بتوفير خدمات طبية متميزة باستخدام أحدث التقنيات والمعدات الطبية المتطورة، مع الحرص الدائم على اتباع أعلى معايير الجودة العالمية في التشخيص والعلاج. نحن نؤمن أن الصحة هي الركيزة الأساسية لحياة أفضل، ولذلك نضع على عاتقنا مسؤولية تقديم رعاية متكاملة وشاملة لمرضانا في بيئة مريحة وآمنة.',
        description_2: 'نهدف إلى تعزيز صحة المجتمع من خلال فريق من الأطباء المؤهلين تأهيلاً عالياً وبرامج صحية مصممة خصيصاً لتلبية احتياجات كل فرد، مع التركيز على الرعاية الشخصية والاهتمام بكل تفاصيل رحلة العلاج. كما نحرص على تقديم التوعية الصحية، وتشجيع المرضى على اتباع أنماط حياة صحية مستدامة، ليكون مجمع خبراء العافية الطبي شريكاً دائماً في تحسين نوعية الحياة ودعم الصحة العامة على المدى الطويل.',
        features: {
          service_24_7: {
            title: 'خدمة 24/7',
            description: 'نقدم خدمات طبية على مدار الساعة لضمان راحتك وسلامتك في أي وقت'
          },
          best_doctors: {
            title: 'أفضل الأطباء',
            description: 'فريق من الأطباء ذوي الخبرة والكفاءة العالية لتقديم أفضل رعاية ممكنة'
          },
          integrated_care: {
            title: 'رعاية متكاملة',
            description: 'برامج صحية شاملة مصممة لتلبية جميع احتياجاتك الصحية'
          },
          safety_trust: {
            title: 'أمان وثقة',
            description: 'نلتزم بأعلى معايير الأمان والجودة في جميع خدماتنا الطبية'
          }
        }
      },
      vision_mission: {
        aria_label: 'رؤيتنا ورسالتنا',
        badge: 'رؤيتنا',
        title: 'رؤيتنا ورسالتنا',
        description: 'نطمح أن نكون الخيار الأول للرعاية الصحية في المنطقة، مع التزامنا بتقديم خدمات طبية مبتكرة وشاملة تركز على المريض.',
        vision: {
          title: 'رؤيتنا',
          description: 'أن نكون مجمعًا طبيًا رائدًا يوفر رعاية صحية عالمية المستوى، مع التركيز على الابتكار والجودة.'
        },
        mission: {
          title: 'رسالتنا',
          description: 'تقديم خدمات طبية شاملة ومتكاملة باستخدام أحدث التقنيات لتحسين جودة حياة مرضانا.'
        },
        values_title: 'قيمنا',
        values: [
          { label: 'التميز', description: 'نسعى للريادة في كل ما نقدمه، من الخدمات الطبية إلى تجربة المريض.' },
          { label: 'الجودة', description: 'نلتزم بتقديم خدمات طبية عالية الجودة واتباع معايير سباهي لضمان سلامة المرضى.' },
          { label: 'الاحترام', description: 'نؤمن بتقديم رعاية تشعر المرضى بالتقدير والاحترام في كل خطوة.' },
          { label: 'الشفافية', description: 'نحرص على توضيح وتقديم معلومات دقيقة حول كل علاج وإجراء.' },
          { label: 'الابتكار', description: 'نواكب أحدث التقنيات الطبية لضمان تقديم خدمات فعالة وسريعة.' }
        ]
      },
      cta: {
        aria_label: 'احجز موعدك الطبي الآن',
        title: 'احجز موعدك الطبي الآن',
        description: 'تواصلوا معنا اليوم للحصول على رعاية صحية متميزة بسهولة وسرعة. فريقنا جاهز لخدمتكم على مدار الساعة.',
        book_now_button: 'احجز الآن',
        contact_us_button: 'تواصل معنا'
      },
      stats_section: {
        aria_label: 'إحصائيات مجمع خبراء العافية الطبي',
        badge: 'إحصائياتنا',
        title: 'إنجازاتنا في الرعاية الصحية',
        description: 'نفخر بتقديم خدمات طبية متميزة لمجتمعنا، مع التركيز على الجودة والابتكار.',
        stats: [
          { label: 'عدد العملاء', count: 15000, prefix: '+', suffix: '', ringOffset: 0 },
          { label: 'عدد العيادات', count: 1000, prefix: '+', suffix: '', ringOffset: 0 },
          { label: 'عدد الأطباء', count: 200, prefix: '+', suffix: '', ringOffset: 0 },
          { label: 'ساعات العمل', count: '24/7', prefix: '', suffix: '', ringOffset: 0 }
        ]
      },
      testimonials_section: {
        aria_label: 'آراء العملاء',
        badge: 'آراء العملاء',
        title: 'ما يقوله عملاؤنا',
        error: 'خطأ في تحميل الآراء',
        no_testimonials: 'لا توجد آراء متاحة حالياً',
        carousel: {
          previous_slide: 'الشريحة السابقة',
          next_slide: 'الشريحة التالية',
          slide_label: 'الشريحة {number}'
        }
      },
      contact_page: {
        details_title: 'تفاصيل الاتصال',
        cta_title: 'تواصل معنا',
        cta_subtitle: 'املأ النموذج للتواصل معنا',
        name_placeholder: 'أدخل اسمك',
        name_error: 'الاسم مطلوب ويجب أن يكون أكثر من حرفين',
        email_placeholder: 'أدخل بريدك الإلكتروني',
        email_error: 'البريد الإلكتروني مطلوب ويجب أن يكون صالحاً',
        phone_placeholder: 'أدخل رقم هاتفك',
        phone_error: 'رقم الهاتف مطلوب ويجب أن يكون 10 أرقام',
        subject_placeholder: 'أدخل الموضوع',
        subject_error: 'الموضوع مطلوب ويجب أن يكون أكثر من 3 أحرف',
        message_placeholder: 'اكتب رسالتك',
        message_error: 'الرسالة مطلوبة ويجب أن تكون أكثر من 10 أحرف',
        submit_button: 'إرسال',
        faq_title: 'الأسئلة الشائعة',
        faq1_question: 'ما هي ساعات العمل؟',
        faq1_answer: 'نعمل على مدار 24 ساعة طوال الأسبوع.',
        faq2_question: 'كيف أحجز موعد؟',
        faq2_answer: 'يمكنك الحجز عبر الموقع أو الاتصال بنا.',
        faq3_question: 'ما التخصصات المتوفرة؟',
        faq3_answer:'لدينا تخصصات متعددة مثل الأسنان، الأطفال، العظام، القلب، الجلدية، الأعصاب، الأشعة، العيون، الأنف والأذن والحنجرة، النساء والتوليد، المسالك البولية، الجراحة العامة، الباطنة، والتغذية.',
        faq4_question: 'هل تقبلون التأمين؟',
        faq4_answer: 'نعم، نقبل معظم شركات التأمين.',
        social_title: 'تابعنا على وسائل التواصل',
        social_subtitle: 'ابق على اطلاع بآخر الأخبار والعروض',
        cta_image_alt: 'صورة التواصل',
        success_message: 'تم إرسال رسالتك بنجاح! سنرد عليك قريباً.',
        error_message: 'حدث خطأ أثناء إرسال رسالتك. حاول مرة أخرى لاحقاً.'
      },
      all_specialties: 'جميع التخصصات'
    },
 en: {
  // ... (Existing translations remain unchanged unless specified)

  hero_stats_patients: 'Patients', // Already exists, used for heroStats[0].label
  hero_stats_doctors: 'Specialized Doctors', // Updated to match clinics-section.specialized_doctors
  hero_stats_price: 'SAR', // Already exists
  hero_book_appointment: 'Book Appointment Now', // Already exists
  hero_contact_us: 'Contact Us', // Already exists
  hero_stats_support: 'Medical Support', // Updated to match clinics-section.emergency_service

  about_section_title: 'About the Clinic',
  about_no_info: 'No information available',
  info_section_title: 'Information About Us',
  info_available_days: 'Available Days',
  info_approximate_cost: 'Approximate Cost',
  info_phone: 'Phone Number',
  info_address: 'Address',
  info_call_now: 'Call Now',
  info_view_map: 'View on Map',
  info_unavailable: 'Currently Unavailable',
  info_not_specified: 'Not Specified',
  doctors_section_title: 'Specialized Doctors',
  doctors_section_subtitle: 'Meet Our Distinguished Medical Team',
  doctor_specialization: 'Specialization',
  doctor_years_of_experience: 'Years of Experience',
  doctor_email: 'Email',
  doctor_about_title: 'About the Doctor',
  doctor_specialties_title: 'Sub-Specialties',
  doctor_book_appointment: 'Book Appointment',
  doctor_certified_badge: 'Certified Doctor',
  doctor_image_alt: 'Doctor Image',
  available_now: 'Available Now',
  videos_section_title: 'Educational Videos',
  videos_section_subtitle: 'Learn More About Our Medical Services',
  videos_not_supported: 'Sorry, your browser does not support video playback',
  videos_loading: 'Loading video...',
  videos_playlist_title: 'Video Playlist',
  video_aria_label: 'Video',
  video_default_label: 'Video',
  video_thumbnail_alt: 'Video Thumbnail',
  video_play_aria: 'Play Video',
  cta_title: 'Book Your Appointment Now',
  cta_subtitle: 'Don’t hesitate to contact us to book your appointment and receive the best medical care',
  cta_book_appointment: 'Book Appointment',
  cta_contact_us: 'Contact Us',
  stats_section_title: 'Clinic Statistics',
  stats_bookings_today: 'Bookings Today',
  stats_bookings_last_7_days: 'Last 7 Days',
  stats_bookings_last_30_days: 'Last 30 Days',
  stats_total_patients: 'Total Patients',
  loading_text: 'Loading clinic details...',
  error_title: 'Sorry',
  error_message: 'Clinic details not found',
  error_retry: 'Retry',
  day_monday: 'Monday',
  day_tuesday: 'Tuesday',
  day_wednesday: 'Wednesday',
  day_thursday: 'Thursday',
  day_friday: 'Friday',
  day_saturday: 'Saturday',
  day_sunday: 'Sunday',
  day_all: 'All Days',
  general_medicine: 'General Medicine',
  home: 'Home',
  about: 'About Us',
  appointment: 'Book Appointment',
  doctors: 'Doctors',
  gallery: 'Gallery',
  specialized_departments: 'Specialized Departments',
  obstetrics: 'Obstetrics',
  internal_medicine: 'Internal Medicine',
  dentistry: 'Dentistry',
  urology: 'Urology',
  pediatric_surgery: 'Pediatric Surgery',
  orthopedics: 'Orthopedics',
  packages: 'Packages',
  clinics: 'Clinics',
  contact: 'Contact Us',
  login: 'Login',
  logout: 'Logout',
  language_toggle: 'AR',
  site_logo_alt: 'Site Logo',
  home_page_label: 'Home Page',
  about_page_label: 'About Us',
  appointment_page_label: 'Book a Medical Appointment',
  doctors_menu_label: 'Doctors List',
  specialties_menu_label: 'Medical Specialties List',
  sub_specialties_menu_label: 'Sub-specialties List',
  contact_page_label: 'Contact Page',
  language_change_to: 'Change language to Arabic',
  language_changed_to_ar: 'Language changed to Arabic',
  language_changed_to_en: 'Language changed to English',
  logout_success: 'Successfully logged out',
  company_name: 'Experts Wellness Medical Complex',
  footer_description: 'We provide the best medical services with the latest technologies and a team of specialized doctors to ensure you receive the best possible healthcare.',
  quick_links: 'Quick Links',
  medical_services: 'Medical Services',
  contact_info: 'Contact Information',
  address_title: 'Address',
  address: 'Riyadh - Al-Qadisiyah District - Imam Abdullah Bin Saud Road 3',
  phone_title: 'Phone',
  phone_1: '0551221322',
  phone_2: '0551028800',
  phone_3: '0112100329',
  email_title: 'Email',
  email: 'info@khobaraalafia.com',
  hours_title: 'Working Hours',
  hours: '24/7 - Around the Clock',
  facebook: 'Facebook',
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  newsletter_title: 'Subscribe to Our Newsletter',
  newsletter_description: 'Get the latest medical news and exclusive offers',
  newsletter_placeholder: 'Enter your email',
  newsletter_input_label: 'Email for subscription',
  newsletter_subscribe: 'Subscribe',
  newsletter_subscribe_success: 'Successfully subscribed to the newsletter!',
  all_rights_reserved: 'All Rights Reserved',
  privacy_policy: 'Privacy Policy',
  terms_conditions: 'Terms and Conditions',
  sitemap: 'Sitemap',
  back_to_top: 'Back to Top',
  login_title: 'Login',
  email_label: 'Email',
  email_placeholder: 'Enter your email',
  password_label: 'Password',
  password_placeholder: 'Enter your password',
  email_invalid: 'A valid email is required',
  password_invalid: 'Password is required',
  login_button: 'Login',
  forgot_password: 'Forgot Password?',
  forgot_password_title: 'Forgot Password',
  send_reset_email: 'Send Reset Email',
  forgot_password_success: 'Password reset email sent. Please check your inbox.',
  forgot_password_failed: 'Failed to send reset email.',
  reset_password_title: 'Reset Password',
  new_password_label: 'New Password',
  new_password_placeholder: 'Enter your new password',
  password_min_length: 'Password must be at least 6 characters',
  reset_password_button: 'Reset Password',
  reset_password_success: 'Password reset successful! Please login.',
  reset_password_failed: 'Failed to reset password.',
  back_to_login: 'Back to Login',
  login_success: 'Login successful! Welcome, {name}',
  login_failed: 'Login failed.',
  register: 'Create an Account',
  register_title: 'Create an Account',
  name_label: 'Name',
  name_placeholder: 'Enter your name',
  name_invalid: 'Name is required',
  phone_label: 'Phone Number',
  phone_placeholder: 'Enter your phone number',
  phone_invalid: 'Valid phone number is required (10-15 digits)',
  address_label: 'Address',
  address_placeholder: 'Enter your address',
  address_invalid: 'Address is required',
  age_label: 'Age',
  age_placeholder: 'Enter your age',
  age_invalid: 'Valid age (1-120) is required',
  register_button: 'Create an Account',
  register_success: 'Registration successful! Please login.',
  register_failed: 'Registration failed.',
  hero_welcome: 'Welcome to Experts Wellness Medical Complex',
  appointment_button: 'Book Your Appointment',
  explore_button: 'Explore',
  about_title: 'About Us',
  about_description: 'Experts Wellness Medical Complex is a leading healthcare facility offering comprehensive medical services with world-class quality. We are committed to improving our patients’ quality of life by providing holistic care using the latest technologies. Our specialized team ensures a safe and comfortable treatment experience.',
  about_feature_1: 'Highly experienced and specialized medical team',
  about_feature_2: 'Modern and advanced medical facilities',
  about_feature_3: 'Patient-centered comprehensive care',
  explore_doctors_button: 'Explore Our Doctors',
  book_appointment_button: 'Book Appointment',
  medical_services_button: 'Our Medical Services',
  about_image_alt: 'Modern and advanced medical facilities',
  cta_description: 'Book your appointment through our website, fill in all the details, and we will contact you. Save your time!',
  cta_button: 'Book Your Appointment Now',
  doctors_section: {
    hero_subtitle: 'Our Distinguished Doctors',
    hero_title: 'World-Class Healthcare',
    hero_description: 'Find the best specialized doctors to provide the healthcare you deserve, with expertise and dedication to ensure your well-being.',
    hero_button: 'Explore Our Team',
    section_title: 'Our Distinguished Medical Team',
    section_subtitle: 'We take pride in having an elite team of specialized doctors who provide exceptional medical services using the latest global technologies.',
    search_placeholder: 'Search for a doctor or specialty...',
    book_consultation: 'Book a Consultation',
    book_now: 'Book Now',
    book_appointment: 'Book a Consultation Appointment',
    all_specialties: 'All Specialties',
    years_of_experience: (count: number) => `${count}+ Years of Experience`
  },
  booking_section: {
    hero_title: 'Book a Medical Appointment',
    hero_description: 'Easily book your appointment at our specialized clinics. Choose the clinic, select the time, and complete your details in simple steps.',
    step_1_label: 'Personal Information',
    step_2_label: 'Choose Clinic',
    step_3_label: 'Appointment Details',
    step_1_title: 'Personal Information',
    step_1_description: 'Please enter your personal information accurately',
    step_2_title: 'Choose Clinic',
    step_2_description: 'Select the clinic where you want to book your appointment',
    step_3_title: 'Appointment Details',
    step_3_description: 'Choose the date and time that suit you',
    name_label: 'Full Name',
    name_placeholder: 'Enter your full name',
    email_label: 'Email',
    email_placeholder: 'Enter your email',
    phone_label: 'Phone Number',
    phone_placeholder: 'Enter your phone number',
    address_label: 'Address',
    address_placeholder: 'Enter your address',
    clinic_label: 'Clinic',
    appointment_date_label: 'Appointment Date',
    appointment_time_label: 'Appointment Time',
    previous_button: 'Previous',
    next_button: 'Next',
    submit_button: 'Confirm Booking',
    load_previous_times: 'Show Previous',
    load_more_times: 'Load More',
    time_period_am: 'AM',
    time_period_pm: 'PM',
    success_title: 'Booking Confirmed!',
    success_message: 'Thank you! Your appointment has been successfully booked. A confirmation will be sent to your email.',
    booking_number_label: 'Booking Number',
    confirmation_code_label: 'Confirmation Code',
    clinic_name_label: 'Clinic',
    date_label: 'Date',
    time_label: 'Time',
    book_another_button: 'Book Another Appointment',
    back_to_home_button: 'Back to Home',
    login_required_error: 'Please log in to book an appointment',
    server_error: 'An error occurred while confirming the booking. Please try again.',
    download_booking_details: 'Download Booking Details',
    screenshot_hint: 'You can take a screenshot of this page to save your booking details.'
  },
  media: {
    hero_badge: 'Premium Healthcare',
    hero_title_highlight: 'Exceptional Treatments',
    hero_title_main: 'for a Healthy Lifestyle',
    hero_description: 'We provide advanced medical solutions with a team of specialized doctors, using the latest medical technologies to ensure the best healthcare for you and your family.',
    hero_primary_button: 'View Videos',
    hero_secondary_button: 'Our Services',
    stats: [
      { id: 1, label: 'Happy Clients', suffix: '+' },
      { id: 2, label: 'Complex Rooms', suffix: '+' },
      { id: 3, label: 'Doctors', suffix: '+' },
      { id: 4, label: 'Ambulances', suffix: '+' }
    ],
    floating_cards: [
      { id: 1, label: 'Heart Care' },
      { id: 2, label: 'Health Protection' },
      { id: 3, label: '24/7 Service' }
    ],
    articles_title: 'Articles',
    articles: [
      {
        id: 1,
        title: 'How to Maintain Heart Health',
        description: 'Learn the best practices for maintaining heart health through proper nutrition, exercise, and stress management.',
        image_alt: 'Heart Health'
      },
      {
        id: 2,
        title: 'The Importance of Mental Health',
        description: 'Discover how mental health can impact your daily life and learn strategies to improve your mental well-being.',
        image_alt: 'Mental Health'
      },
      {
        id: 3,
        title: 'Healthy Nutrition Guide',
        description: 'Practical tips to improve your diet and choose foods that boost your health and daily energy.',
        image_alt: 'Healthy Nutrition'
      }
    ],
    article_read_more: 'Read More',
    article_share: 'Share',
    video_not_supported: 'Your browser does not support video playback',
    play_video: 'Play Video',
    pause_video: 'Pause Video',
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    replay: 'Replay',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Fullscreen',
    exit_fullscreen: 'Exit Fullscreen',
    playlist_title: 'Video Playlist',
    videos_count: 'Videos',
    autoplay: 'Autoplay',
    repeat: (count: number) => 'Repeat Video',
    video_element_missing: 'Video element is not available',
    play_error: 'Failed to play video. Please try manually.',
    video_load_error: 'Error loading video',
    video_format_error: 'Video format not supported or file not found.',
    network_error: 'Network error. Please ensure the file exists.',
    unknown_error: 'Unknown video error.',
    videos: [
      {
        title: 'Welcome to Our Advanced Medical Complex',
        description: 'A comprehensive tour of our medical complex and its advanced facilities...',
        shortDescription: 'Comprehensive tour of our medical complex and advanced facilities'
      },
      {
        title: 'Emergency Department - 24/7 Service',
        description: 'Learn about our emergency department equipped with the latest technologies...',
        shortDescription: 'Emergency department and advanced urgent care services'
      },
      {
        title: 'Advanced Medical Specialty Clinics',
        description: 'Overview of our specialized clinics in various medical fields...',
        shortDescription: 'Specialized clinics and diverse medical services'
      },
      {
        title: 'Diagnostic and Medical Laboratory',
        description: 'Tour of our laboratory equipped with state-of-the-art equipment...',
        shortDescription: 'Advanced diagnostics and laboratory with cutting-edge technology'
      }
    ]
  },
  'clinics-section': {
    aria_label: 'Experts Wellness Medical Complex Clinics Section',
    clinics_badge: 'Our Clinics',
    clinics_title: 'Our Departments & Clinics',
    clinics_subtitle: 'Discover a wide range of medical specialties available at our complex',
    available_services: 'Available Services',
    clinic_book_button: 'Book Your Appointment',
    all_clinics_button: 'View All Departments',
    more: 'More',
    more_info: 'Clinic Details',
    available_now: 'Available Now',
    unavailable_now: 'Unavailable Now',
    no_services: 'No services available',
    comprehensive_care: 'Comprehensive Medical Care',
    specialized_doctors: 'Specialized Doctors',
    advanced_tech: 'Advanced Medical Technologies',
    emergency_service: '24/7 Emergency Service',
    dentistry_specialties: [
      'Cosmetic Fillings',
      'Root Canal Treatment',
      'German Restorations',
      'Teeth Cleaning',
      'Gum Enhancement'
    ],
    pediatrics_specialties: [
      'Respiratory Diseases',
      'Bedwetting',
      'Growth Delays',
      'Chest Allergies',
      'Laboratory Tests'
    ],
    orthopedics_specialties: [
      'Fracture Treatment',
      'Sports Injuries',
      'Joint Osteoarthritis',
      'Rheumatoid Arthritis',
      'Osteoporosis'
    ],
    ophthalmology_specialties: [
      'Cataracts and Glaucoma',
      'Retinal Diseases',
      'Laser Vision Correction',
      'Fundus Examination',
      'Eye Pressure Measurement'
    ],
    urology_specialties: [
      'Kidney Stone Treatment',
      'Urological Surgeries',
      'Reproductive System Examinations'
    ],
    ent_specialties: [
      'Migraines',
      'Ear, Nose, and Throat Issues',
      'Balance Disorders',
      'Advanced Surgeries',
      'Medical Treatment'
    ],
    dermatology_specialties: [
      'Skin Care',
      'Hair Treatment',
      'Facial Aesthetics',
      'Latest Technologies',
      'Specialized Consultations'
    ],
    gynecology_specialties: [
      'Pregnancy Monitoring',
      'Natural Childbirth',
      'Menstrual Disorders',
      'Gynecological Examinations',
      'Emergency Care'
    ],
    internal_medicine_specialties: [
      'Chronic Disease Management',
      'Diabetes Treatment',
      'Hypertension',
      'Digestive System Disorders',
      'Kidney Diseases'
    ],
    laboratory_specialties: [
      'Blood Tests',
      'Urine Tests',
      'Hormone Tests',
      'Rapid Diagnostic Tests',
      'Tissue Analysis'
    ],
    radiology_specialties: [
      'X-rays',
      'CT Scans',
      'MRI',
      'Ultrasound',
      'Vascular Imaging'
    ],
    general_medicine_specialties: [
      'Primary Care',
      'Routine Checkups',
      'Common Disease Treatment',
      'Specialist Referrals',
      'Preventive Healthcare'
    ]
  },
  clinics_data: [
    {
      id: 'dentistry',
      name: 'Dental Clinic',
      description: 'Cosmetic fillings with American materials, root canal treatment with the latest equipment, German restorations (Emax, Lumineers), teeth cleaning, and gum enhancement.',
      specialties: ['Cosmetic Fillings', 'Root Canal Treatment', 'German Restorations', 'Teeth Cleaning', 'Gum Enhancement'],
      status: 'active'
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics Clinic',
      description: 'Treatment of respiratory diseases, bedwetting, growth delays, chest allergies, gastrointestinal issues, and laboratory tests for children.',
      specialties: ['Respiratory Diseases', 'Bedwetting', 'Growth Delays', 'Chest Allergies', 'Laboratory Tests'],
      status: 'active'
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics Clinic',
      description: 'Treatment of fractures, sports injuries, joint osteoarthritis, rheumatoid arthritis, osteoporosis, and spinal disorders.',
      specialties: ['Fracture Treatment', 'Sports Injuries', 'Joint Osteoarthritis', 'Rheumatoid Arthritis', 'Osteoporosis'],
      status: 'active'
    },
    {
      id: 'ophthalmology',
      name: 'Ophthalmology Clinic',
      description: 'Diagnosis of cataracts and glaucoma, retinal disease follow-up, laser vision correction, fundus examination, and eye pressure measurement.',
      specialties: ['Cataracts and Glaucoma', 'Retinal Diseases', 'Laser Vision Correction', 'Fundus Examination', 'Eye Pressure Measurement'],
      status: 'inactive'
    },
    {
      id: 'urology',
      name: 'Urology Clinic',
      description: 'Diagnosis and treatment of urinary tract diseases, kidney stones, reproductive system disorders, using advanced diagnostic and surgical techniques.',
      specialties: ['Kidney Stone Treatment', 'Urological Surgeries', 'Reproductive System Examinations'],
      status: 'active'
    },
    {
      id: 'dermatology',
      name: 'Dermatology & Cosmetics Clinic',
      description: 'Comprehensive care for skin, hair, and aesthetics with the latest technologies under the supervision of Dr. Yasmin, offering diverse services for optimal results.',
      specialties: ['Skin Care', 'Hair Treatment', 'Facial Aesthetics', 'Latest Technologies', 'Specialized Consultations'],
      status: 'active'
    },
    {
      id: 'gynecology',
      name: 'Gynecology & Obstetrics Clinic',
      description: 'Women’s health care, pregnancy and childbirth monitoring, treatment of menstrual disorders, and routine and emergency gynecological examinations.',
      specialties: ['Pregnancy Monitoring', 'Natural Childbirth', 'Menstrual Disorders', 'Gynecological Examinations', 'Emergency Care'],
      status: 'active'
    },
    {
      id: 'internal-medicine',
      name: 'Internal Medicine Clinic',
      description: 'Diagnosis and treatment of chronic diseases such as diabetes, hypertension, digestive system disorders, and kidney diseases using the latest medical approaches.',
      specialties: ['Chronic Disease Management', 'Diabetes Treatment', 'Hypertension', 'Digestive System Disorders', 'Kidney Diseases'],
      status: 'active'
    },
    {
      id: 'laboratory',
      name: 'Laboratory Department',
      description: 'Conducting laboratory tests using state-of-the-art equipment for accurate disease diagnosis, including blood, urine, and hormone tests.',
      specialties: ['Blood Tests', 'Urine Tests', 'Hormone Tests', 'Rapid Diagnostic Tests', 'Tissue Analysis'],
      status: 'active'
    },
    {
      id: 'radiology',
      name: 'Radiology Department',
      description: 'Medical imaging services including X-rays, CT scans, MRI, ultrasound, and vascular imaging using cutting-edge technologies.',
      specialties: ['X-rays', 'CT Scans', 'MRI', 'Ultrasound', 'Vascular Imaging'],
      status: 'active'
    },
    {
      id: 'general-medicine',
      name: 'General Medicine Clinic',
      description: 'Providing primary healthcare, routine checkups, treatment of common diseases, and specialist referrals when needed.',
      specialties: ['Primary Care', 'Routine Checkups', 'Common Disease Treatment', 'Specialist Referrals', 'Preventive Healthcare'],
      status: 'active'
    }
  ],
  dentistry_title: 'Dental Clinic',
  dentistry_title_en: 'Dentistry',
  dentistry_description: 'Cosmetic fillings with American materials, root canal treatment with the latest equipment, German restorations (Emax, Lumineers), teeth cleaning, and gum enhancement.',
  pediatrics_title: 'Pediatrics Clinic',
  pediatrics_title_en: 'Pediatrics',
  pediatrics_description: 'Treatment of respiratory diseases, bedwetting, growth delays, chest allergies, gastrointestinal issues, and laboratory tests for children.',
  orthopedics_title: 'Orthopedics Clinic',
  orthopedics_title_en: 'Orthopedics',
  orthopedics_description: 'Treatment of fractures, sports injuries, joint osteoarthritis, rheumatoid arthritis, osteoporosis, and spinal disorders.',
  ophthalmology_title: 'Ophthalmology Clinic',
  ophthalmology_title_en: 'Ophthalmology',
  ophthalmology_description: 'Diagnosis of cataracts and glaucoma, retinal disease follow-up, laser vision correction, fundus examination, and eye pressure measurement.',
  ent_title: 'ENT Clinic',
  ent_title_en: 'ENT',
  ent_description: 'Treatment of migraines, ear, nose, and throat issues, and balance disorders using advanced medical and surgical techniques.',
  dermatology_title: 'Dermatology & Cosmetics Clinic',
  dermatology_title_en: 'Dermatology & Cosmetics',
  dermatology_description: 'Comprehensive care for skin, hair, and aesthetics with the latest technologies under the supervision of Dr. Yasmin, offering diverse services for optimal results.',
  urology_title: 'Urology Clinic',
  urology_title_en: 'Urology',
  urology_description: 'Diagnosis and treatment of urinary tract diseases, kidney stones, infertility, and reproductive system disorders using advanced diagnostic and surgical techniques.',
  gynecology_title: 'Gynecology & Obstetrics Clinic',
  gynecology_title_en: 'Gynecology & Obstetrics',
  gynecology_description: 'Women’s health care, pregnancy and childbirth monitoring, treatment of menstrual disorders, and routine and emergency gynecological examinations.',
  internal_medicine_title: 'Internal Medicine Clinic',
  internal_medicine_title_en: 'Internal Medicine',
  internal_medicine_description: 'Diagnosis and treatment of chronic diseases such as diabetes, hypertension, digestive system disorders, and kidney diseases using the latest medical approaches.',
  laboratory_title: 'Laboratory Department',
  laboratory_title_en: 'Laboratory',
  laboratory_description: 'Conducting laboratory tests using state-of-the-art equipment for accurate disease diagnosis, including blood, urine, and hormone tests.',
  radiology_title: 'Radiology Department',
  radiology_title_en: 'Radiology',
  radiology_description: 'Medical imaging services including X-rays, CT scans, MRI, ultrasound, and vascular imaging using cutting-edge technologies.',
  general_medicine_title: 'General Medicine Clinic',
  general_medicine_title_en: 'General Medicine',
  general_medicine_description: 'Providing primary healthcare, routine checkups, treatment of common diseases, and specialist referrals when needed.',
  clinic_book_button: 'Book Your Appointment',
  all_clinics_button: 'View All Departments',
  available_services: 'Available Services',
  more: 'More',
  more_info: 'Clinic Details',
  doctor_sub_specialties: 'Sub-Specialties',
  clinic_overview: 'Clinic Overview',
  contact_us: 'Contact Us',
  hero_title: 'We are honored to care for your health with expertise and heart.',
  hero_subtitle: 'We provide comprehensive medical care with the latest technologies to ensure your comfort and safety',
  hero_appointment_button: 'Book a Medical Appointment',
  hero_explore_button: 'Explore Our Doctors',
  hero_image_alt: 'Professional medical team providing top healthcare services',
  hero_facebook_aria: 'Follow us on Facebook',
  hero_instagram_aria: 'Follow us on Instagram',
  hero_whatsapp_aria: 'Contact us via WhatsApp',
  hero_twitter_aria: 'Contact us via Twitter',
  contact_title: 'Contact Us',
  contact_description: 'Fill out the form below, and we’ll get back to you as soon as possible. Our team is ready to assist!',
  contact_name_label: 'Name',
  contact_name_placeholder: 'Enter your name',
  contact_email_label: 'Email',
  contact_email_placeholder: 'Enter your email',
  contact_message_label: 'Your Message',
  contact_message_placeholder: 'Write your message here',
  contact_submit_button: 'Send',
  contact_info_title: 'Contact Information',
  contact_address: 'Riyadh - Al-Qadisiyah District - Imam Abdullah Bin Saud Road 3',
  contact_phone_1: '0551221322',
  contact_phone_2: '0551028800',
  contact_phone_3: '0112100329',
  contact_email: 'info@khobaraalafia.com',
  contact_hours: '24/7 - Around the Clock',
  contact_map_aria: 'Experts Wellness Medical Complex Location Map',
  partners_title: 'Insurance Partners',
  'partners-section': {
    partners_title: 'Partnered with All Major Medical Insurance Companies',
    partners_subtitle: 'We are proud to partner with leading institutions to enhance innovation and quality in healthcare'
  },
  partner_logo_alt_1: 'Partner Logo 1',
  partner_logo_alt_2: 'Partner Logo 2',
  partner_logo_alt_3: 'Partner Logo 3',
  partner_logo_alt_4: 'Partner Logo 4',
  partner_logo_alt_5: 'Partner Logo 5',
  partner_logo_alt_6: 'Partner Logo 6',
  partner_logo_alt_7: 'Partner Logo 7',
  partner_logo_alt_8: 'Partner Logo 8',
  partner_logo_alt_9: 'Partner Logo 9',
  partner_logo_alt_10: 'Partner Logo 10',
  hero_section: {
    aria_label: 'Hero Section - About Us',
    badge: 'Specialized Medical Complex',
    title_main: 'Experts Wellness Medical Complex',
    title_sub: 'Premium Healthcare',
    description: 'We offer comprehensive medical services with high quality and personalized care for every patient, with a team of qualified doctors and the latest medical technologies.',
    book_appointment_button: 'Book Your Appointment Now',
    explore_services_button: 'Discover Our Services',
    stats: {
      patients: 'Satisfied Patients',
      doctors: 'Specialized Doctors',
      support: 'Medical Support'
    },
    socials: {
      facebook_aria: 'Facebook',
      twitter_aria: 'Twitter',
      instagram_aria: 'Instagram',
      linkedin_aria: 'LinkedIn'
    },
    logo_alt: 'Experts Wellness Medical Complex Logo'
  },
  about_intro: {
    aria_label: 'Introduction to the Complex',
    badge: 'About Us',
    title: 'Introduction to Experts Wellness Medical Complex',
    description_1: 'Experts Wellness Medical Complex is a leading institution in providing comprehensive healthcare, committed to delivering exceptional medical services using the latest technologies and advanced medical equipment, while maintaining the highest international quality standards in diagnosis and treatment. We believe that health is the foundation of a better life, and thus, we take on the responsibility of providing integrated and comprehensive care to our patients in a comfortable and safe environment.',
    description_2: 'We aim to enhance community health through a team of highly qualified doctors and tailored health programs designed to meet each individual’s needs, focusing on personalized care and attention to every detail of the treatment journey. We are also dedicated to promoting health awareness and encouraging patients to adopt sustainable healthy lifestyles, making Experts Wellness Medical Complex a constant partner in improving quality of life and supporting long-term public health.',
    features: {
      service_24_7: {
        title: '24/7 Service',
        description: 'We provide round-the-clock medical services to ensure your comfort and safety at any time'
      },
      best_doctors: {
        title: 'Top Doctors',
        description: 'A team of highly experienced and skilled doctors to deliver the best possible care'
      },
      integrated_care: {
        title: 'Integrated Care',
        description: 'Comprehensive health programs designed to meet all your healthcare needs'
      },
      safety_trust: {
        title: 'Safety & Trust',
        description: 'We adhere to the highest standards of safety and quality in all our medical services'
      }
    }
  },
  vision_mission: {
    aria_label: 'Our Vision & Mission',
    badge: 'Our Vision',
    title: 'Our Vision & Mission',
    description: 'We aspire to be the top choice for healthcare in the region, committed to providing innovative and comprehensive medical services focused on the patient.',
    vision: {
      title: 'Our Vision',
      description: 'To be a leading medical complex providing world-class healthcare, focusing on innovation and quality.'
    },
    mission: {
      title: 'Our Mission',
      description: 'To deliver comprehensive and integrated medical services using the latest technologies to improve our patients’ quality of life.'
    },
    values_title: 'Our Values',
    values: [
      { label: 'Excellence', description: 'We strive for leadership in everything we offer, from medical services to patient experience.' },
      { label: 'Quality', description: 'We are committed to providing high-quality medical services and adhering to strict standards to ensure patient safety.' },
      { label: 'Respect', description: 'We believe in providing care that makes patients feel valued and respected at every step.' },
      { label: 'Transparency', description: 'We ensure clarity and accuracy in providing information about every treatment and procedure.' },
      { label: 'Innovation', description: 'We keep up with the latest medical technologies to ensure effective and efficient services.' }
    ]
  },
  cta: {
    aria_label: 'Book Your Medical Appointment Now',
    title: 'Book Your Medical Appointment Now',
    description: 'Contact us today to receive exceptional healthcare with ease and speed. Our team is ready to serve you around the clock.',
    book_now_button: 'Book Now',
    contact_us_button: 'Contact Us'
  },
  stats_section: {
    aria_label: 'Experts Wellness Medical Complex Statistics',
    badge: 'Our Statistics',
    title: 'Our Healthcare Achievements',
    description: 'We take pride in providing exceptional medical services to our community, focusing on quality and innovation.',
    stats: [
      { label: 'Number of Clients', count: 15000, prefix: '+', suffix: '', ringOffset: 0 },
      { label: 'Number of Clinics', count: 1000, prefix: '+', suffix: '', ringOffset: 0 },
      { label: 'Number of Doctors', count: 200, prefix: '+', suffix: '', ringOffset: 0 },
      { label: 'Working Hours', count: '24/7', prefix: '', suffix: '', ringOffset: 0 }
    ]
  },
  testimonials_section: {
    aria_label: 'Customer Testimonials',
    badge: 'Customer Testimonials',
    title: 'What Our Clients Say',
    error: 'Error loading testimonials',
    no_testimonials: 'No testimonials available at the moment',
    carousel: {
      previous_slide: 'Previous Slide',
      next_slide: 'Next Slide',
      slide_label: 'Slide {number}'
    }
  },
  contact_page: {
    details_title: 'Contact Details',
    cta_title: 'Contact Us',
    cta_subtitle: 'Fill out the form to get in touch with us',
    name_placeholder: 'Enter your name',
    name_error: 'Name is required and must be more than 2 characters',
    email_placeholder: 'Enter your email',
    email_error: 'A valid email is required',
    phone_placeholder: 'Enter your phone number',
    phone_error: 'Phone number is required and must be 10 digits',
    subject_placeholder: 'Enter the subject',
    subject_error: 'Subject is required and must be more than 3 characters',
    message_placeholder: 'Write your message',
    message_error: 'Message is required and must be more than 10 characters',
    submit_button: 'Send',
    faq_title: 'Frequently Asked Questions',
    faq1_question: 'What are the working hours?',
    faq1_answer: 'We operate 24 hours a day, 7 days a week.',
    faq2_question: 'How can I book an appointment?',
    faq2_answer: 'You can book through our website or by contacting us directly.',
    faq3_question: 'What specialties are available?',
    faq3_answer: 'We offer multiple specialties such as Dentistry, Pediatrics, Orthopedics, Cardiology, Dermatology, Neurology, Radiology, Ophthalmology, ENT (Ear, Nose and Throat), Gynecology and Obstetrics, Urology, General Surgery, Internal Medicine, and Nutrition.',
    faq4_question: 'Do you accept insurance?',
    faq4_answer: 'Yes, we accept most insurance companies.',
    social_title: 'Follow Us on Social Media',
    social_subtitle: 'Stay updated with the latest news and offers',
    cta_image_alt: 'Contact Image',
    success_message: 'Your message has been sent successfully! We’ll respond soon.',
    error_message: 'An error occurred while sending your message. Please try again later.'
  },
  all_specialties: 'All Specialties'
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

getStringTranslation(key: string): string {
  const keys = key.split('.');
  let translation: Translation | string | string[] | Value[] | Clinic[] | Article[] | Video[] | Specialty[] | VisionMissionValue[] | Stat[] | ((count: number) => string) =
    this.translations[this.currentLanguage.value as keyof Translations];



  for (const k of keys) {
    if (typeof translation === 'object' && !Array.isArray(translation) && k in translation) {
      translation = (translation as Translation)[k];
    } else {
      console.error(`Translation key part "${k}" not found in path "${key}" for language "${this.currentLanguage.value}"`);
      return key;
    }
  }

  if (typeof translation === 'string') {
    return translation;
  } else if (typeof translation === 'function') {
    return translation(1); // Default to count=1 for function-based translations
  } else if (Array.isArray(translation)) {
    return translation
      .map(item => {
        if (typeof item === 'string') {
          return item;
        } else if ('label' in item) {
          return (item as Value | Specialty | VisionMissionValue | Stat).label;
        } else if ('name' in item) {
          return (item as Clinic).name;
        } else if ('title' in item) {
          return (item as Article | Video).title;
        }
        console.warn(`Unexpected item structure in array for key "${key}":`, item);
        return '';
      })
      .filter(item => item !== '')
      .join(', ');
  } else {
    console.error(`Translation for key "${key}" is not a string, function, or array:`, translation);
    return key;
  }
}

  getTranslation<T = string | Value[] | Clinic[] | Article[] | Video[] | Specialty[] | VisionMissionValue[] | Stat[]>(key: string): T {
    const keys = key.split('.');
    let translation: any = this.translations[this.currentLanguage.value as keyof Translations];

    for (const k of keys) {
      if (typeof translation === 'object' && !Array.isArray(translation) && k in translation) {
        translation = translation[k];
      } else {
        return key as any;
      }
    }

    return translation as T;
  }

  getCurrentLanguageValue(): string {
    return this.currentLanguage.value;
  }
}
