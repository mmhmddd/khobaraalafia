import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../core/services/auth.service';
import { Booking, BookingService } from '../../core/services/booking.service';
import { ClinicService, Clinic } from '../../core/services/clinic.service';
import dayjs from 'dayjs';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";

@Component({
  selector: 'app-booking-options',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    SidebarComponent
],
  templateUrl: './booking-options.component.html',
  styleUrls: ['./booking-options.component.scss']
})
export class BookingOptionsComponent implements OnInit {
  bookingForm: FormGroup;
  clinics: Clinic[] = [];
  myBookings: Booking[] = [];
  allBookings: Booking[] = [];
  validDays: string[] = [];
  validTimeSlots: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]; // Static time slots
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isAdmin = false;
  isLoading = false;
  showModal = false;
  showDeleteModal = false;
  bookingToDelete: string | null = null;
  today: Date;
  selectedDateDay: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private clinicService: ClinicService,
    private authService: AuthService
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.bookingForm = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(3)]],
      clientAge: ['', [Validators.required, Validators.min(1)]],
      clientPhone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      clientAddress: ['', [Validators.required, Validators.minLength(5)]],
      clientEmail: ['', [Validators.required, Validators.email]],
      clinicId: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator.bind(this)]],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول أولاً';
      this.isLoading = false;
      return;
    }
    this.loadClinics();
    this.loadMyBookings();
    this.checkAdminStatus();
    this.bookingForm.get('clinicId')?.valueChanges.subscribe(() => this.onClinicChange());
    this.bookingForm.get('date')?.valueChanges.subscribe(() => this.onDateChange());
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const date = control.value;
    if (date && this.validDays.length) {
      const selectedDay = dayjs(date).format('dddd');
      const validDaysSet = new Set(this.validDays.includes('All') ?
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] :
        this.validDays);
      if (!validDaysSet.has(selectedDay)) {
        return { invalidDate: `التاريخ المحدد (${this.translateDay(selectedDay)}) غير متاح لهذه العيادة` };
      }
    }
    return null;
  }

  loadClinics(): void {
    this.isLoading = true;
    this.clinicService.getAllClinics().subscribe({
      next: (data) => {
        this.clinics = data.filter(clinic => clinic.status === 'active');
        this.errorMessage = this.clinics.length ? null : 'لا توجد عيادات متاحة';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.translateError(err.error?.message || 'فشل في تحميل العيادات');
        console.error('Error loading clinics:', err);
        this.isLoading = false;
      }
    });
  }

  loadMyBookings(): void {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.myBookings = data;
        this.errorMessage = this.myBookings.length ? null : 'لا توجد حجوزات لعرضها';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.translateError(err.error?.message || 'فشل في تحميل الحجوزات');
        console.error('Error loading bookings:', err);
        this.isLoading = false;
      }
    });
  }

  loadAllBookings(): void {
    if (this.isAdmin) {
      this.isLoading = true;
      this.bookingService.getAllBookings().subscribe({
        next: (data) => {
          this.allBookings = data;
          this.errorMessage = this.allBookings.length ? null : 'لا توجد حجوزات لعرضها';
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = this.translateError(err.error?.message || 'فشل في تحميل جميع الحجوزات');
          console.error('Error loading all bookings:', err);
          this.isLoading = false;
        }
      });
    }
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.loadAllBookings();
    }
  }

  onClinicChange(): void {
    const clinicId = this.bookingForm.get('clinicId')?.value;
    this.validDays = [];
    this.validTimeSlots = [];
    this.bookingForm.patchValue({ date: '', time: '' });
    this.selectedDateDay = null;
    if (clinicId) {
      this.isLoading = true;
      this.bookingService.getValidDays(clinicId).subscribe({
        next: (days) => {
          this.validDays = days;
          this.errorMessage = this.validDays.length ? null : 'لا توجد أيام متاحة لهذه العيادة';
          this.validTimeSlots = this.validDays.length ? this.getStaticTimeSlots() : [];
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = this.translateError(err.error?.message || 'فشل في تحميل الأيام المتاحة');
          console.error('Error fetching valid days:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = null;
      this.isLoading = false;
    }
  }

  onDateChange(): void {
    const { clinicId, date } = this.bookingForm.value;
    this.selectedDateDay = date ? `${this.formatDate(date)} (${this.translateDay(dayjs(date).format('dddd'))})` : null;
    this.validTimeSlots = [];
    this.bookingForm.patchValue({ time: '' });
    if (clinicId && date) {
      this.validTimeSlots = this.validDays.length ? this.getStaticTimeSlots() : [];
      this.errorMessage = this.validTimeSlots.length ? null : 'لا توجد مواعيد متاحة لهذا اليوم';
    }
    this.bookingForm.get('date')?.updateValueAndValidity();
  }

  getStaticTimeSlots(): string[] {
    // Return static time slots if valid days are available
    return this.validDays.length ? [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ] : [];
  }

  createBooking(): void {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      const { clientName, clientAge, clientPhone, clientAddress, clientEmail, clinicId, date, time, notes } = this.bookingForm.value;
      this.bookingService.createBooking({
        clientName,
        clientAge,
        clientPhone,
        clientAddress,
        clientEmail,
        clinicId,
        date: this.formatDate(new Date(date)),
        time,
        notes
      }).subscribe({
        next: (booking) => {
          this.myBookings.push(booking);
          this.successMessage = `تم إنشاء الحجز بنجاح (الرمز: ${booking.confirmationCode})`;
          this.closeModal();
          setTimeout(() => this.successMessage = null, 3000);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = this.translateError(err.error?.message || 'فشل في إنشاء الحجز');
          setTimeout(() => this.errorMessage = null, 5000);
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      setTimeout(() => this.errorMessage = null, 5000);
      this.isLoading = false;
    }
  }

  openDeleteModal(id: string): void {
    this.bookingToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.bookingToDelete) {
      this.isLoading = true;
      this.bookingService.cancelBooking(this.bookingToDelete).subscribe({
        next: () => {
          this.myBookings = this.myBookings.map(b => b._id === this.bookingToDelete ? { ...b, status: 'cancelled' } : b);
          if (this.isAdmin) {
            this.loadAllBookings();
          }
          this.successMessage = 'تم إلغاء الحجز بنجاح';
          this.errorMessage = null;
          this.closeDeleteModal();
          setTimeout(() => this.successMessage = null, 3000);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = this.translateError(err.error?.message || 'فشل في إلغاء الحجز');
          setTimeout(() => this.errorMessage = null, 5000);
          console.error('Error cancelling booking:', err);
          this.isLoading = false;
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.bookingToDelete = null;
  }

  openAddBookingModal(): void {
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.bookingForm.reset({
      clientName: '',
      clientAge: '',
      clientPhone: '',
      clientAddress: '',
      clientEmail: '',
      clinicId: '',
      date: '',
      time: '',
      notes: ''
    });
    this.validDays = [];
    this.validTimeSlots = [];
    this.selectedDateDay = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  translateDay(day: string): string {
    const dayTranslations: { [key: string]: string } = {
      Monday: 'الإثنين',
      Tuesday: 'الثلاثاء',
      Wednesday: 'الأربعاء',
      Thursday: 'الخميس',
      Friday: 'الجمعة',
      Saturday: 'السبت',
      Sunday: 'الأحد'
    };
    return dayTranslations[day] || day;
  }

  translateError(message: string): string {
    const errorTranslations: { [key: string]: string } = {
      'الرجاء تقديم معرف العيادة': 'يرجى تقديم معرف العيادة',
      'العيادة غير موجودة': 'العيادة غير موجودة',
      'العيادة غير متاحة في هذا اليوم': 'العيادة غير متاحة في هذا اليوم',
      'الموعد غير متاح': 'الموعد غير متاح',
      'الحجز غير موجود': 'الحجز غير موجود',
      'غير مصرح': 'غير مصرح'
    };
    return errorTranslations[message] || message;
  }
}
