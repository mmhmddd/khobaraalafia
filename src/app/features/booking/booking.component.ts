import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookingService, Booking } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';

interface Clinic {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  color?: string;
  isAvailableForBooking: boolean;
}

interface BookingTranslations {
  hero_title: string;
  hero_description: string;
  step_1_label: string;
  step_2_label: string;
  step_3_label: string;
  step_1_title: string;
  step_1_description: string;
  step_2_title: string;
  step_2_description: string;
  step_3_title: string;
  step_3_description: string;
  name_label: string;
  name_placeholder: string;
  phone_label: string;
  phone_placeholder: string;
  clinic_label: string;
  appointment_date_label: string;
  appointment_time_label: string;
  previous_button: string;
  next_button: string;
  submit_button: string;
  time_period_am: string;
  time_period_pm: string;
  success_title: string;
  success_message: string;
  booking_number_label: string;
  confirmation_code_label: string;
  clinic_name_label: string;
  date_label: string;
  time_label: string;
  book_another_button: string;
  back_to_home_button: string;
  login_required_error: string;
  server_error: string;
  required_field: string;
  min_length: string;
  invalid_phone: string;
  close_popup: string;
  screenshot_hint: string;
  download_booking_details: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, OnDestroy {
  bookingForm: FormGroup;
  isLoading = false;
  isSubmitted = false;
  currentStep = 1;
  totalSteps = 3;
  errorMessage: string = '';
  createdBooking: Booking | null = null;
  clinics: Clinic[] = [];
  selectedClinic: Clinic | null = null;
  minDate: string;
  maxDate: string;
  minTime: string = '08:00';
  maxTime: string = '18:00';
  isDateSelected = false;
  translations: BookingTranslations = {
    hero_title: '',
    hero_description: '',
    step_1_label: '',
    step_2_label: '',
    step_3_label: '',
    step_1_title: '',
    step_1_description: '',
    step_2_title: '',
    step_2_description: '',
    step_3_title: '',
    step_3_description: '',
    name_label: '',
    name_placeholder: '',
    phone_label: '',
    phone_placeholder: '',
    clinic_label: '',
    appointment_date_label: '',
    appointment_time_label: '',
    previous_button: '',
    next_button: '',
    submit_button: '',
    time_period_am: '',
    time_period_pm: '',
    success_title: '',
    success_message: '',
    booking_number_label: '',
    confirmation_code_label: '',
    clinic_name_label: '',
    date_label: '',
    time_label: '',
    book_another_button: '',
    back_to_home_button: '',
    login_required_error: '',
    server_error: '',
    required_field: '',
    min_length: '',
    invalid_phone: '',
    close_popup: '',
    screenshot_hint: '',
    download_booking_details: ''
  };
  private languageSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private translationService: TranslationService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const maxDateObj = new Date(today);
    maxDateObj.setMonth(today.getMonth() + 3);
    this.maxDate = maxDateObj.toISOString().split('T')[0];

    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,15}$/)]],
      clinicId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required]
    });
  }

  getCurrentLanguage(): string {
    return this.translationService.getCurrentLanguageValue();
  }

  ngOnInit(): void {
    this.loadTranslations();
    this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(() => {
      this.loadTranslations();
    });

    this.bookingService.getClinics().subscribe({
      next: (clinics) => {
        this.clinics = clinics
          .filter(clinic => clinic._id && clinic.isAvailableForBooking)
          .map(clinic => ({
            id: clinic._id!,
            name: clinic.name,
            nameEn: clinic.name,
            icon: clinic.icon || '🏥',
            color: clinic.color || '#0EA5E9',
            isAvailableForBooking: clinic.isAvailableForBooking
          }));
      },
      error: (err) => {
        this.errorMessage = this.translations.server_error;
        console.error('Error fetching clinics:', err);
      }
    });

    this.bookingForm.get('clinicId')?.valueChanges.subscribe(clinicId => {
      this.onClinicChange(clinicId);
    });

    this.bookingForm.get('appointmentDate')?.valueChanges.subscribe(value => {
      this.isDateSelected = !!value;
      if (value) {
        this.bookingForm.get('appointmentTime')?.setValue('');
      }
    });

    this.bookingForm.get('appointmentTime')?.valueChanges.subscribe(value => {
      if (value) {
        this.bookingForm.get('appointmentTime')?.markAsTouched();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private loadTranslations(): void {
    this.translations = {
      hero_title: this.translationService.getStringTranslation('booking_section.hero_title'),
      hero_description: this.translationService.getStringTranslation('booking_section.hero_description'),
      step_1_label: this.translationService.getStringTranslation('booking_section.step_1_label'),
      step_2_label: this.translationService.getStringTranslation('booking_section.step_2_label'),
      step_3_label: this.translationService.getStringTranslation('booking_section.step_3_label'),
      step_1_title: this.translationService.getStringTranslation('booking_section.step_1_title'),
      step_1_description: this.translationService.getStringTranslation('booking_section.step_1_description'),
      step_2_title: this.translationService.getStringTranslation('booking_section.step_2_title'),
      step_2_description: this.translationService.getStringTranslation('booking_section.step_2_description'),
      step_3_title: this.translationService.getStringTranslation('booking_section.step_3_title'),
      step_3_description: this.translationService.getStringTranslation('booking_section.step_3_description'),
      name_label: this.translationService.getStringTranslation('booking_section.name_label'),
      name_placeholder: this.translationService.getStringTranslation('booking_section.name_placeholder'),
      phone_label: this.translationService.getStringTranslation('booking_section.phone_label'),
      phone_placeholder: this.translationService.getStringTranslation('booking_section.phone_placeholder'),
      clinic_label: this.translationService.getStringTranslation('booking_section.clinic_label'),
      appointment_date_label: this.translationService.getStringTranslation('booking_section.appointment_date_label'),
      appointment_time_label: this.translationService.getStringTranslation('booking_section.appointment_time_label'),
      previous_button: this.translationService.getStringTranslation('booking_section.previous_button'),
      next_button: this.translationService.getStringTranslation('booking_section.next_button'),
      submit_button: this.translationService.getStringTranslation('booking_section.submit_button'),
      time_period_am: this.translationService.getStringTranslation('booking_section.time_period_am'),
      time_period_pm: this.translationService.getStringTranslation('booking_section.time_period_pm'),
      success_title: this.translationService.getStringTranslation('booking_section.success_title'),
      success_message: this.translationService.getStringTranslation('booking_section.success_message'),
      booking_number_label: this.translationService.getStringTranslation('booking_section.booking_number_label'),
      confirmation_code_label: this.translationService.getStringTranslation('booking_section.confirmation_code_label'),
      clinic_name_label: this.translationService.getStringTranslation('booking_section.clinic_name_label'),
      date_label: this.translationService.getStringTranslation('booking_section.date_label'),
      time_label: this.translationService.getStringTranslation('booking_section.time_label'),
      book_another_button: this.translationService.getStringTranslation('booking_section.book_another_button'),
      back_to_home_button: this.translationService.getStringTranslation('booking_section.back_to_home_button'),
      login_required_error: this.translationService.getStringTranslation('booking_section.login_required_error'),
      server_error: this.translationService.getStringTranslation('booking_section.server_error'),
      required_field: this.translationService.getStringTranslation('booking_section.required_field'),
      min_length: this.translationService.getStringTranslation('booking_section.min_length'),
      invalid_phone: this.translationService.getStringTranslation('booking_section.invalid_phone'),
      close_popup: this.translationService.getStringTranslation('booking_section.close_popup'),
      screenshot_hint: this.translationService.getStringTranslation('booking_section.screenshot_hint'),
      download_booking_details: this.translationService.getStringTranslation('booking_section.download_booking_details')
    };
  }

  selectClinic(clinicId: string): void {
    this.bookingForm.get('clinicId')?.setValue(clinicId);
    if (this.currentStep === 2 && this.isCurrentStepValid()) {
      this.scrollToNextButton();
    }
  }

  onClinicChange(clinicId: string): void {
    this.selectedClinic = this.clinics.find(c => c.id === clinicId) || null;
  }

  onDateClick(): void {
    this.isDateSelected = true;
  }

  onTimeClick(): void {
    // Trigger the time picker
    const timeInput = document.getElementById('appointmentTime') as HTMLInputElement;
    if (timeInput) {
      timeInput.showPicker?.();
    }
  }

  getTimeHint(timeValue: string): string {
    if (!timeValue) return '';

    const [hours, minutes] = timeValue.split(':');
    const hourNum = parseInt(hours, 10);

    if (hourNum < 12) {
      return `${this.translations.time_period_am} (${this.translations.appointment_time_label})`;
    } else {
      return `${this.translations.time_period_pm} (${this.translations.appointment_time_label})`;
    }
  }

  formatTimeForDisplay(timeValue: string): string {
    if (!timeValue) return '';

    const [hours, minutes] = timeValue.split(':');
    const hourNum = parseInt(hours, 10);

    if (hourNum < 12) {
      return `${timeValue} ${this.translations.time_period_am}`;
    } else {
      return `${timeValue} ${this.translations.time_period_pm}`;
    }
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
          this.bookingForm.get('phone')?.valid
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
      const fieldLabelMap: { [key: string]: keyof BookingTranslations } = {
        name: 'name_label',
        phone: 'phone_label',
        clinicId: 'clinic_label',
        appointmentDate: 'appointment_date_label',
        appointmentTime: 'appointment_time_label'
      };

      const label = this.translations[fieldLabelMap[fieldName]] || fieldName;

      if (field.errors['required']) {
        return `${label} ${this.translations.required_field}`;
      }
      if (field.errors['minlength']) {
        return this.translations.min_length.replace('{length}', field.errors['minlength'].requiredLength);
      }
      if (field.errors['pattern']) {
        return this.translations.invalid_phone;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = {
        clientName: this.bookingForm.get('name')?.value,
        clientPhone: this.bookingForm.get('phone')?.value,
        clinicId: this.bookingForm.get('clinicId')?.value,
        date: this.datePipe.transform(this.bookingForm.get('appointmentDate')?.value, 'yyyy-MM-dd')!,
        time: this.bookingForm.get('appointmentTime')?.value
      };

      this.bookingService.createBooking(formData).subscribe({
        next: (response) => {
          this.createdBooking = response.booking;
          this.isLoading = false;
          this.isSubmitted = true;
        },
        error: (err) => {
          console.error('Booking error:', err);
          this.errorMessage = this.translations.server_error;
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  closePopup(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('popup-overlay') || target.classList.contains('close-button')) {
      this.isSubmitted = false;
      this.createdBooking = null;
    }
  }

  downloadBookingDetails(): void {
    if (this.createdBooking && this.selectedClinic) {
      const clinicName = this.getCurrentLanguage() === 'ar' ? this.selectedClinic.name : this.selectedClinic.nameEn;
      const formattedTime = this.formatTimeForDisplay(this.createdBooking.time);
      const bookingDetails = `
        ${this.translations.booking_number_label}: ${this.createdBooking._id}
        ${this.translations.confirmation_code_label}: ${this.createdBooking.confirmationCode}
        ${this.translations.clinic_name_label}: ${clinicName}
        ${this.translations.date_label}: ${this.datePipe.transform(this.createdBooking.date, 'mediumDate')}
        ${this.translations.time_label}: ${formattedTime}
      `;
      const blob = new Blob([bookingDetails], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `booking-details-${this.createdBooking._id}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
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
    this.isDateSelected = false;
    this.scrollToFormTop();
  }

  trackByClinicId(index: number, clinic: Clinic): string {
    return clinic.id;
  }
}
