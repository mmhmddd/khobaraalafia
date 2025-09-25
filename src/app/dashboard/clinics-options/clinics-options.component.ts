// src/app/clinics-options/clinics-options.component.ts
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClinicService, Clinic } from '../../core/services/clinic.service';
import { DoctorsService, Doctor } from '../../core/services/doctors.service';
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
  doctors: Doctor[] = [];
  clinicForm: FormGroup;
  addDoctorsForm: FormGroup;
  isEditing = false;
  showModal = false;
  showViewModal = false;
  showDeleteModal = false;
  showAddDoctorsModal = false;
  clinicToDelete: string | null = null;
  selectedClinic: Clinic | null = null;
  selectedClinicId: string | null = null;
  selectedDoctorIds: string[] = [];
  errorMessage = '';
  successMessage = '';
  loading = false;
  isSubmitting = false;
  videoFiles: File[] = [];
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
    private doctorsService: DoctorsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.clinicForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      address: [''],
      specializationType: ['general', Validators.required],
      specialties: [[], this.specialtiesValidator.bind(this)],
      status: ['active', Validators.required],
      availableDays: [[], Validators.required],
      price: [0],
      about: ['', [Validators.required, Validators.minLength(10)]],
      specialWords: [[]],
      videos: [[]],
      doctorIds: [[]]
    });

    this.addDoctorsForm = this.fb.group({
      doctorIds: [[], Validators.required]
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
    this.loadDoctors();
  }

  loadClinics() {
    this.loading = true;
    this.clinicService.getAllClinics().subscribe({
      next: (clinics) => {
        console.log('Available clinics:', clinics.map(c => c._id));
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

  loadDoctors() {
    this.doctorsService.getAllDoctors().subscribe({
      next: (doctors) => {
        console.log('Available doctors:', doctors.map(d => d._id));
        this.doctors = doctors;
      },
      error: (err) => {
        this.errorMessage = `خطأ في تحميل قائمة الأطباء: ${err.error?.message || err.message}`;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  trackById(index: number, clinic: Clinic): string {
    return clinic._id || index.toString();
  }

  translateDay(day: string): string {
    return day === 'All' ? 'كل الأيام' :
           day === 'Monday' ? 'الإثنين' :
           day === 'Tuesday' ? 'الثلاثاء' :
           day === 'Wednesday' ? 'الأربعاء' :
           day === 'Thursday' ? 'الخميس' :
           day === 'Friday' ? 'الجمعة' :
           day === 'Saturday' ? 'السبت' :
           day === 'Sunday' ? 'الأحد' : day;
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

  toggleDoctor(event: Event, doctorId: string): void {
    const doctorIds = this.clinicForm.get('doctorIds')?.value as string[];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!doctorIds.includes(doctorId)) {
        doctorIds.push(doctorId);
      }
    } else {
      const index = doctorIds.indexOf(doctorId);
      if (index > -1) {
        doctorIds.splice(index, 1);
      }
    }
    this.clinicForm.get('doctorIds')?.setValue(doctorIds);
    this.clinicForm.get('doctorIds')?.markAsTouched();
    this.clinicForm.updateValueAndValidity();
  }

  toggleDoctorInAddModal(event: Event, doctorId: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.selectedDoctorIds.includes(doctorId)) {
        this.selectedDoctorIds.push(doctorId);
      }
    } else {
      const index = this.selectedDoctorIds.indexOf(doctorId);
      if (index > -1) {
        this.selectedDoctorIds.splice(index, 1);
      }
    }
    this.addDoctorsForm.get('doctorIds')?.setValue(this.selectedDoctorIds);
    this.addDoctorsForm.get('doctorIds')?.markAsTouched();
    this.addDoctorsForm.updateValueAndValidity();
  }

  onSpecialWordsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const specialWords = input.value.split(',').map(word => word.trim()).filter(word => word);
    this.clinicForm.get('specialWords')?.setValue(specialWords);
    this.clinicForm.get('specialWords')?.markAsTouched();
  }

  onVideoFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.videoFiles = Array.from(input.files);
    } else {
      this.videoFiles = [];
    }
  }

  downloadVideo(videoUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadAllVideos(videos: string[], clinicName: string): void {
    videos.forEach((videoUrl, index) => {
      const fileName = `${clinicName}_video_${index + 1}.${videoUrl.split('.').pop()}`;
      setTimeout(() => {
        this.downloadVideo(videoUrl, fileName);
      }, index * 500);
    });
  }

  createClinic(): void {
    if (this.clinicForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const clinicData = {
        ...this.clinicForm.value,
        specialties: this.clinicForm.get('specializationType')?.value === 'specialized' ? this.clinicForm.get('specialties')?.value : [],
        doctorIds: this.clinicForm.get('doctorIds')?.value || []
      };
      this.clinicService.createClinic(clinicData, this.videoFiles).subscribe({
        next: (clinic) => {
          this.clinics.push(clinic);
          this.closeModal();
          this.successMessage = 'تم إضافة العيادة بنجاح';
          this.errorMessage = '';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
          const doctorIds = this.clinicForm.get('doctorIds')?.value as string[];
          if (doctorIds.length > 0) {
            this.clinicService.addDoctorsToClinic(clinic._id!, doctorIds).subscribe({
              next: (updatedClinic) => {
                const index = this.clinics.findIndex(c => c._id === updatedClinic._id);
                if (index !== -1) {
                  this.clinics[index] = updatedClinic;
                }
              },
              error: (err) => {
                this.errorMessage = `خطأ في إضافة الأطباء إلى العيادة: ${err.error?.message || err.message}`;
                setTimeout(() => this.errorMessage = '', 5000);
              }
            });
          }
        },
        error: (err) => {
          this.errorMessage = `خطأ في إضافة العيادة: ${err.error?.message || err.message}`;
          this.isSubmitting = false;
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
    if (this.clinicForm.valid && this.clinicForm.get('_id')?.value && !this.isSubmitting) {
      this.isSubmitting = true;
      const clinicData = {
        ...this.clinicForm.value,
        specialties: this.clinicForm.get('specializationType')?.value === 'specialized' ? this.clinicForm.get('specialties')?.value : [],
        doctorIds: this.clinicForm.get('doctorIds')?.value || []
      };
      this.clinicService.updateClinic(this.clinicForm.get('_id')?.value, clinicData, this.videoFiles).subscribe({
        next: (updatedClinic) => {
          const index = this.clinics.findIndex(c => c._id === updatedClinic._id);
          if (index !== -1) {
            this.clinics[index] = updatedClinic;
          }
          this.closeModal();
          this.successMessage = 'تم تحديث العيادة بنجاح';
          this.errorMessage = '';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
          const doctorIds = this.clinicForm.get('doctorIds')?.value as string[];
          if (doctorIds.length > 0) {
            this.clinicService.addDoctorsToClinic(updatedClinic._id!, doctorIds).subscribe({
              next: (finalClinic) => {
                const finalIndex = this.clinics.findIndex(c => c._id === finalClinic._id);
                if (finalIndex !== -1) {
                  this.clinics[finalIndex] = finalClinic;
                }
                if (this.selectedClinic?._id === finalClinic._id) {
                  this.selectedClinic = finalClinic;
                }
              },
              error: (err) => {
                this.errorMessage = `خطأ في إضافة الأطباء إلى العيادة: ${err.error?.message || err.message}`;
                setTimeout(() => this.errorMessage = '', 5000);
              }
            });
          }
        },
        error: (err) => {
          this.errorMessage = `خطأ في تحديث العيادة: ${err.error?.message || err.message}`;
          this.isSubmitting = false;
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

  addDoctors(): void {
    if (this.addDoctorsForm.valid && this.selectedClinicId && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('Request payload:', {
        clinicId: this.selectedClinicId,
        doctorIds: this.selectedDoctorIds
      });
      this.clinicService.addDoctorsToClinic(this.selectedClinicId, this.selectedDoctorIds).subscribe({
        next: (updatedClinic) => {
          const index = this.clinics.findIndex(c => c._id === updatedClinic._id);
          if (index !== -1) {
            this.clinics[index] = updatedClinic;
          }
          if (this.selectedClinic?._id === updatedClinic._id) {
            this.selectedClinic = updatedClinic;
          }
          this.closeAddDoctorsModal();
          this.successMessage = 'تم إضافة الأطباء بنجاح';
          this.errorMessage = '';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = `خطأ في إضافة الأطباء: ${err.error?.message || err.message}`;
          console.error('Error details:', err);
          this.isSubmitting = false;
          setTimeout(() => this.errorMessage = '', 5000);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.errorMessage = 'يرجى اختيار طبيب واحد على الأقل';
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  viewClinic(id: string): void {
    this.loading = true;
    this.clinicService.getClinicById(id).subscribe({
      next: (clinic) => {
        this.selectedClinic = clinic;
        this.showViewModal = true;
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = `خطأ في تحميل تفاصيل العيادة: ${err.error?.message || err.message}`;
        this.loading = false;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  openAddDoctorsModal(clinicId: string): void {
    this.selectedClinicId = clinicId;
    const clinic = this.clinics.find(c => c._id === clinicId);
    this.selectedDoctorIds = clinic?.doctors?.map(doctor => doctor._id) || [];
    this.addDoctorsForm.patchValue({ doctorIds: this.selectedDoctorIds });
    this.showAddDoctorsModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeAddDoctorsModal(): void {
    this.showAddDoctorsModal = false;
    this.selectedClinicId = null;
    this.selectedDoctorIds = [];
    this.addDoctorsForm.reset({ doctorIds: [] });
    this.isSubmitting = false;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedClinic = null;
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
    this.videoFiles = [];
    this.clinicForm.patchValue({
      ...clinic,
      specialties: clinic.specialties || [],
      availableDays: clinic.availableDays || [],
      about: clinic.about || '',
      specialWords: clinic.specialWords || [],
      videos: clinic.videos || [],
      doctorIds: clinic.doctors?.map(doctor => doctor._id) || []
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
      price: 0,
      about: '',
      specialWords: [],
      videos: [],
      doctorIds: []
    });
    this.videoFiles = [];
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }
}
