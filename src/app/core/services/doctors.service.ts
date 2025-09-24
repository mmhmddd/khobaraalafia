import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constant/api-endpoints';
import { AuthService } from './auth.service';

// Interface for clinic object (used in clinics array)
export interface ClinicRef {
  _id: string;
  name: string;
}

// Interface for doctor schedule
export interface DoctorSchedule {
  clinic?: string; // Clinic ID, optional for "طب عام"
  days: string[];
  startTime?: string;
  endTime?: string;
  _id?: string;
}

// Doctor interface for type safety
export interface Doctor {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  yearsOfExperience: number;
  specialization: 'طب عام' | 'طب تخصصي';
  specialties?: string[];
  clinics?: (string | ClinicRef)[]; // Allow both string IDs and clinic objects
  schedules?: DoctorSchedule[];
  status: 'متاح' | 'غير متاح';
  image?: string | null; // Full URL or null if no image
  bookingsToday?: number;
  bookingsLast7Days?: number;
  bookingsLast30Days?: number;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
  about: string; // Required field
  specialWords: string[]; // Required, at least one value
}

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
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

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(API_ENDPOINTS.DOCTORS.GET_ALL, { headers: this.getAuthHeaders() })
      .pipe(
        map(doctors =>
          doctors.map(doctor => ({
            ...doctor,
            clinics: Array.isArray(doctor.clinics)
              ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
              : []
          }))
        )
      );
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(API_ENDPOINTS.DOCTORS.GET_BY_ID(id), { headers: this.getAuthHeaders() })
      .pipe(
        map(doctor => ({
          ...doctor,
          clinics: Array.isArray(doctor.clinics)
            ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
            : []
        }))
      );
  }

  createDoctor(doctor: Doctor, imageFile?: File | null): Observable<Doctor> {
    const formData = new FormData();
    formData.append('name', doctor.name);
    formData.append('email', doctor.email);
    formData.append('phone', doctor.phone);
    formData.append('address', doctor.address);
    formData.append('yearsOfExperience', doctor.yearsOfExperience.toString());
    formData.append('specialization', doctor.specialization);
    formData.append('status', doctor.status || 'متاح');
    formData.append('about', doctor.about); // Required field
    if (doctor.specialties && doctor.specialties.length) {
      formData.append('specialties', JSON.stringify(doctor.specialties));
    }
    if (doctor.clinics && doctor.clinics.length) {
      // Ensure clinics is an array of IDs
      const clinicIds = Array.isArray(doctor.clinics)
        ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
        : [];
      formData.append('clinics', JSON.stringify(clinicIds));
    }
    if (doctor.schedules && doctor.schedules.length) {
      // Ensure schedules with "All" are sent as-is (backend handles expansion)
      formData.append('schedules', JSON.stringify(doctor.schedules));
    }
    if (doctor.specialWords && doctor.specialWords.length) {
      formData.append('specialWords', JSON.stringify(doctor.specialWords)); // Required field
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Doctor>(
      API_ENDPOINTS.DOCTORS.CREATE,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateDoctor(id: string, doctor: Partial<Doctor>, imageFile?: File | null): Observable<Doctor> {
    const formData = new FormData();
    if (doctor.name) formData.append('name', doctor.name);
    if (doctor.email) formData.append('email', doctor.email);
    if (doctor.phone) formData.append('phone', doctor.phone);
    if (doctor.address) formData.append('address', doctor.address);
    if (doctor.yearsOfExperience !== undefined) formData.append('yearsOfExperience', doctor.yearsOfExperience.toString());
    if (doctor.specialization) formData.append('specialization', doctor.specialization);
    if (doctor.status) formData.append('status', doctor.status);
    if (doctor.about !== undefined) formData.append('about', doctor.about); // Required field
    if (doctor.specialties && doctor.specialties.length) {
      formData.append('specialties', JSON.stringify(doctor.specialties));
    }
    if (doctor.clinics && doctor.clinics.length) {
      // Ensure clinics is an array of IDs
      const clinicIds = Array.isArray(doctor.clinics)
        ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
        : [];
      formData.append('clinics', JSON.stringify(clinicIds));
    }
    if (doctor.schedules && doctor.schedules.length) {
      // Ensure schedules with "All" are sent as-is (backend handles expansion)
      formData.append('schedules', JSON.stringify(doctor.schedules));
    }
    if (doctor.specialWords && doctor.specialWords.length) {
      formData.append('specialWords', JSON.stringify(doctor.specialWords)); // Required field
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put<Doctor>(
      API_ENDPOINTS.DOCTORS.UPDATE(id),
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteDoctor(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      API_ENDPOINTS.DOCTORS.DELETE(id),
      { headers: this.getAuthHeaders() }
    );
  }
}
