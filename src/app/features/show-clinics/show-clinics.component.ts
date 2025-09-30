import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClinicService, Clinic, ClinicDoctor } from '../../core/services/clinic.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ClinicVideo {
  _id: string;
  path: string;
  label: string;
  thumbnail?: string;
}

@Component({
  selector: 'app-show-clinics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-clinics.component.html',
  styleUrls: ['./show-clinics.component.scss']
})
export class ShowClinicsComponent implements OnInit, OnDestroy {
  @ViewChild('mainVideoPlayer') mainVideoPlayer?: ElementRef<HTMLVideoElement>;

  clinic: Clinic | null = null;
  loading = true;
  errorMessage: string | null = null;
  backendBaseUrl = 'http://localhost:5000';
  imageLoadingStatus: { [doctorId: string]: boolean } = {};
  videoLoaded: { [videoPath: string]: boolean } = {};
  selectedVideo: ClinicVideo | null = null;
  currentVideoIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private clinicService: ClinicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClinicData();
  }

  private loadClinicData(): void {
    const clinicName = decodeURIComponent(this.route.snapshot.paramMap.get('name') || '');
    console.log('اسم العيادة من الراوتر:', clinicName);

    if (!clinicName) {
      this.handleError('لم يتم توفير اسم العيادة.');
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.clinicService.getClinicByName(clinicName).pipe(
      catchError(err => {
        console.error('خطأ في جلب العيادة:', err);
        this.handleError('فشل في جلب تفاصيل العيادة من الخادم.');
        return of(null);
      })
    ).subscribe({
      next: (clinicData: Clinic | null) => {
        if (!clinicData) {
          this.handleError('العيادة غير موجودة.');
          return;
        }

        this.processClinicData(clinicData);
        this.loading = false;
        console.log('تم جلب العيادة:', this.clinic);
      }
    });
  }

  private processClinicData(clinicData: Clinic): void {
    this.clinic = this.prepareClinicData(clinicData);
    this.initializeLoadingStates();
    this.initializeVideoPlayer();
  }

  private prepareClinicData(clinicData: Clinic): Clinic {
    return {
      ...clinicData,
      icon: clinicData.icon || '🏥',
      color: clinicData.color || '#00B4D8',
      gradient: clinicData.gradient || 'linear-gradient(135deg, #00B4D8 0%, #00D68F 100%)',
      bgPattern: clinicData.bgPattern || 'general',
      nameEn: clinicData.nameEn || clinicData.name,
      description: clinicData.description || clinicData.about || 'لا توجد وصف متاح.',
      about: clinicData.about || clinicData.description || 'لا توجد معلومات إضافية.',
      email: clinicData.email || 'غير متوفر',
      phone: clinicData.phone || 'غير متوفر',
      address: clinicData.address || 'غير متوفر',
      specializationType: clinicData.specializationType || 'specialized',
      status: clinicData.status || 'active',
      availableDays: clinicData.availableDays || [],
      price: clinicData.price || 0,
      bookingsToday: clinicData.bookingsToday || 0,
      bookingsLast7Days: clinicData.bookingsLast7Days || 0,
      bookingsLast30Days: clinicData.bookingsLast30Days || 0,
      totalBookings: clinicData.totalBookings || 0,
      createdAt: clinicData.createdAt || new Date().toISOString(),
      updatedAt: clinicData.updatedAt || new Date().toISOString(),
      doctors: this.prepareDoctorsData(clinicData.doctors || []),
      specialWords: clinicData.specialWords || [],
      specialties: clinicData.specialties || [],
      videos: (clinicData.videos || []).map(video => ({
        ...video,
        thumbnail: video.thumbnail || '/assets/images/video-poster.jpg'
      })),
      doctorIds: clinicData.doctorIds || []
    };
  }

  private prepareDoctorsData(doctors: ClinicDoctor[]): ClinicDoctor[] {
    return doctors.map(doctor => ({
      ...doctor,
      yearsOfExperience: doctor.yearsOfExperience || 0,
      specialWords: doctor.specialWords || [],
      specialties: doctor.specialties || [],
      about: doctor.about || 'لا توجد نبذة متاحة.',
      image: doctor.image || null,
      status: doctor.status || 'متاح',
      specialization: doctor.specialization || 'طب عام',
      email: doctor.email || 'غير متوفر'
    }));
  }

  private initializeLoadingStates(): void {
    this.clinic?.doctors?.forEach(doctor => {
      this.imageLoadingStatus[doctor._id] = false;
    });

    this.clinic?.videos?.forEach(video => {
      this.videoLoaded[video.path] = false;
    });
  }

  private initializeVideoPlayer(): void {
    if (this.clinic?.videos && this.clinic.videos.length > 0) {
      this.selectedVideo = this.clinic.videos[0];
      this.currentVideoIndex = 0;
    }
  }

  private handleError(message: string): void {
    this.loading = false;
    this.errorMessage = message;
  }

  getDoctorImageUrl(doctor: ClinicDoctor): string | null {
    if (!doctor.image) {
      return null;
    }
    return doctor.image.startsWith('http')
      ? doctor.image
      : `${this.backendBaseUrl}${doctor.image.startsWith('/') ? '' : '/'}${doctor.image}`;
  }

  getVideoUrl(video: ClinicVideo): string {
    if (!video?.path) return '';
    return video.path.startsWith('http')
      ? video.path
      : `${this.backendBaseUrl}/videos/${video.path.replace(/^\/+/, '')}`;
  }

  getVideoIndex(): number {
    if (!this.clinic?.videos || !this.selectedVideo) return 0;
    const index = this.clinic.videos.findIndex(video => video.path === this.selectedVideo?.path);
    return index >= 0 ? index : 0;
  }

  selectVideo(video: ClinicVideo): void {
    if (this.selectedVideo?.path === video.path) return;

    this.selectedVideo = video;
    this.currentVideoIndex = this.clinic?.videos?.findIndex(v => v.path === video.path) || 0;
    this.videoLoaded[video.path] = false;

    if (this.mainVideoPlayer?.nativeElement) {
      this.mainVideoPlayer.nativeElement.load();
      this.mainVideoPlayer.nativeElement.play().catch(error => {
        console.error('Error playing video:', error);
        this.showVideoErrorMessage();
      });
    }
  }

  bookAppointment(): void {
    if (this.clinic?._id) {
      this.router.navigate(['/appointment'], {
        queryParams: { clinicId: this.clinic._id }
      });
    } else {
      this.errorMessage = 'لا يمكن حجز موعد: لا يوجد معرف للعيادة.';
    }
  }

  bookAppointmentWithDoctor(doctorId: string): void {
    if (this.clinic?._id) {
      this.router.navigate(['/appointment'], {
        queryParams: { clinicId: this.clinic._id, doctorId }
      });
    } else {
      this.errorMessage = 'لا يمكن حجز موعد: لا يوجد معرف للعيادة.';
    }
  }

  scrollToContact(): void {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  openMap(): void {
    if (this.clinic?.address && this.clinic.address !== 'غير متوفر') {
      const encodedAddress = encodeURIComponent(this.clinic.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    } else {
      alert('عذراً، العنوان غير متوفر');
    }
  }

  translateDay(day: string): string {
    const dayTranslations: { [key: string]: string } = {
      'Monday': 'الإثنين',
      'Tuesday': 'الثلاثاء',
      'Wednesday': 'الأربعاء',
      'Thursday': 'الخميس',
      'Friday': 'الجمعة',
      'Saturday': 'السبت',
      'Sunday': 'الأحد',
      'All': 'كل الأيام'
    };
    return dayTranslations[day] || day;
  }

  getTranslatedAvailableDays(): string {
    if (this.clinic?.status === 'inactive') {
      return 'غير متاحة الآن';
    }
    if (!this.clinic?.availableDays?.length) {
      return 'غير محدد';
    }
    return this.clinic.availableDays
      .map(day => this.translateDay(day))
      .join(', ');
  }

  handleImageLoad(doctorId: string): void {
    this.imageLoadingStatus[doctorId] = true;
  }

  handleImageError(event: Event, doctorId: string): void {
    const imgElement = event.target as HTMLImageElement;
    console.error('خطأ في تحميل صورة الطبيب:', imgElement.src);

    this.imageLoadingStatus[doctorId] = true;
    imgElement.style.display = 'none';
    this.showImageErrorFallback(doctorId);
  }

  private showImageErrorFallback(doctorId: string): void {
    const doctor = this.clinic?.doctors?.find(d => d._id === doctorId);
    if (doctor) {
      console.log(`فشل تحميل صورة الطبيب: ${doctor.name}`);
      doctor.image = null;
    }
  }

  handleVideoLoad(videoPath: string): void {
    this.videoLoaded[videoPath] = true;
  }

  handleVideoError(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    console.error('خطأ في تحميل الفيديو:', videoElement.src);

    if (this.selectedVideo) {
      this.videoLoaded[this.selectedVideo.path] = true;
    }

    this.showVideoErrorMessage();
  }

  private showVideoErrorMessage(): void {
    console.log('فشل في تحميل الفيديو. يرجى المحاولة مرة أخرى.');
  }

  getSpecialtyLimit(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768 ? 6 : 4;
    }
    return 6;
  }

  hasContactInfo(): boolean {
    if (!this.clinic) return false;

    const hasPhone = !!(this.clinic.phone && this.clinic.phone !== 'غير متوفر');
    const hasAddress = !!(this.clinic.address && this.clinic.address !== 'غير متوفر');

    return hasPhone || hasAddress;
  }

  hasStatistics(): boolean {
    if (!this.clinic) return false;

    return !!(
      this.clinic.totalBookings ||
      this.clinic.bookingsToday ||
      this.clinic.bookingsLast7Days ||
      this.clinic.bookingsLast30Days
    );
  }

  getClinicRating(): number {
    return 4.5;
  }

  getRatingStars(): string[] {
    const rating = this.getClinicRating();
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    if (hasHalfStar) {
      stars.push('☆');
    }

    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('خطأ في تنسيق التاريخ:', error);
      return dateString;
    }
  }

  getEstablishmentYear(): string {
    if (!this.clinic?.createdAt) return '';

    try {
      const date = new Date(this.clinic.createdAt);
      return date.getFullYear().toString();
    } catch (error) {
      return '';
    }
  }

  isDoctorActive(doctor: ClinicDoctor): boolean {
    return doctor.status === 'متاح';
  }

  getDoctorStatusText(doctor: ClinicDoctor): string {
    return doctor.status;
  }

  isDoctorAvailable(doctor: ClinicDoctor): boolean {
    return this.isDoctorActive(doctor);
  }

  getDoctorSpecialtiesCount(doctor: ClinicDoctor): number {
    return doctor.specialWords?.length || 0;
  }

  retryLoad(): void {
    this.ngOnInit();
  }

  getClinicIcon(): string {
    if (!this.clinic?.specializationType) return '🏥';
    switch (this.clinic.specializationType.toLowerCase()) {
      case 'dental':
        return '🦷';
      case 'pediatrics':
        return '👶';
      case 'cardiology':
        return '❤️';
      case 'orthopedics':
        return '🦴';
      case 'dermatology':
        return '🧴';
      default:
        return '🏥';
    }
  }

  ngOnDestroy(): void {
    if (this.mainVideoPlayer?.nativeElement) {
      try {
        this.mainVideoPlayer.nativeElement.pause();
      } catch (error) {
        console.error('Error pausing video in ngOnDestroy:', error);
      }
    }
  }
}
