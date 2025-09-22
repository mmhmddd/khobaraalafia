import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClinicService, Clinic } from '../../core/services/clinic.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-clinics-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './clinics-options.component.html',
  styleUrls: ['./clinics-options.component.scss']
})
export class ClinicsOptionsComponent implements OnInit {
  clinics: Clinic[] = [];
  clinicForm: FormGroup;
  isEditing = false;
  showModal = false;
  showDeleteModal = false;
  clinicToDelete: string | null = null;
  errorMessage = '';
  successMessage = '';
  loading = false;
  days: string[] = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  specialtiesList: string[] = [
    'قسم النساء والولادة',
    'قسم الباطنية',
    'قسم المسالك البولية والتناسلية',
    'قسم جراحة العظام',
    'قسم الأطفال وحديثي الولادة',
    'قسم الفم والأسنان',
    'قسم الليزر والجلدية والتجميل',
    'التقارير'
  ];

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private authService: AuthService,
    private router: Router
  ) {
    this.clinicForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      specializationType: ['general', Validators.required],
      specialties: [[], this.specialtiesValidator.bind(this)],
      status: ['active', Validators.required],
      availableDays: [[], Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    this.clinicForm.get('specializationType')?.valueChanges.subscribe(value => {
      const specialtiesControl = this.clinicForm.get('specialties');
      if (value === 'general') {
        specialtiesControl?.disable();
        specialtiesControl?.setValue([]);
      } else {
        specialtiesControl?.enable();
      }
    });
  }

  specialtiesValidator(control: AbstractControl): ValidationErrors | null {
    const specializationType = this.clinicForm?.get('specializationType')?.value;
    const specialties = control.value as string[];
    if (specializationType === 'specialized' && (!specialties || specialties.length === 0)) {
      return { required: true };
    }
    return null;
  }

  ngOnInit() {
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول أولاً';
      this.router.navigate(['/login']);
      return;
    }
    this.loadClinics();
  }

  loadClinics() {
    this.loading = true;
    this.clinicService.getAllClinics().subscribe({
      next: (clinics) => {
        this.clinics = clinics;
        this.successMessage = 'تم تحميل العيادات بنجاح';
        this.errorMessage = '';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = `خطأ في تحميل العيادات: ${err.error?.message || err.message}`;
        this.loading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleDay(event: Event, day: string): void {
    const availableDays = this.clinicForm.get('availableDays')?.value as string[];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!availableDays.includes(day)) {
        availableDays.push(day);
      }
    } else {
      const index = availableDays.indexOf(day);
      if (index > -1) {
        availableDays.splice(index, 1);
      }
    }
    this.clinicForm.get('availableDays')?.setValue(availableDays);
    this.clinicForm.get('availableDays')?.markAsTouched();
    this.clinicForm.updateValueAndValidity();
  }

  toggleSpecialty(event: Event, specialty: string): void {
    const specialties = this.clinicForm.get('specialties')?.value as string[];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!specialties.includes(specialty)) {
        specialties.push(specialty);
      }
    } else {
      const index = specialties.indexOf(specialty);
      if (index > -1) {
        specialties.splice(index, 1);
      }
    }
    this.clinicForm.get('specialties')?.setValue(specialties);
    this.clinicForm.get('specialties')?.markAsTouched();
    this.clinicForm.updateValueAndValidity();
  }

  createClinic(): void {
    if (this.clinicForm.valid) {
      const clinicData = {
        ...this.clinicForm.value,
        specialties: this.clinicForm.get('specializationType')?.value === 'specialized' ? this.clinicForm.get('specialties')?.value : []
      };
      this.clinicService.createClinic(clinicData).subscribe({
        next: (clinic) => {
          this.clinics.push(clinic);
          this.closeModal();
          this.successMessage = 'تم إضافة العيادة بنجاح';
          this.errorMessage = '';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = `خطأ في إضافة العيادة: ${err.error?.message || err.message}`;
          setTimeout(() => this.errorMessage = '', 5000);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  updateClinic(): void {
    if (this.clinicForm.valid && this.clinicForm.get('_id')?.value) {
      const clinicData = {
        ...this.clinicForm.value,
        specialties: this.clinicForm.get('specializationType')?.value === 'specialized' ? this.clinicForm.get('specialties')?.value : []
      };
      this.clinicService.updateClinic(this.clinicForm.get('_id')?.value, clinicData).subscribe({
        next: (updatedClinic) => {
          const index = this.clinics.findIndex(c => c._id === updatedClinic._id);
          if (index !== -1) {
            this.clinics[index] = updatedClinic;
          }
          this.closeModal();
          this.successMessage = 'تم تحديث العيادة بنجاح';
          this.errorMessage = '';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = `خطأ في تحديث العيادة: ${err.error?.message || err.message}`;
          setTimeout(() => this.errorMessage = '', 5000);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  openDeleteModal(id: string): void {
    this.clinicToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.clinicToDelete) {
      this.clinicService.deleteClinic(this.clinicToDelete).subscribe({
        next: () => {
          this.clinics = this.clinics.filter(c => c._id !== this.clinicToDelete);
          this.successMessage = 'تم حذف العيادة بنجاح';
          this.errorMessage = '';
          this.closeDeleteModal();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = `خطأ في حذف العيادة: ${err.error?.message || err.message}`;
          setTimeout(() => this.errorMessage = '', 5000);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.clinicToDelete = null;
  }

  selectClinic(clinic: Clinic): void {
    this.isEditing = true;
    this.showModal = true;
    this.clinicForm.patchValue({
      ...clinic,
      specialties: clinic.specialties || [],
      availableDays: clinic.availableDays || []
    });
    const specialtiesControl = this.clinicForm.get('specialties');
    if (clinic.specializationType === 'general') {
      specialtiesControl?.disable();
    } else {
      specialtiesControl?.enable();
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  openAddClinicModal(): void {
    this.isEditing = false;
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.clinicForm.reset({
      _id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      specializationType: 'general',
      specialties: [],
      status: 'active',
      availableDays: [],
      price: 0
    });
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
