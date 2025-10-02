import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { BookingService } from '../../core/services/booking.service';
import { ClinicService } from '../../core/services/clinic.service';
import { DoctorsService } from '../../core/services/doctors.service';
import { UsersService } from '../../core/services/users.service';

Chart.register(...registerables);

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  count?: number;
  colorClass?: string;
}

interface TopClinic {
  name: string;
  bookingsLast30Days: number;
}

interface TopClinicIncome {
  name: string;
  incomeLast30Days: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('topClinicsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topClinicsIncomeChart') incomeChartCanvas!: ElementRef<HTMLCanvasElement>;
  searchTerm: string = '';
  topCards: DashboardCard[] = [
    {
      title: 'الأطباء',
      description: 'إدارة الأطباء والمعلومات المتعلقة بهم',
      icon: 'fa-user-md',
      route: '/dashboard/doctors-option',
      colorClass: 'card-doctors'
    },
    {
      title: 'الحجوزات',
      description: 'عرض وإدارة الحجوزات',
      icon: 'fa-calendar-check',
      route: '/dashboard/booking-option',
      colorClass: 'card-bookings'
    },
    {
      title: 'العيادات',
      description: 'إدارة العيادات والمرافق',
      icon: 'fa-hospital',
      route: '/dashboard/clinics-option',
      colorClass: 'card-clinics'
    },
    {
      title: 'المستخدمين',
      description: 'إدارة المستخدمين والحسابات',
      icon: 'fa-users',
      route: '/dashboard/all-users',
      colorClass: 'card-users'
    }
  ];
  additionalCards: DashboardCard[] = [
    {
      title: 'جميع المستخدمين',
      description: 'عرض قائمة جميع المستخدمين',
      icon: 'fa-user-friends',
      route: '/dashboard/all-users'
    },
    {
      title: 'إضافة آراء',
      description: 'إضافة آراء وشهادات جديدة',
      icon: 'fa-comment-dots',
      route: '/dashboard/add-testimonials'
    },
    {
      title: 'خيارات العيادات',
      description: 'إدارة خيارات العيادات',
      icon: 'fa-clinic-medical',
      route: '/dashboard/clinics-option'
    },
    {
      title: 'خيارات الأطباء',
      description: 'إدارة خيارات الأطباء',
      icon: 'fa-stethoscope',
      route: '/dashboard/doctors-option'
    },
    {
      title: 'خيارات الحجز',
      description: 'إدارة خيارات الحجز',
      icon: 'fa-calendar-alt',
      route: '/dashboard/booking-option'
    }
  ];
  filteredTopCards: DashboardCard[] = [];
  filteredAdditionalCards: DashboardCard[] = [];
  topClinics: TopClinic[] = [];
  topClinicsIncome: TopClinicIncome[] = [];
  loadingStats = false;
  chartConfig: any = null;
  incomeChartConfig: any = null;
  private chartInstance: Chart | null = null;
  private incomeChartInstance: Chart | null = null;

  constructor(
    private router: Router,
    private doctorsService: DoctorsService,
    private clinicService: ClinicService,
    private bookingService: BookingService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filteredTopCards = [...this.topCards];
    this.filteredAdditionalCards = [...this.additionalCards];
    this.fetchCounts();
    this.loadTopClinics();
    this.loadTopClinicsIncome();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.renderChart();
    this.renderIncomeChart();
  }

