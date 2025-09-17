import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestimonialService } from '../../core/services/testimonial.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

interface Testimonial {
  _id: string;
  name: string;
  jobTitle: string;
  text: string;
  rating: number;
  createdAt?: string;
}

@Component({
  selector: 'app-add-testimonials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-testimonials.component.html',
  styleUrls: ['./add-testimonials.component.scss']
})
export class AddTestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  filteredTestimonials: Testimonial[] = [];
  filterForm: FormGroup;
  editForm: FormGroup;
  isEditModalOpen = false;
  isLoading = false;
  errorMessage = '';
  selectedTestimonial: Testimonial | null = null;

  ratingOptions = [
    { value: '', label: 'جميع التقييمات' },
    { value: '1', label: '1 نجمة' },
    { value: '2', label: '2 نجوم' },
    { value: '3', label: '3 نجوم' },
    { value: '4', label: '4 نجوم' },
    { value: '5', label: '5 نجوم' }
  ];

  constructor(
    private fb: FormBuilder,
    private testimonialService: TestimonialService,
    private authService: AuthService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      rating: ['']
    });

    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول كمدير';
      this.router.navigate(['/login']);
      return;
    }
    this.loadTestimonials();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  loadTestimonials(): void {
    this.isLoading = true;
    this.testimonialService.getAllTestimonials().subscribe({
      next: (response: any) => {
        this.testimonials = response.data;
        this.filteredTestimonials = [...this.testimonials];
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'خطأ في تحميل الآراء';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  applyFilters(): void {
    const { search, rating } = this.filterForm.value;
    this.filteredTestimonials = this.testimonials.filter(testimonial => {
      const matchesSearch = !search ||
        testimonial.name.toLowerCase().includes(search.toLowerCase()) ||
        testimonial.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        testimonial.text.toLowerCase().includes(search.toLowerCase());
      const matchesRating = !rating || testimonial.rating === +rating;
      return matchesSearch && matchesRating;
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filteredTestimonials = [...this.testimonials];
  }

  showTestimonial(id: string): void {
    this.testimonialService.getTestimonialById(id).subscribe({
      next: (response: any) => {
        this.selectedTestimonial = response.data;
        this.openEditModal(response.data, false);
      },
      error: (error) => {
        this.handleError(error, 'عرض الرأي');
      }
    });
  }

  openEditModal(testimonial: Testimonial | null, isEdit: boolean = true): void {
    this.isEditModalOpen = true;
    this.selectedTestimonial = testimonial;
    if (isEdit && testimonial) {
      this.editForm.patchValue(testimonial);
    } else {
      this.editForm.reset();
    }
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedTestimonial = null;
    this.editForm.reset();
  }

  submitEditForm(): void {
    if (this.editForm.invalid) return;

    this.isLoading = true;
    const testimonialData = this.editForm.value;

    if (this.selectedTestimonial?._id && this.selectedTestimonial) {
      // Update existing testimonial
      this.testimonialService.updateTestimonial(this.selectedTestimonial._id, testimonialData).subscribe({
        next: (response: any) => {
          const index = this.testimonials.findIndex(t => t._id === response.data._id);
          if (index !== -1) {
            this.testimonials[index] = response.data;
            this.applyFilters();
          }
          this.closeEditModal();
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: (error) => {
          this.handleError(error, 'تحديث الرأي');
        }
      });
    } else {
      // Create new testimonial
      this.testimonialService.createTestimonial(testimonialData).subscribe({
        next: (response: any) => {
          this.testimonials.push(response.data);
          this.applyFilters();
          this.closeEditModal();
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: (error) => {
          this.handleError(error, 'إضافة الرأي');
        }
      });
    }
  }

  deleteTestimonial(id: string): void {
    if (confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
      this.isLoading = true;
      this.testimonialService.deleteTestimonial(id).subscribe({
        next: () => {
          this.testimonials = this.testimonials.filter(t => t._id !== id);
          this.applyFilters();
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: (error) => {
          this.handleError(error, 'حذف الرأي');
        }
      });
    }
  }

  private handleError(error: any, action: string): void {
    this.isLoading = false;
    if (error.status === 401) {
      this.errorMessage = 'غير مصرح، يرجى تسجيل الدخول كمدير';
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      this.errorMessage = 'غير مصرح، يتطلب صلاحيات مدير';
    } else {
      this.errorMessage = `خطأ في ${action}`;
    }
    console.error(error);
  }
}
