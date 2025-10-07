// Clinic Service (clinic.service.ts)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constant/api-endpoints';
import { AuthService } from './auth.service';

export interface ClinicDoctor {
  _id: string;
  name: { ar: string; en?: string };
  specialization: { ar: string; en?: string };
  specialties: { ar: string; en?: string }[];
  yearsOfExperience: number;
  image?: string;
  about?: string;
  status?: string;
  email?: string;
  specialWords?: string[];
}

export interface Clinic {
  [x: string]: any;
  icon: string;
  color: string;
  gradient: string;
  bgPattern: string;
  nameEn: string;
  description?: string;
  _id?: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  specializationType: 'general' | 'specialized';
  specialties: { ar: string; en?: string }[] | string[];
  status: 'active' | 'inactive';
  availableDays: string[];
  price?: number;
  bookingsToday?: number;
  bookingsLast7Days?: number;
  bookingsLast30Days?: number;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
  doctors?: ClinicDoctor[];
  about: string;
  specialWords: string[];
  videos: {
    thumbnail: string;
    _id: string;
    path: string;
    label: string;
  }[];
  doctorIds?: string[];
  isAvailableForBooking: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  getAllClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(API_ENDPOINTS.CLINICS.GET_ALL, { headers: this.getAuthHeaders() });
  }

  getClinicById(id: string): Observable<Clinic> {
    return this.http.get<Clinic>(`${API_ENDPOINTS.CLINICS.GET_BY_ID(id)}?t=${new Date().getTime()}`, { headers: this.getAuthHeaders() });
  }

  getClinicByName(name: string): Observable<Clinic> {
    return this.http.get<Clinic[]>(`${API_ENDPOINTS.CLINICS.GET_ALL}?name=${encodeURIComponent(name)}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(clinics => {
          const clinic = clinics.find(c => c.name === name);
          if (!clinic) {
            throw new Error('العيادة غير موجودة');
          }
          return clinic;
        }),
        catchError(err => {
          console.error('خطأ في جلب العيادة:', err);
          return throwError(() => err);
        })
      );
  }

  createClinic(clinic: Clinic, videoFiles?: File[], videoLabels?: string[]): Observable<Clinic> {
    const formData = new FormData();

    // Validate and append required fields
    if (!clinic.name || !clinic.phone || !clinic.specializationType || !clinic.status || !clinic.about || clinic.isAvailableForBooking === undefined) {
      return throwError(() => new Error('الحقول المطلوبة مفقودة'));
    }

    formData.append('name', clinic.name);
    if (clinic.email) formData.append('email', clinic.email);
    formData.append('phone', clinic.phone);
    formData.append('icon', clinic.icon || '');
    formData.append('color', clinic.color || '');
    formData.append('gradient', clinic.gradient || '');
    formData.append('bgPattern', clinic.bgPattern || '');
    formData.append('nameEn', clinic.nameEn || '');
    if (clinic.description) formData.append('description', clinic.description);
    if (clinic.address) formData.append('address', clinic.address);
    formData.append('specializationType', clinic.specializationType);
    formData.append('status', clinic.status);
    formData.append('about', clinic.about);
    formData.append('isAvailableForBooking', clinic.isAvailableForBooking.toString());

    // Handle specialties
    if (clinic.specialties && clinic.specialties.length) {
      const specialtiesArray = clinic.specialties.map(spec =>
        typeof spec === 'object' && spec.ar ? spec.ar : spec
      ).filter(spec => typeof spec === 'string' && spec.trim());
      if (clinic.specializationType === 'specialized' && specialtiesArray.length === 0) {
        return throwError(() => new Error('يجب توفير قائمة التخصصات للعيادة المتخصصة'));
      }
      formData.append('specialties', JSON.stringify(specialtiesArray));
    } else if (clinic.specializationType === 'specialized') {
      return throwError(() => new Error('يجب توفير قائمة التخصصات للعيادة المتخصصة'));
    }

    // Handle availableDays
    if (clinic.availableDays && clinic.availableDays.length) {
      const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "All"];
      if (!clinic.availableDays.every(day => validDays.includes(day))) {
        return throwError(() => new Error('أيام غير صالحة'));
      }
      formData.append('availableDays', JSON.stringify(clinic.availableDays));
    } else {
      return throwError(() => new Error('يجب تحديد يوم واحد على الأقل أو \'All\''));
    }

    // Handle price
    if (clinic.price !== undefined) {
      formData.append('price', clinic.price.toString());
    }

    // Handle specialWords
    if (clinic.specialWords && clinic.specialWords.length) {
      const validSpecialWords = clinic.specialWords.filter(word => typeof word === 'string' && word.trim());
      if (validSpecialWords.length > 0) {
        formData.append('specialWords', JSON.stringify(validSpecialWords));
      }
    }

    // Handle doctorIds
    if (clinic.doctorIds && clinic.doctorIds.length) {
      formData.append('doctorIds', JSON.stringify(clinic.doctorIds));
    }

    // Handle video files and labels
    if (videoFiles && videoFiles.length && videoLabels && videoLabels.length) {
      if (videoFiles.length !== videoLabels.length) {
        return throwError(() => new Error('عدد التسميات لا يتطابق مع عدد الفيديوهات'));
      }
      const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov'];
      for (const file of videoFiles) {
        if (!validVideoTypes.includes(file.type)) {
          return throwError(() => new Error('نوع ملف غير صالح. يجب أن يكون MP4، AVI، أو MOV'));
        }
        formData.append('videos', file);
      }
      const validLabels = videoLabels.filter(label => typeof label === 'string' && label.trim());
      if (validLabels.length !== videoFiles.length) {
        return throwError(() => new Error('يجب أن تكون تسميات الفيديو نصوصًا غير فارغة'));
      }
      formData.append('videoLabels', JSON.stringify(validLabels));
    }

    return this.http.post<Clinic>(
      API_ENDPOINTS.CLINICS.CREATE,
      formData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Error creating clinic:', err);
        return throwError(() => err);
      })
    );
  }

  updateClinic(id: string, clinic: Partial<Clinic>, videoFiles?: File[], videoLabels?: string[], existingVideos?: { _id: string, label: string }[]): Observable<Clinic> {
    const formData = new FormData();

    // Append fields only if provided
    if (clinic.name) formData.append('name', clinic.name);
    if (clinic.email !== undefined) formData.append('email', clinic.email || '');
    if (clinic.phone) formData.append('phone', clinic.phone);
    if (clinic.icon) formData.append('icon', clinic.icon);
    if (clinic.color) formData.append('color', clinic.color);
    if (clinic.gradient) formData.append('gradient', clinic.gradient);
    if (clinic.bgPattern) formData.append('bgPattern', clinic.bgPattern);
    if (clinic.nameEn) formData.append('nameEn', clinic.nameEn);
    if (clinic.description) formData.append('description', clinic.description);
    if (clinic.address) formData.append('address', clinic.address);
    if (clinic.specializationType) formData.append('specializationType', clinic.specializationType);
    if (clinic.status) formData.append('status', clinic.status);
    if (clinic.about !== undefined) formData.append('about', clinic.about);
    if (clinic.isAvailableForBooking !== undefined) {
      formData.append('isAvailableForBooking', clinic.isAvailableForBooking.toString());
    }

    // Handle specialties
    if (clinic.specialties && clinic.specialties.length) {
      const specialtiesArray = clinic.specialties.map(spec =>
        typeof spec === 'object' && spec.ar ? spec.ar : spec
      ).filter(spec => typeof spec === 'string' && spec.trim());
      if (clinic.specializationType === 'specialized' && specialtiesArray.length === 0) {
        return throwError(() => new Error('يجب توفير قائمة التخصصات للعيادة المتخصصة'));
      }
      formData.append('specialties', JSON.stringify(specialtiesArray));
    }

    // Handle availableDays
    if (clinic.availableDays && clinic.availableDays.length) {
      const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "All"];
      if (!clinic.availableDays.every(day => validDays.includes(day))) {
        return throwError(() => new Error('أيام غير صالحة'));
      }
      formData.append('availableDays', JSON.stringify(clinic.availableDays));
    }

    // Handle price
    if (clinic.price !== undefined) {
      formData.append('price', clinic.price.toString());
    }

    // Handle specialWords
    if (clinic.specialWords && clinic.specialWords.length) {
      const validSpecialWords = clinic.specialWords.filter(word => typeof word === 'string' && word.trim());
      if (validSpecialWords.length > 0) {
        formData.append('specialWords', JSON.stringify(validSpecialWords));
      }
    }

    // Handle doctorIds
    if (clinic.doctorIds && clinic.doctorIds.length) {
      formData.append('doctorIds', JSON.stringify(clinic.doctorIds));
    }

    // Handle existingVideos
    if (existingVideos && existingVideos.length) {
      formData.append('existingVideos', JSON.stringify(existingVideos));
    }

    // Handle video files and labels
    if (videoFiles && videoFiles.length && videoLabels && videoLabels.length) {
      if (videoFiles.length !== videoLabels.length) {
        return throwError(() => new Error('عدد التسميات لا يتطابق مع عدد الفيديوهات'));
      }
      const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov'];
      for (const file of videoFiles) {
        if (!validVideoTypes.includes(file.type)) {
          return throwError(() => new Error('نوع ملف غير صالح. يجب أن يكون MP4، AVI، أو MOV'));
        }
        formData.append('videos', file);
      }
      const validLabels = videoLabels.filter(label => typeof label === 'string' && label.trim());
      if (validLabels.length !== videoFiles.length) {
        return throwError(() => new Error('يجب أن تكون تسميات الفيديو نصوصًا غير فارغة'));
      }
      formData.append('videoLabels', JSON.stringify(validLabels));
    }

    return this.http.put<Clinic>(
      API_ENDPOINTS.CLINICS.UPDATE(id),
      formData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Error updating clinic:', err);
        return throwError(() => err);
      })
    );
  }

  deleteClinic(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      API_ENDPOINTS.CLINICS.DELETE(id),
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Error deleting clinic:', err);
        return throwError(() => err);
      })
    );
  }

  addDoctorsToClinic(clinicId: string, doctorIds: string[]): Observable<Clinic> {
    return this.http.post<Clinic>(
      API_ENDPOINTS.CLINICS.ADD_DOCTORS(clinicId),
      { doctorIds },
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Error adding doctors to clinic:', err);
        return throwError(() => err);
      })
    );
  }

  deleteVideo(clinicId: string, videoId: string): Observable<Clinic> {
    return this.http.delete<Clinic>(
      API_ENDPOINTS.CLINICS.DELETE_VIDEO(clinicId, videoId),
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Error deleting video:', err);
        return throwError(() => err);
      })
    );
  }
}
