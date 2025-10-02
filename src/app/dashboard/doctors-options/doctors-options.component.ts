// src/app/doctors-options/doctors-options.component.ts
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClinicService, Clinic } from '../../core/services/clinic.service';
import { DoctorsService, Doctor, DoctorSchedule, ClinicRef } from '../../core/services/doctors.service';
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
  showViewModal = false;
  doctorToDelete: string | null = null;
  selectedDoctor: Doctor | null = null;
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
  specialtyEnControls: { [key: string]: FormControl } = {};
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  defaultImage = 'assets/images/default-doctor.png';

  get schedules(): FormArray<FormGroup> {
    return this.doctorForm.get('schedules') as FormArray<FormGroup>;
  }

  constructor(
    private fb: FormBuilder,
    private clinicService: ClinicService,
    private doctorsService: DoctorsService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize English specialty controls
    this.specialtiesList.forEach(specialty => {
      this.specialtyEnControls[specialty] = this.fb.control('');
    });

    this.doctorForm = this.fb.group({
      _id: [''],
      name_ar: ['', [Validators.required, Validators.minLength(3)]],
      name_en: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      address_ar: ['', [Validators.required, Validators.minLength(5)]],
      address_en: [''],
      yearsOfExperience: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      specialization_ar: ['', Validators.required],
      specialization_en: [''],
      specialties: [[], this.specialtiesValidator.bind(this)],
      clinics: [[], [Validators.required, Validators.minLength(1)]],
      schedules: this.fb.array([]),
      status_ar: ['متاح', Validators.required],
      status_en: [''],
      image: [null],
      about_ar: ['', [Validators.required, Validators.minLength(10)]],
      about_en: [''],
      specialWords: [[], [Validators.required, Validators.minLength(1), this.specialWordsValidator.bind(this)]],
      newSpecialWordAr: [''],
      newSpecialWordEn: ['']
    });

    this.doctorForm.get('specialization_ar')?.valueChanges.subscribe(value => {
      this.updateDoctorValidators(value);
    });
  }

  // Methods to format specialties
  getSpecialtiesAr(): string {
    if (!this.selectedDoctor?.specialties || this.selectedDoctor.specialties.length === 0) {
      return 'غير متوفر';
    }
    return this.selectedDoctor.specialties.map(s => s.ar).join(', ');
  }

  getSpecialtiesEn(): string {
    if (!this.selectedDoctor?.specialties || this.selectedDoctor.specialties.length === 0) {
      return 'غير متوفر';
    }
    return this.selectedDoctor.specialties.map(s => s.en || s.ar).join(', ');
  }

  // Methods to format specialWords
  getSpecialWordsAr(): string {
    if (!this.selectedDoctor?.specialWords || this.selectedDoctor.specialWords.length === 0) {
      return 'غير متوفر';
    }
    return this.selectedDoctor.specialWords.map(word => word.ar).join(', ');
  }

  getSpecialWordsEn(): string {
    if (!this.selectedDoctor?.specialWords || this.selectedDoctor.specialWords.length === 0) {
      return 'غير متوفر';
    }
    return this.selectedDoctor.specialWords.map(word => word.en || word.ar).join(', ');
  }

  specialtiesValidator(control: AbstractControl): ValidationErrors | null {
    const specialization = this.doctorForm?.get('specialization_ar')?.value;
    const specialties = control.value as { ar: string; en?: string }[];
    if (specialization === 'طب تخصصي' && (!specialties || specialties.length === 0 || specialties.some(s => !s.ar))) {
      return { required: true };
    }
    return null;
  }

  specialWordsValidator(control: AbstractControl): ValidationErrors | null {
    const specialWords = control.value as { ar: string; en?: string }[];
    if (specialWords.length > 0 && specialWords.some(word => !word.ar)) {
      return { invalidSpecialWords: true };
    }
    return null;
  }

  schedulesValidator(control: AbstractControl): ValidationErrors | null {
    const specialization = this.doctorForm?.get('specialization_ar')?.value;
    const schedules = control.value as DoctorSchedule[];
    if (specialization === 'طب عام' && (!schedules || schedules.length === 0)) {
      return { required: true };
    }
    if (specialization === 'طب تخصصي' && schedules.length > 0) {
      for (const schedule of schedules) {
        if (!schedule.clinic || !schedule.days || schedule.days.length === 0 ||
            (schedule.startTime && !/^[0-2][0-3]:[0-5][0-9]$/.test(schedule.startTime)) ||
            (schedule.endTime && !/^[0-2][0-3]:[0-5][0-9]$/.test(schedule.endTime))) {
          return { invalidSchedule: true };
        }
      }
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
          clinics: Array.isArray(doctor.clinics)
            ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
            : [],
          schedules: Array.isArray(doctor.schedules) ? doctor.schedules : [],
          specialties: Array.isArray(doctor.specialties) ? doctor.specialties : [],
          specialWords: Array.isArray(doctor.specialWords) ? doctor.specialWords : [],
          yearsOfExperience: doctor.yearsOfExperience || 0,
          about: doctor.about || { ar: '', en: '' }
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

  viewDoctor(id: string): void {
    this.loading = true;
    this.doctorsService.getDoctorById(id).subscribe({
      next: (doctor) => {
        this.selectedDoctor = {
          ...doctor,
          image: doctor.image || null,
          clinics: Array.isArray(doctor.clinics)
            ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
            : [],
          schedules: Array.isArray(doctor.schedules) ? doctor.schedules : [],
          specialties: Array.isArray(doctor.specialties) ? doctor.specialties : [],
          specialWords: Array.isArray(doctor.specialWords) ? doctor.specialWords : [],
          yearsOfExperience: doctor.yearsOfExperience || 0,
          about: doctor.about || { ar: '', en: '' }
        };
        this.showViewModal = true;
        this.loading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = this.translateError(err.error?.message || 'فشل في تحميل تفاصيل الطبيب');
        this.loading = false;
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedDoctor = null;
  }

  getNormalizedClinics(clinics: (string | ClinicRef)[] | undefined): string[] {
    return Array.isArray(clinics)
      ? clinics.map(clinic => typeof clinic === 'string' ? clinic : clinic._id)
      : [];
  }

  getClinicName(clinicId: string): string {
    const clinic = this.clinics.find(c => c._id === clinicId);
    return clinic?.name || 'عيادة غير معروفة';
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
      schedulesControl?.setValidators(this.schedulesValidator.bind(this));
      specialtiesControl?.setValidators([Validators.required, Validators.minLength(1)]);
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
      .map(s => {
        const days = s.days.includes('All') ? ['كل الأيام'] : s.days.map(day => this.translateDay(day));
        return `${days.join(', ')} ${s.clinic ? `(في ${this.clinics.find(c => c._id === s.clinic)?.name || 'عيادة غير معروفة'})` : ''} ${s.startTime && s.endTime ? `من ${s.startTime} إلى ${s.endTime}` : ''}`;
      })
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

  addSpecialWord(): void {
    const newWordAr = this.doctorForm.get('newSpecialWordAr')?.value?.trim();
    const newWordEn = this.doctorForm.get('newSpecialWordEn')?.value?.trim();
    if (newWordAr) {
      const specialWords = this.doctorForm.get('specialWords')?.value as { ar: string; en?: string }[];
      const newWord = { ar: newWordAr, en: newWordEn || undefined };
      if (!specialWords.some(word => word.ar === newWordAr)) {
        specialWords.push(newWord);
        this.doctorForm.get('specialWords')?.setValue(specialWords);
        this.doctorForm.get('specialWords')?.markAsTouched();
      }
      this.doctorForm.get('newSpecialWordAr')?.setValue('');
      this.doctorForm.get('newSpecialWordEn')?.setValue('');
    }
  }

  removeSpecialWord(word: { ar: string; en?: string }): void {
    const specialWords = this.doctorForm.get('specialWords')?.value as { ar: string; en?: string }[];
    const updatedWords = specialWords.filter(w => w.ar !== word.ar);
    this.doctorForm.get('specialWords')?.setValue(updatedWords);
    this.doctorForm.get('specialWords')?.markAsTouched();
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

  isSpecialtySelected(specialty: string): boolean {
    const specialties = this.doctorForm.get('specialties')?.value as { ar: string; en?: string }[];
    return specialties.some(s => s.ar === specialty);
  }

  getSpecialtyEnControl(specialty: string): FormControl {
    return this.specialtyEnControls[specialty];
  }

  toggleSpecialty(event: Event, specialty: string): void {
    const specialties = this.doctorForm.get('specialties')?.value as { ar: string; en?: string }[];
    const checkbox = event.target as HTMLInputElement;
    const enValue = this.specialtyEnControls[specialty].value?.trim();
    if (checkbox.checked) {
      if (!specialties.some(s => s.ar === specialty)) {
        specialties.push({ ar: specialty, en: enValue || undefined });
      }
    } else {
      const index = specialties.findIndex(s => s.ar === specialty);
      if (index > -1) {
        specialties.splice(index, 1);
        this.specialtyEnControls[specialty].setValue('');
      }
    }
    this.doctorForm.get('specialties')?.setValue(specialties);
    this.doctorForm.get('specialties')?.markAsTouched();
    this.doctorForm.updateValueAndValidity();
  }

  isDaySelected(day: string): boolean {
    const schedules = this.schedules.value as DoctorSchedule[];
    return schedules.some(s => s.days.includes(day));
  }

  toggleDoctorDay(event: Event, day: string): void {
    const schedules = this.schedules;
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (day === 'All') {
        schedules.clear();
        schedules.push(this.fb.group({
          days: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']],
          clinic: [''],
          startTime: [''],
          endTime: ['']
        }));
      } else {
        const allIndex = schedules.value.findIndex((s: DoctorSchedule) => s.days.includes('All'));
        if (allIndex > -1) {
          schedules.removeAt(allIndex);
        }
        const existingSchedule = schedules.value.find((s: DoctorSchedule) => s.days.includes(day));
        if (!existingSchedule) {
          schedules.push(this.fb.group({
            days: [[day]],
            clinic: [''],
            startTime: [''],
            endTime: ['']
          }));
        } else {
          const index = schedules.value.indexOf(existingSchedule);
          const days = [...existingSchedule.days, day];
          schedules.at(index).patchValue({ days });
        }
      }
    } else {
      const scheduleIndex = schedules.value.findIndex((s: DoctorSchedule) => s.days.includes(day));
      if (scheduleIndex > -1) {
        const schedule = schedules.at(scheduleIndex).value as DoctorSchedule;
        const days = schedule.days.filter((d: string) => d !== day);
        if (days.length === 0) {
          schedules.removeAt(scheduleIndex);
        } else {
          schedules.at(scheduleIndex).patchValue({ days });
        }
      }
    }
    schedules.markAsTouched();
    this.doctorForm.updateValueAndValidity();
  }

  toggleScheduleDay(event: Event, scheduleIndex: number, day: string): void {
    const schedules = this.schedules;
    const schedule = schedules.at(scheduleIndex) as FormGroup;
    const days = schedule.get('days')?.value as string[];
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      if (day === 'All') {
        schedule.patchValue({
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        });
      } else if (!days.includes(day)) {
        days.push(day);
        schedule.patchValue({ days });
      }
    } else {
      if (day === 'All') {
        schedule.patchValue({ days: [] });
      } else {
        const newDays = days.filter(d => d !== day);
        schedule.patchValue({ days: newDays });
      }
    }
    schedules.markAsTouched();
    this.doctorForm.updateValueAndValidity();
  }

  addSchedule(): void {
    const schedules = this.schedules;
    schedules.push(this.fb.group({
      clinic: [''],
      days: [[]],
      startTime: [''],
      endTime: ['']
    }));
    this.doctorForm.updateValueAndValidity();
  }

  removeSchedule(index: number): void {
    const schedules = this.schedules;
    schedules.removeAt(index);
    this.doctorForm.updateValueAndValidity();
  }

  createDoctor(): void {
    if (this.doctorForm.valid) {
      const doctorData: Doctor = {
        name: {
          ar: this.doctorForm.get('name_ar')?.value,
          en: this.doctorForm.get('name_en')?.value || undefined
        },
        email: this.doctorForm.get('email')?.value || undefined,
        phone: this.doctorForm.get('phone')?.value,
        address: {
          ar: this.doctorForm.get('address_ar')?.value,
          en: this.doctorForm.get('address_en')?.value || undefined
        },
        yearsOfExperience: Number(this.doctorForm.get('yearsOfExperience')?.value),
        specialization: {
          ar: this.doctorForm.get('specialization_ar')?.value,
          en: this.doctorForm.get('specialization_en')?.value || undefined
        },
        specialties: this.doctorForm.get('specialization_ar')?.value === 'طب تخصصي' ? this.doctorForm.get('specialties')?.value : [],
        clinics: this.doctorForm.get('clinics')?.value,
        schedules: this.doctorForm.get('specialization_ar')?.value === 'طب عام'
          ? this.doctorForm.get('schedules')?.value
          : this.doctorForm.get('schedules')?.value.filter((s: DoctorSchedule) => s.days.length > 0),
        status: {
          ar: this.doctorForm.get('status_ar')?.value,
          en: this.doctorForm.get('status_en')?.value || undefined
        },
        about: {
          ar: this.doctorForm.get('about_ar')?.value,
          en: this.doctorForm.get('about_en')?.value || undefined
        },
        specialWords: this.doctorForm.get('specialWords')?.value
      };
      this.doctorsService.createDoctor(doctorData, this.selectedImageFile).subscribe({
        next: (createdDoctor) => {
          this.doctors.push({
            ...createdDoctor,
            clinics: Array.isArray(createdDoctor.clinics)
              ? createdDoctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
              : []
          });
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
      const doctorData: Partial<Doctor> = {
        name: {
          ar: this.doctorForm.get('name_ar')?.value,
          en: this.doctorForm.get('name_en')?.value || undefined
        },
        email: this.doctorForm.get('email')?.value || undefined,
        phone: this.doctorForm.get('phone')?.value,
        address: {
          ar: this.doctorForm.get('address_ar')?.value,
          en: this.doctorForm.get('address_en')?.value || undefined
        },
        yearsOfExperience: Number(this.doctorForm.get('yearsOfExperience')?.value),
        specialization: {
          ar: this.doctorForm.get('specialization_ar')?.value,
          en: this.doctorForm.get('specialization_en')?.value || undefined
        },
        specialties: this.doctorForm.get('specialization_ar')?.value === 'طب تخصصي' ? this.doctorForm.get('specialties')?.value : [],
        clinics: this.doctorForm.get('clinics')?.value,
        schedules: this.doctorForm.get('specialization_ar')?.value === 'طب عام'
          ? this.doctorForm.get('schedules')?.value
          : this.doctorForm.get('schedules')?.value.filter((s: DoctorSchedule) => s.days.length > 0),
        status: {
          ar: this.doctorForm.get('status_ar')?.value,
          en: this.doctorForm.get('status_en')?.value || undefined
        },
        about: {
          ar: this.doctorForm.get('about_ar')?.value,
          en: this.doctorForm.get('about_en')?.value || undefined
        },
        specialWords: this.doctorForm.get('specialWords')?.value
      };
      this.doctorsService.updateDoctor(this.doctorForm.get('_id')?.value, doctorData, this.selectedImageFile).subscribe({
        next: (updatedDoctor) => {
          const index = this.doctors.findIndex(d => d._id === updatedDoctor._id);
          if (index !== -1) {
            this.doctors[index] = {
              ...updatedDoctor,
              clinics: Array.isArray(updatedDoctor.clinics)
                ? updatedDoctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
                : []
            };
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
    const schedules = this.fb.array(
      doctor.schedules?.map(s => this.fb.group({
        clinic: [s.clinic || ''],
        days: [s.days || []],
        startTime: [s.startTime || ''],
        endTime: [s.endTime || '']
      })) || []
    );
    this.doctorForm.reset({
      _id: doctor._id || '',
      name_ar: doctor.name.ar || '',
      name_en: doctor.name.en || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      address_ar: doctor.address.ar || '',
      address_en: doctor.address.en || '',
      yearsOfExperience: doctor.yearsOfExperience || 0,
      specialization_ar: doctor.specialization.ar || 'طب تخصصي',
      specialization_en: doctor.specialization.en || '',
      specialties: doctor.specialties || [],
      clinics: Array.isArray(doctor.clinics)
        ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
        : [],
      schedules: [],
      status_ar: doctor.status.ar || 'متاح',
      status_en: doctor.status.en || '',
      image: null,
      about_ar: doctor.about.ar || '',
      about_en: doctor.about.en || '',
      specialWords: doctor.specialWords || [],
      newSpecialWordAr: '',
      newSpecialWordEn: ''
    });
    this.doctorForm.setControl('schedules', schedules);
    // Set specialty English controls
    this.specialtiesList.forEach(specialty => {
      const found = doctor.specialties?.find(s => s.ar === specialty);
      this.specialtyEnControls[specialty].setValue(found?.en || '');
    });
    this.imagePreview = doctor.image ?? null;
    this.selectedImageFile = null;
    this.updateDoctorValidators(doctor.specialization.ar);
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
      name_ar: '',
      name_en: '',
      email: '',
      phone: '',
      address_ar: '',
      address_en: '',
      yearsOfExperience: 0,
      specialization_ar: 'طب تخصصي',
      specialization_en: '',
      specialties: [],
      clinics: [],
      schedules: [],
      status_ar: 'متاح',
      status_en: '',
      image: null,
      about_ar: '',
      about_en: '',
      specialWords: [],
      newSpecialWordAr: '',
      newSpecialWordEn: ''
    });
    this.doctorForm.setControl('schedules', this.fb.array([]));
    this.specialtiesList.forEach(specialty => {
      this.specialtyEnControls[specialty].setValue('');
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
      'التخصص العربي غير صالح، يجب أن يكون "طب عام" أو "طب تخصصي"': 'التخصص العربي غير صالح، يجب أن يكون "طب عام" أو "طب تخصصي"',
      'التخصص الإنجليزي غير صالح': 'التخصص الإنجليزي غير صالح',
      'يجب توفير عيادة واحدة على الأقل': 'يجب توفير عيادة واحدة على الأقل',
      'يجب توفير قائمة التخصصات العربية لطب تخصصي': 'يجب توفير قائمة التخصصات العربية لطب تخصصي',
      'يجب توفير كلمات خاصة عربية واحدة على الأقل': 'يجب توفير كلمة خاصة عربية واحدة على الأقل',
      'سنوات الخبرة يجب أن تكون عددًا صحيحًا غير سالب': 'سنوات الخبرة يجب أن تكون عددًا صحيحًا غير سالب',
      'أيام الجدول غير صالحة': 'أيام الجدول غير صالحة',
      'تنسيق وقت البداية أو النهاية غير صالح': 'تنسيق وقت البداية أو النهاية غير صالح',
      'معرف العيادة في الجدول غير صالح أو غير مرتبط': 'معرف العيادة في الجدول غير صالح أو غير مرتبط',
      'أيام الجدول غير متوافقة مع أيام العيادة': 'أيام الجدول غير متوافقة مع أيام العيادة'
    };
    return errorTranslations[message] || message;
  }
}
