import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Booking, BookingService } from '../../core/services/booking.service';
import { ClinicService, Clinic } from '../../core/services/clinic.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

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
    MatFormFieldModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './booking-options.component.html',
  styleUrls: ['./booking-options.component.scss']
})
export class BookingOptionsComponent implements OnInit {
  bookingForm: FormGroup;
  clinics: Clinic[] = [];
  todayBookings: Booking[] = [];
  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];

  validTimeSlots: string[] = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isAdmin = false;
  isLoading = false;
  showModal = false;
  showDeleteModal = false;
  bookingToDelete: string | null = null;
  filterStatus: string = 'all';
  filterClinicId: string = '';
  today: Date;

  private clinicColors: Map<string, string> = new Map([
    ['1', '#3B82F6'],
    ['2', '#8B5CF6'],
    ['3', '#EC4899'],
    ['4', '#F59E0B'],
    ['5', '#10B981'],
    ['6', '#06B6D4'],
    ['7', '#EF4444'],
    ['8', '#6366F1']
  ]);

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
      clientPhone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      clientAddress: ['', [Validators.required, Validators.minLength(5)]],
      clientEmail: ['', [Validators.required, Validators.email]],
      clinicId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول أولاً';
      return;
    }

    this.checkAdminStatus();
    this.loadClinics();
    this.loadAllBookings();
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  loadClinics(): void {
    this.isLoading = true;
    this.clinicService.getAllClinics().subscribe({
      next: (data) => {
        this.clinics = data.filter(clinic => clinic.status === 'active');
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'فشل في تحميل العيادات';
        console.error('Error loading clinics:', err);
        this.isLoading = false;
      }
    });
  }

  loadAllBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.allBookings = data.filter(booking => booking._id);
        this.filterTodayBookings(data);
        this.filterBookingsByClinic();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'فشل في تحميل الحجوزات';
        console.error('Error loading bookings:', err);
        this.isLoading = false;
      }
    });
  }

  filterTodayBookings(bookings: Booking[]): void {
    const todayDate = this.formatDate(this.today);
    this.todayBookings = bookings.filter(booking => {
      const bookingDate = this.formatDate(new Date(booking.date));
      return bookingDate === todayDate && booking._id;
    });
  }

  filterBookingsByClinic(): void {
    console.log('Filtering bookings with status:', this.filterStatus, 'and clinic ID:', this.filterClinicId);
    let filtered = this.allBookings;

    if (this.filterClinicId) {
      filtered = filtered.filter(booking => booking.clinic?._id === this.filterClinicId);
    }

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === this.filterStatus);
    }

    this.filteredBookings = filtered;
  }

  setFilterStatus(status: string): void {
    console.log('Setting filter status to:', status);
    this.filterStatus = status;
    this.filterBookingsByClinic();
  }

  getFilteredBookings(): Booking[] {
    return this.filteredBookings;
  }

  getClinicColor(clinicId?: string): string {
    if (!clinicId) return '#0E7490';

    const index = this.clinics.findIndex(c => c._id === clinicId);
    if (index === -1) return '#0E7490';

    const colorIndex = (index % 8 + 1).toString();
    return this.clinicColors.get(colorIndex) || '#0E7490';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'قيد الانتظار',
      'confirmed': 'مؤكد',
      'cancelled': 'ملغي',
      'completed': 'مكتمل'
    };
    return statusMap[status] || status;
  }

  openAddBookingModal(): void {
    console.log('Opening add booking modal');
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    console.log('Closing add booking modal');
    this.showModal = false;
    this.resetForm();
  }

  openDeleteModal(id: string | undefined): void {
    if (!id) {
      console.error('Cannot open delete modal: Booking ID is undefined');
      this.errorMessage = 'خطأ: معرف الحجز غير متوفر';
      setTimeout(() => this.errorMessage = null, 5000);
      return;
    }
    console.log('Opening delete modal for booking ID:', id);
    this.bookingToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    console.log('Closing delete modal');
    this.showDeleteModal = false;
    this.bookingToDelete = null;
  }

  confirmDelete(): void {
    if (!this.bookingToDelete) {
      console.error('Cannot delete: No booking ID set');
      this.errorMessage = 'خطأ: لا يوجد حجز للإلغاء';
      setTimeout(() => this.errorMessage = null, 5000);
      return;
    }

    console.log('Confirming deletion for booking ID:', this.bookingToDelete);
    this.isLoading = true;
    this.bookingService.cancelBooking(this.bookingToDelete).subscribe({
      next: () => {
        this.successMessage = 'تم إلغاء الحجز بنجاح';
        this.loadAllBookings();
        this.closeDeleteModal();
        setTimeout(() => this.successMessage = null, 3000);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.translateError(err.error?.message) || 'فشل في إلغاء الحجز';
        console.error('Error canceling booking:', err);
        setTimeout(() => this.errorMessage = null, 5000);
        this.isLoading = false;
      }
    });
  }

  createBooking(): void {
    if (!this.bookingForm.valid) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      console.error('Form invalid:', this.bookingForm.errors);
      setTimeout(() => this.errorMessage = null, 5000);
      return;
    }

    this.isLoading = true;
    const formValue = this.bookingForm.value;
    console.log('Creating booking with data:', formValue);

    this.bookingService.createBooking({
      clientName: formValue.clientName,
      clientPhone: formValue.clientPhone,
      clientAddress: formValue.clientAddress,
      clientEmail: formValue.clientEmail,
      clinicId: formValue.clinicId,
      date: this.formatDate(new Date(formValue.date)),
      time: formValue.time
    }).subscribe({
      next: (booking) => {
        this.successMessage = `تم إنشاء الحجز بنجاح (رقم الحجز: ${booking['bookingNumber']})`;
        this.loadAllBookings();
        this.closeModal();
        setTimeout(() => this.successMessage = null, 5000);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.translateError(err.error?.message) || 'فشل في إنشاء الحجز';
        console.error('Error creating booking:', err);
        setTimeout(() => this.errorMessage = null, 5000);
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.bookingForm.reset({
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      clientEmail: '',
      clinicId: '',
      date: '',
      time: ''
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  translateError(message: string): string {
    const errorTranslations: { [key: string]: string } = {
      'Please provide clinic ID': 'يرجى تقديم معرف العيادة',
      'Clinic not found': 'العيادة غير موجودة',
      'Time slot not available': 'الموعد غير متاح',
      'Booking not found': 'الحجز غير موجود',
      'Unauthorized': 'غير مصرح'
    };
    return errorTranslations[message] || message;
  }
}