  fetchCounts(): void {
    forkJoin({
      doctors: this.doctorsService.getAllDoctors().pipe(
        map(doctors => doctors.length),
        catchError(err => {
          console.error('Error fetching doctors count:', err);
          return of(0);
        })
      ),
      clinics: this.clinicService.getAllClinics().pipe(
        map(clinics => clinics.length),
        catchError(err => {
          console.error('Error fetching clinics count:', err);
          return of(0);
        })
      ),
      bookings: this.bookingService.getAllBookings().pipe(
        map(bookings => bookings.length),
        catchError(err => {
          console.error('Error fetching bookings count:', err);
          return of(0);
        })
      ),
      users: this.usersService.getAllUsers().pipe(
        map(users => users.length),
        catchError(err => {
          console.error('Error fetching users count:', err);
          return of(0);
        })
      )
    }).subscribe({
      next: ({ doctors, clinics, bookings, users }) => {
        this.topCards[0].count = doctors;
        this.topCards[1].count = bookings;
        this.topCards[2].count = clinics;
        this.topCards[3].count = users;
        this.filteredTopCards = [...this.topCards];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching counts:', err);
      }
    });
  }

  loadTopClinics(): void {
    this.loadingStats = true;
    this.clinicService.getAllClinics().pipe(
      switchMap(clinics => {
        if (!clinics || clinics.length === 0) {
          console.warn('No clinics found');
          this.loadingStats = false;
          this.cdr.detectChanges();
          return of([]);
        }
        const validClinics = clinics.filter(clinic => clinic._id && clinic.name);
        if (validClinics.length === 0) {
          console.warn('No valid clinics with _id and name');
          this.loadingStats = false;
          this.cdr.detectChanges();
          return of([]);
        }
        return this.bookingService.getAllBookings().pipe(
          map(bookings => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const clinicBookings = validClinics.map(clinic => {
              const clinicBookingsCount = bookings.filter(booking => {
                const clinicId = booking.clinic && typeof booking.clinic === 'object' && booking.clinic._id
                  ? booking.clinic._id
                  : typeof booking.clinic === 'string'
                    ? booking.clinic
                    : null;
                if (!clinicId) return false;
                const bookingDate = booking.createdAt
                  ? new Date(booking.createdAt)
                  : booking.date
                    ? new Date(booking.date)
                    : null;
                return (
                  clinicId === clinic._id &&
                  bookingDate &&
                  !isNaN(bookingDate.getTime()) &&
                  bookingDate >= thirtyDaysAgo
                );
              }).length;
              return {
                name: clinic.name,
                bookingsLast30Days: clinicBookingsCount
              };
            });

            const topClinics = clinicBookings
              .filter(clinic => clinic.bookingsLast30Days > 0)
              .sort((a, b) => b.bookingsLast30Days - a.bookingsLast30Days)
              .slice(0, 5);

            this.chartConfig = this.generateChartConfig(topClinics);
            return topClinics;
          }),
          catchError(err => {
            console.error('Error processing bookings:', err);
            this.loadingStats = false;
            this.cdr.detectChanges();
            return of([]);
          })
        );
      }),
      catchError(err => {
        console.error('Error loading top clinics:', err);
        this.topClinics = [];
        this.chartConfig = this.generateChartConfig([]);
        this.loadingStats = false;
        this.cdr.detectChanges();
        return of([]);
      })
    ).subscribe({
      next: (topClinics) => {
        this.topClinics = topClinics;
        this.loadingStats = false;
        console.log('Top Clinics loaded:', topClinics);
        this.cdr.detectChanges();
        this.renderChart();
      },
      error: (err) => {
        console.error('Subscription error:', err);
        this.loadingStats = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadTopClinicsIncome(): void {
    this.loadingStats = true;
    this.clinicService.getAllClinics().pipe(
      switchMap(clinics => {
        if (!clinics || clinics.length === 0) {
          console.warn('No clinics found for income calculation');
          this.loadingStats = false;
          this.cdr.detectChanges();
          return of([]);
        }
        const validClinics = clinics.filter(clinic => clinic._id && clinic.name && clinic.price !== undefined);
        if (validClinics.length === 0) {
          console.warn('No valid clinics with _id, name, and price for income calculation');
          this.loadingStats = false;
          this.cdr.detectChanges();
          return of([]);
        }
        return this.bookingService.getAllBookings().pipe(
          map(bookings => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const clinicIncomes = validClinics.map(clinic => {
              const clinicBookings = bookings.filter(booking => {
                const clinicId = booking.clinic && typeof booking.clinic === 'object' && booking.clinic._id
                  ? booking.clinic._id
                  : typeof booking.clinic === 'string'
                    ? booking.clinic
                    : null;
                if (!clinicId) return false;
                const bookingDate = booking.createdAt
                  ? new Date(booking.createdAt)
                  : booking.date
                    ? new Date(booking.date)
                    : null;
                return (
                  clinicId === clinic._id &&
                  bookingDate &&
                  !isNaN(bookingDate.getTime()) &&
                  bookingDate >= thirtyDaysAgo
                );
              });
              const income = clinicBookings.length * (clinic.price || 0);
              return {
                name: clinic.name,
                incomeLast30Days: income
              };
            });

            const topClinicsIncome = clinicIncomes
              .filter(clinic => clinic.incomeLast30Days > 0)
              .sort((a, b) => b.incomeLast30Days - a.incomeLast30Days)
              .slice(0, 5);

            this.incomeChartConfig = this.generateIncomeChartConfig(topClinicsIncome);
            return topClinicsIncome;
          }),
          catchError(err => {
            console.error('Error processing income:', err);
            this.loadingStats = false;
            this.cdr.detectChanges();
            return of([]);
          })
        );
      }),
      catchError(err => {
        console.error('Error loading top clinics income:', err);
        this.topClinicsIncome = [];
        this.incomeChartConfig = this.generateIncomeChartConfig([]);
        this.loadingStats = false;
        this.cdr.detectChanges();
        return of([]);
      })
    ).subscribe({
      next: (topClinicsIncome) => {
        this.topClinicsIncome = topClinicsIncome;
        this.loadingStats = false;
        console.log('Top Clinics Income loaded:', topClinicsIncome);
        this.cdr.detectChanges();
        this.renderIncomeChart();
      },
      error: (err) => {
        console.error('Subscription error for income:', err);
        this.loadingStats = false;
        this.cdr.detectChanges();
      }
    });
  }

  private generateChartConfig(topClinics: TopClinic[]): any {
    const labels = topClinics.length > 0 ? topClinics.map(clinic => clinic.name) : ['لا توجد بيانات'];
    const data = topClinics.length > 0 ? topClinics.map(clinic => clinic.bookingsLast30Days) : [0];

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'عدد الحجوزات',
          data,
          backgroundColor: topClinics.length > 0 ? [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ] : ['rgba(200, 200, 200, 0.7)'],
          borderColor: topClinics.length > 0 ? [
            '#1E40AF',
            '#047857',
            '#6D28D9',
            '#B45309',
            '#B91C1C'
          ] : ['#666666'],
          borderWidth: 1,
          borderRadius: 8,
          barThickness: 'flex',
          maxBarThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                family: "'Tajawal', 'Cairo', sans-serif",
                size: 14,
                weight: '600'
              },
              color: '#111827',
              padding: 20
            }
          },
          tooltip: {
            enabled: topClinics.length > 0,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            bodyFont: {
              family: "'Tajawal', 'Cairo', sans-serif",
              size: 14
            },
            titleFont: {
              family: "'Tajawal', 'Cairo', sans-serif",
              size: 16,
              weight: '600'
            },
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'عدد الحجوزات',
              font: {
                family: "'Tajawal', 'Cairo', sans-serif",
                size: 16,
                weight: '600'
              },
              color: '#111827',
              padding: 10
            },
            ticks: {
              font: {
                family: "'Tajawal', 'Cairo', sans-serif",
                size: 12
              },
              color: '#111827',
              stepSize: 1
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'اسم العيادة',
              font: {
                family: "'Tajawal', 'Cairo', sans-serif",
                size: 16,
                weight: '600'
              },
              color: '#111827',
              padding: 10
            },
            ticks: {
              font: {
                family: "'Tajawal', 'Cairo', sans-serif",
                size: 12
              },
              color: '#111827',
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: false
            }
          }
        }
      }
    };
  }

  private generateIncomeChartConfig(topClinicsIncome: TopClinicIncome[]): any {
    const labels = topClinicsIncome.length > 0 ? topClinicsIncome.map(clinic => clinic.name) : ['لا توجد بيانات'];
    const data = topClinicsIncome.length > 0 ? topClinicsIncome.map(clinic => clinic.incomeLast30Days) : [0];

    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'الإيرادات',
          data,
          backgroundColor: topClinicsIncome.length > 0 ? [
            'rgba(94, 129, 172, 0.7)', // Soft blue-gray
            'rgba(116, 151, 194, 0.7)',
            'rgba(136, 171, 214, 0.7)',
            'rgba(156, 190, 232, 0.7)',
            'rgba(176, 210, 250, 0.7)'
          ] : ['rgba(200, 200, 200, 0.7)'],
          borderColor: topClinicsIncome.length > 0 ? [
            '#3B5A8A',
            '#4D6FA2',
            '#5E83BA',
            '#7097D2',
            '#82ABEA'
          ] : ['#666666'],
          borderWidth: 1,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: 'easeOutSine'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                family: "'Tajawal', 'Cairo', sans-serif",
                size: 12,
                weight: '500'
              },
              color: '#1F2937',
              padding: 10,
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            enabled: topClinicsIncome.length > 0,
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            bodyFont: {
              family: "'Tajawal', 'Cairo', sans-serif",
              size: 12
            },
            titleFont: {
              family: "'Tajawal', 'Cairo', sans-serif",
              size: 14,
              weight: '500'
            },
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              label: (context: any) => {
                const value = context.parsed || 0;
                return `الإيرادات: ${value.toLocaleString('ar-EG')}`;
              }
            }
          }
        },
        cutout: '50%'
      }
    };
  }

  private renderChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      console.log('Previous bookings chart instance destroyed');
    }

    if (!this.chartCanvas || !this.chartCanvas.nativeElement) {
      console.error('Bookings chart canvas element not found');
      return;
    }

    if (!this.chartConfig) {
      console.warn('Bookings chart configuration is not available, generating fallback');
      this.chartConfig = this.generateChartConfig([]);
    }

    try {
      this.chartInstance = new Chart(this.chartCanvas.nativeElement, this.chartConfig);
      console.log('Bookings chart rendered successfully');
    } catch (error) {
      console.error('Error rendering bookings chart:', error);
    }
  }

  private renderIncomeChart(): void {
    if (this.incomeChartInstance) {
      this.incomeChartInstance.destroy();
      console.log('Previous income chart instance destroyed');
    }

    if (!this.incomeChartCanvas || !this.incomeChartCanvas.nativeElement) {
      console.error('Income chart canvas element not found');
      return;
    }

    if (!this.incomeChartConfig) {
      console.warn('Income chart configuration is not available, generating fallback');
      this.incomeChartConfig = this.generateIncomeChartConfig([]);
    }

    try {
      this.incomeChartInstance = new Chart(this.incomeChartCanvas.nativeElement, this.incomeChartConfig);
      console.log('Income chart rendered successfully');
    } catch (error) {
      console.error('Error rendering income chart:', error);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredTopCards = [...this.topCards];
      this.filteredAdditionalCards = [...this.additionalCards];
    } else {
      this.filteredTopCards = this.topCards.filter(
        card =>
          card.title.toLowerCase().includes(term) ||
          card.description.toLowerCase().includes(term)
      );
      this.filteredAdditionalCards = this.additionalCards.filter(
        card =>
          card.title.toLowerCase().includes(term) ||
          card.description.toLowerCase().includes(term)
      );
    }
    this.cdr.detectChanges();
  }
}
