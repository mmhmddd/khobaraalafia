import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constant/api-endpoints';
import { AuthService } from './auth.service';

// Interface for clinic doctor (subset for clinic's doctors array)
export interface ClinicDoctor {
  _id: string;
  name: string;
  email: string;
  specialization: 'طب عام' | 'طب تخصصي';
  specialties: string[];
  status: 'متاح' | 'غير متاح';
}

// Clinic interface for type safety
export interface Clinic {
  icon: string;
  color: string;
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
  videos: string[];
  doctorIds?: string[]; // Added to support doctor selection
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

  createClinic(clinic: Clinic, videoFiles?: File[]): Observable<Clinic> {
    const formData = new FormData();
    formData.append('name', clinic.name);
    formData.append('email', clinic.email);
    formData.append('phone', clinic.phone);
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
    if (videoFiles && videoFiles.length) {
      videoFiles.forEach(file => {
        formData.append('videos', file);
      });
    }

    return this.http.post<Clinic>(
      API_ENDPOINTS.CLINICS.CREATE,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateClinic(id: string, clinic: Partial<Clinic>, videoFiles?: File[]): Observable<Clinic> {
    const formData = new FormData();
    if (clinic.name) formData.append('name', clinic.name);
    if (clinic.email) formData.append('email', clinic.email);
    if (clinic.phone) formData.append('phone', clinic.phone);
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
    if (videoFiles && videoFiles.length) {
      videoFiles.forEach(file => {
        formData.append('videos', file);
      });
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
}
