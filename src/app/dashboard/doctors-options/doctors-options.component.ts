import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClinicService, Clinic } from '../../core/services/clinic.service';
import { DoctorsService, Doctor, DoctorSchedule } from '../../core/services/doctors.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-doctors-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './doctors-options.component.html',
  styleUrls: ['./doctors-options.component.scss']
})
export class DoctorsOptionsComponent implements OnInit {
  doctors: Doctor[] = [];
  clinics: Clinic[] = [];
  doctorForm: FormGroup;
  isEditing = false;
  showModal = false;
  showDeleteModal = false;
  doctorToDelete: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  days: string[] = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  specializationOptions: string[] = ['طب عام', 'طب تخصصي'];
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
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  defaultImage = 'assets/images/default-doctor.png';

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private doctorsService: DoctorsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.doctorForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      specialization: ['', Validators.required],
      specialties: [[], this.specialtiesValidator.bind(this)],
      clinics: [[], [Validators.required, Validators.minLength(1)]],
      schedules: [[], this.schedulesValidator.bind(this)],
      status: ['متاح', Validators.required],
      image: [null]
    });

    this.doctorForm.get('specialization')?.valueChanges.subscribe(value => {
      this.updateDoctorValidators(value);
    });
  }

  specialtiesValidator(control: AbstractControl): ValidationErrors | null {
    const specialization = this.doctorForm?.get('specialization')?.value;
    const specialties = control.value as string[];
    if (specialization === 'طب تخصصي' && (!specialties || specialties.length === 0)) {
      return { required: true };
    }
    return null;
  }

  schedulesValidator(control: AbstractControl): ValidationErrors | null {
    const specialization = this.doctorForm?.get('specialization')?.value;
    const schedules = control.value as string[];
    if (specialization === 'طب عام' && (!schedules || schedules.length === 0)) {
      return { required: true };
    }
    return null;
  }

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول أولاً';
      this.router.navigate(['/login']);
      return;
    }
    this.loadClinics();
    this.loadDoctors();
  }

  loadClinics(): void {
    this.loading = true;
    this.clinicService.getAllClinics().subscribe({
      next: (data) => {
        this.clinics = data;
        this.successMessage = 'تم تحميل العيادات بنجاح';
        this.errorMessage = null;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = this.translateError(err.error?.message || 'فشل في تحميل العيادات');
        this.loading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorsService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data.map(doctor => ({
          ...doctor,
          image: doctor.image || null,
          clinics: Array.isArray(doctor.clinics) ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : clinic._id) : [],
          schedules: Array.isArray(doctor.schedules) ? doctor.schedules : [],
          specialties: Array.isArray(doctor.specialties) ? doctor.specialties : []
        }));
        this.successMessage = 'تم تحميل الأطباء بنجاح';
        this.errorMessage = null;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = this.translateError(err.error?.message || 'فشل في تحميل الأطباء');
        this.loading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateDoctorValidators(specialization: string): void {
    const specialtiesControl = this.doctorForm.get('specialties');
    const schedulesControl = this.doctorForm.get('schedules');

    if (specialization === 'طب عام') {
      schedulesControl?.setValidators([Validators.required, Validators.minLength(1)]);
      specialtiesControl?.clearValidators();
      specialtiesControl?.setValue([]);
      specialtiesControl?.disable();
    } else {
      schedulesControl?.clearValidators();
      schedulesControl?.setValue([]);
      schedulesControl?.disable();
      specialtiesControl?.setValidators([Validators.minLength(1)]);
      specialtiesControl?.enable();
    }

    specialtiesControl?.updateValueAndValidity();
    schedulesControl?.updateValueAndValidity();
    this.doctorForm.updateValueAndValidity();
  }

  formatSchedules(schedules: DoctorSchedule[] | undefined): string {
    if (!schedules || !schedules.length) {
      return 'غير متوفر';
    }
    return schedules
      .map(s => s.days.map(day => this.translateDay(day)).join(', '))
      .join('; ');
  }

  translateDay(day: string): string {
    const dayTranslations: { [key: string]: string } = {
      All: 'كل الأيام',
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        this.selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
          this.doctorForm.get('image')?.setValue(file);
        };
        reader.readAsDataURL(file);
      } else {
        this.errorMessage = 'يرجى تحميل صورة بحجم أقل من 5 ميغابايت (JPEG, PNG، أو GIF)';
        this.selectedImageFile = null;
        this.imagePreview = null;
        input.value = '';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }

  toggleDoctorClinic(event: Event, clinicId: string): void {
    const clinics = this.doctorForm.get('clinics')?.value as string[];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!clinics.includes(clinicId)) {
        clinics.push(clinicId);
      }
    } else {
      const index = clinics.indexOf(clinicId);
      if (index > -1) {
        clinics.splice(index, 1);
      }
    }
    this.doctorForm.get('clinics')?.setValue(clinics);
    this.doctorForm.get('clinics')?.markAsTouched();
    this.doctorForm.updateValueAndValidity();
  }

  toggleDoctorDay(event: Event, day: string): void {
    const schedules = this.doctorForm.get('schedules')?.value as string[];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!schedules.includes(day)) {
        schedules.push(day);
      }
    } else {
      const index = schedules.indexOf(day);
      if (index > -1) {
        schedules.splice(index, 1);
      }
    }
    this.doctorForm.get('schedules')?.setValue(schedules);
    this.doctorForm.get('schedules')?.markAsTouched();
    this.doctorForm.updateValueAndValidity();
  }

  toggleSpecialty(event: Event, specialty: string): void {
    const specialties = this.doctorForm.get('specialties')?.value as string[];
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
    this.doctorForm.get('specialties')?.setValue(specialties);
    this.doctorForm.get('specialties')?.markAsTouched();
    this.doctorForm.updateValueAndValidity();
  }

  createDoctor(): void {
    if (this.doctorForm.valid) {
      const doctorData: Doctor = {
        ...this.doctorForm.value,
        specialties: this.doctorForm.get('specialization')?.value === 'طب تخصصي' ? this.doctorForm.get('specialties')?.value : [],
        schedules: this.doctorForm.get('specialization')?.value === 'طب عام'
          ? this.doctorForm.get('schedules')?.value.map((day: string) => ({ days: [day], clinic: '', startTime: '', endTime: '' }))
          : []
      };
      this.doctorsService.createDoctor(doctorData, this.selectedImageFile).subscribe({
        next: (createdDoctor) => {
          this.doctors.push(createdDoctor);
          this.closeModal();
          this.successMessage = 'تم إنشاء الطبيب بنجاح';
          this.errorMessage = null;
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.errorMessage = this.translateError(err.error?.message || 'فشل في إنشاء الطبيب');
          setTimeout(() => this.errorMessage = null, 5000);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      setTimeout(() => this.errorMessage = null, 5000);
    }
  }

  updateDoctor(): void {
    if (this.doctorForm.valid && this.doctorForm.get('_id')?.value) {
      const doctorData: Doctor = {
        ...this.doctorForm.value,
        specialties: this.doctorForm.get('specialization')?.value === 'طب تخصصي' ? this.doctorForm.get('specialties')?.value : [],
        schedules: this.doctorForm.get('specialization')?.value === 'طب عام'
          ? this.doctorForm.get('schedules')?.value.map((day: string) => ({ days: [day], clinic: '', startTime: '', endTime: '' }))
          : []
      };
      this.doctorsService.updateDoctor(this.doctorForm.get('_id')?.value, doctorData, this.selectedImageFile).subscribe({
        next: (updatedDoctor) => {
          const index = this.doctors.findIndex(d => d._id === updatedDoctor._id);
          if (index !== -1) {
            this.doctors[index] = updatedDoctor;
          }
          this.closeModal();
          this.successMessage = 'تم تحديث الطبيب بنجاح';
          this.errorMessage = null;
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.errorMessage = this.translateError(err.error?.message || 'فشل في تحديث الطبيب');
          setTimeout(() => this.errorMessage = null, 5000);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      setTimeout(() => this.errorMessage = null, 5000);
    }
  }

  openDeleteModal(id: string): void {
    this.doctorToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.doctorToDelete) {
      this.doctorsService.deleteDoctor(this.doctorToDelete).subscribe({
        next: () => {
          this.doctors = this.doctors.filter(d => d._id !== this.doctorToDelete);
          this.successMessage = 'تم حذف الطبيب بنجاح';
          this.errorMessage = null;
          this.closeDeleteModal();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.errorMessage = this.translateError(err.error?.message || 'فشل في حذف الطبيب');
          setTimeout(() => this.errorMessage = null, 5000);
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.doctorToDelete = null;
  }

  selectDoctor(doctor: Doctor): void {
    this.isEditing = true;
    this.showModal = true;
    this.doctorForm.patchValue({
      ...doctor,
      clinics: Array.isArray(doctor.clinics)
        ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : clinic._id)
        : [],
      schedules: doctor.schedules?.map(s => s.days).flat() || [],
      specialties: doctor.specialties || []
    });
    this.imagePreview = doctor.image ?? null;
    this.selectedImageFile = null;
    this.updateDoctorValidators(doctor.specialization);
    this.errorMessage = null;
    this.successMessage = null;
  }

  openAddDoctorModal(): void {
    this.isEditing = false;
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.doctorForm.reset({
      _id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      specialization: 'طب تخصصي',
      specialties: [],
      clinics: [],
      schedules: [],
      status: 'متاح',
      image: null
    });
    this.selectedImageFile = null;
    this.imagePreview = null;
    this.isEditing = false;
    this.errorMessage = null;
    this.successMessage = null;
    this.updateDoctorValidators('طب تخصصي');
  }

  translateError(message: string): string {
    const errorTranslations: { [key: string]: string } = {
      'الطبيب موجود بالفعل': 'الطبيب موجود بالفعل',
      'الطبيب غير موجود': 'الطبيب غير موجود',
      'بعض العيادات غير موجودة': 'بعض العيادات غير موجودة',
      'خطأ في الخادم': 'خطأ في الخادم',
      'التخصص غير صالح، يجب أن يكون "طب عام" أو "طب تخصصي"': 'التخصص غير صالح، يجب أن يكون "طب عام" أو "طب تخصصي"',
      'يجب توفير عيادة واحدة على الأقل': 'يجب توفير عيادة واحدة على الأقل',
      'يجب توفير قائمة التخصصات لطب تخصصي': 'يجب توفير قائمة التخصصات لطب تخصصي',
      'يجب توفير يوم واحد على الأقل لطب عام': 'يجب توفير يوم واحد على الأقل لطب عام',
      'Invalid file type. Only JPEG, PNG, and GIF are allowed.': 'يرجى تحميل صورة صالحة (JPEG، PNG، أو GIF)'
    };
    return errorTranslations[message] || message;
  }
}
