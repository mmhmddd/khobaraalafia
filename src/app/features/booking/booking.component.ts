import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookingService, Booking } from '../../core/services/booking.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface Clinic {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  currentStep = 1;
  totalSteps = 3;
  errorMessage: string = '';
  createdBooking: Booking | null = null;
  clinics: Clinic[] = [];
  availableTimes: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00'
  ];
  displayedTimes: string[] = [];
  timesPerPage = 6;
  currentTimePage = 1;
  selectedClinic: Clinic | null = null;
  minDate: string;
  maxDate: string;
  isDateSelected = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const maxDateObj = new Date(today);
    maxDateObj.setMonth(today.getMonth() + 3);
    this.maxDate = maxDateObj.toISOString().split('T')[0];

    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      clinicId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.bookingService.getClinics().subscribe({
      next: (clinics) => {
        this.clinics = clinics
          .filter(clinic => clinic._id)
          .map(clinic => ({
            id: clinic._id!,
            name: clinic.name,
            nameEn: clinic.name,
            icon: clinic.icon || '🏥',
            color: clinic.color || '#0EA5E9'
          }));
      },
      error: (err) => {
        this.errorMessage = 'خطأ في تحميل قائمة العيادات. حاول مرة أخرى.';
        console.error('Error fetching clinics:', err);
      }
    });

    this.bookingForm.get('clinicId')?.valueChanges.subscribe(clinicId => {
      this.onClinicChange(clinicId);
    });

    this.bookingForm.get('appointmentDate')?.valueChanges.subscribe(value => {
      this.isDateSelected = !!value;
    });

    this.updateDisplayedTimes();
  }

  selectClinic(clinicId: string): void {
    this.bookingForm.get('clinicId')?.setValue(clinicId);
    if (this.currentStep === 2 && this.isCurrentStepValid()) {
      this.scrollToNextButton();
    }
  }

  onClinicChange(clinicId: string): void {
    this.selectedClinic = this.clinics.find(c => c.id === clinicId) || null;
    this.bookingForm.get('appointmentTime')?.setValue('');
    this.currentTimePage = 1;
    this.updateDisplayedTimes();
  }

  updateDisplayedTimes(): void {
    const start = (this.currentTimePage - 1) * this.timesPerPage;
    this.displayedTimes = this.availableTimes.slice(start, start + this.timesPerPage);
  }

  loadMoreTimes(): void {
    const previousLastTime = this.displayedTimes[this.displayedTimes.length - 1];
    this.currentTimePage++;
    this.updateDisplayedTimes();
    setTimeout(() => {
      const lastTimeElement = document.querySelector(`.time-slot .time-text:not([textContent="${previousLastTime}"])`);
      if (lastTimeElement) {
        lastTimeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  loadPreviousTimes(): void {
    if (this.currentTimePage > 1) {
      const previousFirstTime = this.displayedTimes[0];
      this.currentTimePage--;
      this.updateDisplayedTimes();
      setTimeout(() => {
        const firstTimeElement = document.querySelector(`.time-slot .time-text:not([textContent="${previousFirstTime}"])`);
        if (firstTimeElement) {
          firstTimeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 0);
    }
  }

  get hasMoreTimes(): boolean {
    return this.currentTimePage * this.timesPerPage < this.availableTimes.length;
  }

  get hasPreviousTimes(): boolean {
    return this.currentTimePage > 1;
  }

  onDateClick(): void {
    this.isDateSelected = true;
  }

  scrollToNextButton(): void {
    const nextButton = document.querySelector('.form-navigation .btn-primary');
    if (nextButton) {
      nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.isCurrentStepValid()) {
        this.currentStep++;
        this.scrollToFormTop();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToFormTop();
    }
  }

  private scrollToFormTop(): void {
    const formElement = document.querySelector('.booking-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(
          this.bookingForm.get('name')?.valid &&
          this.bookingForm.get('email')?.valid &&
          this.bookingForm.get('phone')?.valid &&
          this.bookingForm.get('address')?.valid
        );
      case 2:
        return !!this.bookingForm.get('clinicId')?.valid;
      case 3:
        return !!(
          this.bookingForm.get('appointmentDate')?.valid &&
          this.bookingForm.get('appointmentTime')?.valid
        );
      default:
        return false;
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'هذا الحقل مطلوب';
      if (field.errors['email']) return 'يرجى إدخال بريد إلكتروني صحيح';
      if (field.errors['minlength']) return `يجب أن يكون النص ${field.errors['minlength'].requiredLength} أحرف على الأقل`;
      if (field.errors['pattern']) return 'يرجى إدخال رقم هاتف صحيح';
    }
    return '';
  }

  onSubmit(): void {
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول لحجز موعد';
      return;
    }

    if (this.bookingForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = {
        clientName: this.bookingForm.get('name')?.value,
        clientEmail: this.bookingForm.get('email')?.value,
        clientPhone: this.bookingForm.get('phone')?.value,
        clientAddress: this.bookingForm.get('address')?.value,
        clinicId: this.bookingForm.get('clinicId')?.value,
        date: this.datePipe.transform(this.bookingForm.get('appointmentDate')?.value, 'yyyy-MM-dd')!,
        time: this.bookingForm.get('appointmentTime')?.value
      };

      this.bookingService.createBooking(formData).subscribe({
        next: (booking) => {
          this.createdBooking = booking;
          this.isLoading = false;
          this.isSubmitted = true;
        },
        error: (err) => {
          console.error('Booking error:', err);
          this.errorMessage = err.error?.message || 'حدث خطأ أثناء تأكيد الحجز. حاول مرة أخرى.';
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.bookingForm.reset();
    this.currentStep = 1;
    this.isSubmitted = false;
    this.isLoading = false;
    this.errorMessage = '';
    this.createdBooking = null;
    this.selectedClinic = null;
    this.currentTimePage = 1;
    this.isDateSelected = false;
    this.updateDisplayedTimes();
    this.scrollToFormTop();
  }

  trackByClinicId(index: number, clinic: Clinic): string {
    return clinic.id;
  }

  trackByTime(index: number, time: string): string {
    return time;
  }
}
