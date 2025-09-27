import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constant/api-endpoints';
import { AuthService } from './auth.service';

export interface ClinicDoctor {
  _id: string;
  name: string;
  email: string;
  specialization: 'طب عام' | 'طب تخصصي';
  specialties: string[];
  status: 'متاح' | 'غير متاح';
  yearsOfExperience: number;
  specialWords: string[];
  image?: string | null;
  about: string;
}

export interface Clinic {
  icon: string;
  color: string;
  gradient: string;
  bgPattern: string;
  nameEn: string;
  description?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  specializationType: 'general' | 'specialized';
  specialties: string[];
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
    thumbnail: string; _id: string; path: string; label: string
}[];
  doctorIds?: string[];
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
    return this.http.get<Clinic>(API_ENDPOINTS.CLINICS.GET_BY_ID(id), { headers: this.getAuthHeaders() });
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
          throw err;
        })
      );
  }

  createClinic(clinic: Clinic, videoFiles?: File[], videoLabels?: string[]): Observable<Clinic> {
    const formData = new FormData();
    formData.append('name', clinic.name);
    formData.append('email', clinic.email);
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
    if (clinic.specialties && clinic.specialties.length) {
      formData.append('specialties', JSON.stringify(clinic.specialties));
    }
    if (clinic.availableDays && clinic.availableDays.length) {
      formData.append('availableDays', JSON.stringify(clinic.availableDays));
    }
    if (clinic.price !== undefined) {
      formData.append('price', clinic.price.toString());
    }
    if (clinic.specialWords && clinic.specialWords.length) {
      formData.append('specialWords', JSON.stringify(clinic.specialWords));
    }
    if (clinic.doctorIds && clinic.doctorIds.length) {
      formData.append('doctorIds', JSON.stringify(clinic.doctorIds));
    }
    if (videoFiles && videoFiles.length && videoLabels && videoLabels.length) {
      if (videoFiles.length !== videoLabels.length) {
        throw new Error('عدد التسميات لا يتطابق مع عدد الفيديوهات');
      }
      videoFiles.forEach(file => {
        formData.append('videos', file);
      });
      formData.append('videoLabels', JSON.stringify(videoLabels));
    }

    return this.http.post<Clinic>(
      API_ENDPOINTS.CLINICS.CREATE,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateClinic(id: string, clinic: Partial<Clinic>, videoFiles?: File[], videoLabels?: string[]): Observable<Clinic> {
    const formData = new FormData();
    if (clinic.name) formData.append('name', clinic.name);
    if (clinic.email) formData.append('email', clinic.email);
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
    if (clinic.specialties && clinic.specialties.length) {
      formData.append('specialties', JSON.stringify(clinic.specialties));
    }
    if (clinic.availableDays && clinic.availableDays.length) {
      formData.append('availableDays', JSON.stringify(clinic.availableDays));
    }
    if (clinic.price !== undefined) {
      formData.append('price', clinic.price.toString());
    }
    if (clinic.specialWords && clinic.specialWords.length) {
      formData.append('specialWords', JSON.stringify(clinic.specialWords));
    }
    if (clinic.doctorIds && clinic.doctorIds.length) {
      formData.append('doctorIds', JSON.stringify(clinic.doctorIds));
    }
    if (videoFiles && videoFiles.length && videoLabels && videoLabels.length) {
      if (videoFiles.length !== videoLabels.length) {
        throw new Error('عدد التسميات لا يتطابق مع عدد الفيديوهات');
      }
      videoFiles.forEach(file => {
        formData.append('videos', file);
      });
      formData.append('videoLabels', JSON.stringify(videoLabels));
    }

    return this.http.put<Clinic>(
      API_ENDPOINTS.CLINICS.UPDATE(id),
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteClinic(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      API_ENDPOINTS.CLINICS.DELETE(id),
      { headers: this.getAuthHeaders() }
    );
  }

  addDoctorsToClinic(clinicId: string, doctorIds: string[]): Observable<Clinic> {
    return this.http.post<Clinic>(
      API_ENDPOINTS.CLINICS.ADD_DOCTORS(clinicId),
      { doctorIds },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteVideo(clinicId: string, videoId: string): Observable<Clinic> {
    return this.http.delete<Clinic>(
      API_ENDPOINTS.CLINICS.DELETE_VIDEO(clinicId, videoId),
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => {
        console.error('Error deleting video:', err);
        throw err;
      })
    );
  }
}
