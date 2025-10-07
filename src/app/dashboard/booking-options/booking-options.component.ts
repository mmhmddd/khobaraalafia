import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  showAddForm = false;
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
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.bookingForm = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(3)]],
      clientPhone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      clinicId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('BookingOptionsComponent initialized');
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول أولاً';
      this.router.navigate(['/login']);
      return;
    }
    this.checkAdminStatus();
    this.loadClinics();
    this.loadAllBookings();
    this.cdr.detectChanges();
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.isAdmin();
    console.log('Is admin:', this.isAdmin);
  }

  loadClinics(): void {
    this.isLoading = true;
    console.log('Loading clinics...');
    this.clinicService.getAllClinics().subscribe({
      next: (data) => {
        this.clinics = data.filter(clinic => clinic.status === 'active');
        console.log('Clinics loaded:', this.clinics);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'فشل في تحميل العيادات';
        console.error('Error loading clinics:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAllBookings(): void {
    this.isLoading = true;
    console.log('Loading bookings...');
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        // Sort bookings by createdAt (newest first)
        this.allBookings = data
          .filter(booking => booking._id)
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date + 'T' + a.time).getTime();
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date + 'T' + b.time).getTime();
            return dateB - dateA;
          });
        console.log('Bookings loaded and sorted:', this.allBookings);
        this.filterTodayBookings(this.allBookings);
        this.filterBookingsByClinic();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'فشل في تحميل الحجوزات';
        console.error('Error loading bookings:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterTodayBookings(bookings: Booking[]): void {
    const todayDate = this.formatDate(this.today);
    this.todayBookings = bookings
      .filter(booking => {
        const bookingDate = this.formatDate(new Date(booking.date));
        return bookingDate === todayDate && booking._id;
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date + 'T' + a.time).getTime();
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date + 'T' + b.time).getTime();
        return dateB - dateA;
      });
    console.log('Today bookings sorted:', this.todayBookings);
    this.cdr.detectChanges();
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

    // Sort filtered bookings by createdAt (newest first)
    this.filteredBookings = filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date + 'T' + a.time).getTime();
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date + 'T' + b.time).getTime();
      return dateB - dateA;
    });
    console.log('Filtered bookings sorted:', this.filteredBookings);
    this.cdr.detectChanges();
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

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
    console.log('Add form toggled:', this.showAddForm);
    this.cdr.detectChanges();
  }

  createBooking(): void {
    if (!this.bookingForm.valid) {
      this.showError('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
      this.bookingForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();
    const formValue = this.bookingForm.value;

    this.bookingService.createBooking({
      clientName: formValue.clientName,
      clientPhone: formValue.clientPhone,
      clinicId: formValue.clinicId,
      date: this.formatDate(new Date(formValue.date)),
      time: formValue.time
    }).subscribe({
      next: (response) => {
        this.showSuccess(`تم إنشاء الحجز بنجاح (رقم الحجز: ${response.booking.bookingNumber})`);
        this.loadAllBookings();
        this.toggleAddForm();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showError(this.translateError(err.error?.message) || 'فشل في إنشاء الحجز');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteBooking(id: string | undefined): void {
    if (!id) {
      this.showError('خطأ: معرف الحجز غير متوفر');
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء')) {
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.showSuccess('تم حذف الحجز بنجاح');
        this.loadAllBookings();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showError(this.translateError(err.error?.message) || 'فشل في حذف الحجز');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.bookingForm.reset({
      clientName: '',
      clientPhone: '',
      clinicId: '',
      date: '',
      time: ''
    });
    this.bookingForm.markAsPristine();
    this.bookingForm.markAsUntouched();
    this.cdr.detectChanges();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  translateError(message: string): string {
    const errorTranslations: { [key: string]: string } = {
      'جميع الحقول مطلوبة': 'يرجى ملء جميع الحقول المطلوبة',
      'العيادة غير موجودة': 'العيادة غير موجودة',
      'تنسيق الوقت غير صالح': 'تنسيق الوقت غير صالح',
      'الحجز غير موجود': 'الحجز غير موجود',
      'غير مصرح': 'غير مصرح',
      'خطأ في الخادم': 'خطأ في الخادم'
    };
    return errorTranslations[message] || message;
  }

  showError(message: string): void {
    this.errorMessage = message;
    console.error('Error:', message);
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 5000);
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    console.log('Success:', message);
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 5000);
  }
}
