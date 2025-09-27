import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
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
      specialWords: this.fb.array([]),
      videos: this.fb.array([]),
      doctorIds: [[]],
      icon: [''],
      color: [''],
      gradient: [''],
      bgPattern: [''],
      nameEn: ['']
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

  get specialWordsControls(): FormArray {
    return this.clinicForm.get('specialWords') as FormArray;
  }

  get videosControls(): FormArray {
    return this.clinicForm.get('videos') as FormArray;
  }

  addSpecialWord(word: string = ''): void {
    const lastWordControl = this.specialWordsControls.controls[this.specialWordsControls.length - 1];
    if (lastWordControl && !lastWordControl.get('word')?.value?.trim()) {
      this.errorMessage = 'يرجى ملء الكلمة الخاصة الحالية قبل إضافة واحدة جديدة';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }
    this.specialWordsControls.push(this.fb.group({
      word: [word, [Validators.minLength(1)]]
    }));
    this.clinicForm.updateValueAndValidity();
  }

  removeSpecialWord(index: number): void {
    this.specialWordsControls.removeAt(index);
    if (this.specialWordsControls.length === 0) {
      this.addSpecialWord();
    }
    this.clinicForm.updateValueAndValidity();
  }

  cleanSpecialWords(): string[] {
    const validWords = this.specialWordsControls.controls
      .map(control => control.get('word')?.value)
      .filter(word => word && word.trim());

    while (this.specialWordsControls.length) {
      this.specialWordsControls.removeAt(0);
    }

    validWords.forEach(word => {
      this.addSpecialWord(word);
    });

    if (this.specialWordsControls.length === 0) {
      this.addSpecialWord();
    }

    return validWords;
  }

  addVideo(file: File | null = null, url: string = '', label: string = ''): void {
    const lastVideoControl = this.videosControls.controls[this.videosControls.length - 1];
    if (lastVideoControl && !lastVideoControl.get('file')?.value && !lastVideoControl.get('url')?.value && !lastVideoControl.get('label')?.value?.trim()) {
      this.errorMessage = 'يرجى تحديد ملف فيديو أو تسمية قبل إضافة واحد جديد';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }
    this.videosControls.push(this.fb.group({
      file: [file],
      url: [url],
      fileName: [file ? file.name : ''],
      label: [label, file ? [Validators.required, Validators.minLength(1)] : []]
    }));
    this.clinicForm.updateValueAndValidity();
  }

  removeVideo(index: number): void {
    this.videosControls.removeAt(index);
    if (this.videosControls.length === 0) {
      this.addVideo();
    }
    this.clinicForm.updateValueAndValidity();
  }

  cleanVideos(): { files: File[], labels: string[] } {
    const validVideos = this.videosControls.controls
      .map((control, index) => ({
        file: control.get('file')?.value,
        url: control.get('url')?.value,
        fileName: control.get('fileName')?.value,
        label: control.get('label')?.value?.trim() || '',
        index
      }))
      .filter(video => video.file || video.url);

    while (this.videosControls.length) {
      this.videosControls.removeAt(0);
    }

    validVideos.forEach(video => {
      this.addVideo(video.file, video.url, video.label);
    });

    if (this.videosControls.length === 0) {
      this.addVideo();
    }

    return {
      files: validVideos.filter(v => v.file instanceof File).map(v => v.file),
      labels: validVideos.filter(v => v.file instanceof File).map(v => v.label)
    };
  }

  onVideoFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const control = this.videosControls.at(index);
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['video/mp4', 'video/avi', 'video/mov'];
      if (validTypes.includes(file.type)) {
        const previewUrl = URL.createObjectURL(file);
        control.patchValue({ file, fileName: file.name, url: previewUrl });
        // Ensure label is required when a file is selected
        control.get('label')?.setValidators([Validators.required, Validators.minLength(1)]);
        control.get('label')?.updateValueAndValidity();
      } else {
        this.errorMessage = 'يرجى تحميل ملف فيديو بصيغة mp4، avi، أو mov';
        setTimeout(() => this.errorMessage = '', 5000);
        control.patchValue({ file: null, fileName: '', url: '', label: '' });
        control.get('label')?.clearValidators();
        control.get('label')?.updateValueAndValidity();
      }
    } else {
      control.patchValue({ file: null, fileName: '', url: '', label: '' });
      control.get('label')?.clearValidators();
      control.get('label')?.updateValueAndValidity();
    }
    this.clinicForm.updateValueAndValidity();
  }

  specialtiesValidator(control: AbstractControl): ValidationErrors | null {
    const specializationType = this.clinicForm?.get('specializationType')?.value;
    const specialties = control.value as string[];
    if (specializationType === 'specialized' && (!specialties || specialties.length === 0)) {
      return { required: true };
    }
    return null;
  }

  markFormAsTouched(): void {
    this.clinicForm.markAllAsTouched();
    this.specialWordsControls.controls.forEach(control => control.markAllAsTouched());
    this.videosControls.controls.forEach(control => control.markAllAsTouched());
  }

  ngOnInit() {
    if (!this.authService.getToken()) {
      this.errorMessage = 'يرجى تسجيل الدخول أولاً';
      this.router.navigate(['/login']);
      return;
    }
    this.loadClinics();
    this.loadDoctors();
    this.addSpecialWord();
    this.addVideo();
  }

  loadClinics() {
    this.loading = true;
    this.clinicService.getAllClinics().subscribe({
      next: (clinics) => {
        console.log('Loaded clinics:', clinics);
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
        console.log('Loaded doctors:', doctors);
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

  downloadVideo(videoUrl: string, fileName: string): void {
    console.log('Downloading video:', { videoUrl, fileName });
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  deleteVideo(clinicId: string, videoId: string): void {
    if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      this.clinicService.deleteVideo(clinicId, videoId).subscribe({
        next: (updatedClinic: Clinic) => {
          console.log('Video deleted:', updatedClinic);
          const index = this.clinics.findIndex(c => c._id === updatedClinic._id);
          if (index !== -1) {
            this.clinics[index] = updatedClinic;
          }
          if (this.selectedClinic?._id === updatedClinic._id) {
            this.selectedClinic = updatedClinic;
          }
          this.successMessage = 'تم حذف الفيديو بنجاح';
          this.errorMessage = '';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err: any) => {
          this.errorMessage = `خطأ في حذف الفيديو: ${err.error?.message || err.message}`;
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  createClinic(): void {
    this.cleanSpecialWords();
    const { files: videoFiles, labels: videoLabels } = this.cleanVideos();
    if (this.clinicForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const specialWords = this.specialWordsControls.controls
        .map(control => control.get('word')?.value)
        .filter(word => word && word.trim());

      console.log('Creating clinic with data:', {
        ...this.clinicForm.value,
        specialWords,
        videoFiles: videoFiles.map(file => file.name),
        videoLabels
      });

      const clinicData: Clinic = {
        ...this.clinicForm.value,
        specialties: this.clinicForm.get('specializationType')?.value === 'specialized' ? this.clinicForm.get('specialties')?.value : [],
        specialWords,
        doctorIds: this.clinicForm.get('doctorIds')?.value || [],
        videos: [], // Backend will append new video objects
        icon: this.clinicForm.value.icon || '',
        color: this.clinicForm.value.color || '',
        gradient: this.clinicForm.value.gradient || '',
        bgPattern: this.clinicForm.value.bgPattern || '',
        nameEn: this.clinicForm.value.nameEn || ''
      };

      this.clinicService.createClinic(clinicData, videoFiles, videoLabels).subscribe({
        next: (clinic) => {
          console.log('Clinic created:', clinic);
          this.clinics.push(clinic);
          this.closeModal();
          this.successMessage = 'تم إضافة العيادة بنجاح';
          this.errorMessage = '';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);

          // Reset videos FormArray and populate with created videos
          while (this.videosControls.length) {
            this.videosControls.removeAt(0);
          }
          (clinic.videos || []).forEach(video => this.addVideo(null, video.path, video.label));
          if (!this.videosControls.length) {
            this.addVideo();
          }

          const doctorIds = this.clinicForm.get('doctorIds')?.value as string[];
          if (doctorIds.length > 0) {
            this.clinicService.addDoctorsToClinic(clinic._id!, doctorIds).subscribe({
              next: (updatedClinic) => {
                console.log('Doctors added to clinic:', updatedClinic);
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
          } else if (err.status === 400 && err.error.message.includes('video')) {
            this.errorMessage = 'خطأ في تحميل الفيديو: تأكد من صيغة الملف أو حجمه أو التسميات';
            setTimeout(() => this.errorMessage = '', 5000);
          }
        }
      });
    } else {
      this.markFormAsTouched();
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح، بما في ذلك تسميات الفيديوهات';
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  updateClinic(): void {
    this.cleanSpecialWords();
    const { files: videoFiles, labels: videoLabels } = this.cleanVideos();
    if (this.clinicForm.valid && this.clinicForm.get('_id')?.value && !this.isSubmitting) {
      this.isSubmitting = true;
      const specialWords = this.specialWordsControls.controls
        .map(control => control.get('word')?.value)
        .filter(word => word && word.trim());

      console.log('Updating clinic with data:', {
        ...this.clinicForm.value,
        specialWords,
        videoFiles: videoFiles.map(file => file.name),
        videoLabels
      });

      const clinicData: Partial<Clinic> = {
        ...this.clinicForm.value,
        specialties: this.clinicForm.get('specializationType')?.value === 'specialized' ? this.clinicForm.get('specialties')?.value : [],
        specialWords,
        doctorIds: this.clinicForm.get('doctorIds')?.value || [],
        videos: this.videosControls.controls
          .filter(control => control.get('url')?.value && !control.get('url')?.value.startsWith('blob:'))
          .map(control => ({ path: control.get('url')?.value, label: control.get('label')?.value })),
        icon: this.clinicForm.value.icon || '',
        color: this.clinicForm.value.color || '',
        gradient: this.clinicForm.value.gradient || '',
        bgPattern: this.clinicForm.value.bgPattern || '',
        nameEn: this.clinicForm.value.nameEn || ''
      };

      this.clinicService.updateClinic(this.clinicForm.get('_id')?.value, clinicData, videoFiles, videoLabels).subscribe({
        next: (updatedClinic) => {
          console.log('Clinic updated:', updatedClinic);
          const index = this.clinics.findIndex(c => c._id === updatedClinic._id);
          if (index !== -1) {
            this.clinics[index] = updatedClinic;
          }
          if (this.selectedClinic?._id === updatedClinic._id) {
            this.selectedClinic = updatedClinic;
          }
          this.closeModal();
          this.successMessage = 'تم تحديث العيادة بنجاح';
          this.errorMessage = '';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);

          // Reset videos FormArray and populate with updated videos
          while (this.videosControls.length) {
            this.videosControls.removeAt(0);
          }
          (updatedClinic.videos || []).forEach(video => this.addVideo(null, video.path, video.label));
          if (!this.videosControls.length) {
            this.addVideo();
          }

          const doctorIds = this.clinicForm.get('doctorIds')?.value as string[];
          if (doctorIds.length > 0) {
            this.clinicService.addDoctorsToClinic(updatedClinic._id!, doctorIds).subscribe({
              next: (finalClinic) => {
                console.log('Doctors updated in clinic:', finalClinic);
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
          } else if (err.status === 400 && err.error.message.includes('video')) {
            this.errorMessage = 'خطأ في تحميل الفيديو: تأكد من صيغة الملف أو حجمه أو التسميات';
            setTimeout(() => this.errorMessage = '', 5000);
          }
        }
      });
    } else {
      this.markFormAsTouched();
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح، بما في ذلك تسميات الفيديوهات';
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  addDoctors(): void {
    if (this.addDoctorsForm.valid && this.selectedClinicId && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('Adding doctors to clinic:', {
        clinicId: this.selectedClinicId,
        doctorIds: this.selectedDoctorIds
      });
      this.clinicService.addDoctorsToClinic(this.selectedClinicId, this.selectedDoctorIds).subscribe({
        next: (updatedClinic) => {
          console.log('Doctors added:', updatedClinic);
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
        console.log('Fetched clinic for view:', clinic);
        console.log('Videos in fetched clinic:', clinic.videos);
        this.selectedClinic = { ...clinic, videos: clinic.videos || [] };
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
    while (this.specialWordsControls.length) {
      this.specialWordsControls.removeAt(0);
    }
    (clinic.specialWords || []).forEach(word => this.addSpecialWord(word));
    if (!this.specialWordsControls.length) {
      this.addSpecialWord();
    }
    while (this.videosControls.length) {
      this.videosControls.removeAt(0);
    }
    (clinic.videos || []).forEach(video => this.addVideo(null, video.path, video.label));
    if (!this.videosControls.length) {
      this.addVideo();
    }
    this.clinicForm.patchValue({
      ...clinic,
      specialties: clinic.specialties || [],
      availableDays: clinic.availableDays || [],
      about: clinic.about || '',
      doctorIds: clinic.doctors?.map(doctor => doctor._id) || [],
      icon: clinic.icon || '',
      color: clinic.color || '',
      gradient: clinic.gradient || '',
      bgPattern: clinic.bgPattern || '',
      nameEn: clinic.nameEn || ''
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
      videos: [],
      doctorIds: [],
      icon: '',
      color: '',
      gradient: '',
      bgPattern: '',
      nameEn: ''
    });
    while (this.specialWordsControls.length) {
      this.specialWordsControls.removeAt(0);
    }
    while (this.videosControls.length) {
      this.videosControls.removeAt(0);
    }
    this.addSpecialWord();
    this.addVideo();
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = false;
  }
}
