// src/app/core/services/doctors.service.ts (updated for bilingual support)
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

// Interface for doctor schedule (unchanged, not bilingual)
export interface DoctorSchedule {
  clinic?: string; // Clinic ID, optional for "طب عام"
  days: string[];
  startTime?: string;
  endTime?: string;
  _id?: string;
}

// Bilingual Doctor interface for type safety
// Arabic fields are required (non-optional), English are optional
export interface Doctor {
  _id?: string;
  name: { ar: string; en?: string }; // ar required
  email?: string; // optional
  phone: string; // required
  address: { ar: string; en?: string }; // ar required
  yearsOfExperience: number; // required
  specialization: { ar: 'طب عام' | 'طب تخصصي'; en?: 'General Medicine' | 'Specialized Medicine' }; // ar required
  specialties?: { ar: string; en?: string }[]; // ar required in each if provided (for "طب تخصصي")
  clinics?: (string | ClinicRef)[]; // Allow both string IDs and clinic objects
  schedules?: DoctorSchedule[];
  status: { ar: 'متاح' | 'غير متاح'; en?: 'Available' | 'Unavailable' }; // ar required
  image?: string | null; // Full URL or null if no image
  bookingsToday?: number;
  bookingsLast7Days?: number;
  bookingsLast30Days?: number;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
  about: { ar: string; en?: string }; // ar required
  specialWords: { ar: string; en?: string }[]; // ar required in each, at least one
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
    return this.http.get<any[]>(API_ENDPOINTS.DOCTORS.GET_ALL, { headers: this.getAuthHeaders() })
      .pipe(
        map((response: any[]) =>
          response.map((rawDoctor: any) => {
            // Handle clinics: Extract IDs if objects (backend populates full objects)
            const clinics = Array.isArray(rawDoctor.clinics)
              ? rawDoctor.clinics.map((clinic: ClinicRef) => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
              : [];
            return {
              ...rawDoctor,
              clinics
            } as Doctor;
          })
        )
      );
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<any>(API_ENDPOINTS.DOCTORS.GET_BY_ID(id), { headers: this.getAuthHeaders() })
      .pipe(
        map((rawDoctor: any) => {
          // Handle clinics: Extract IDs if objects
          const clinics = Array.isArray(rawDoctor.clinics)
            ? rawDoctor.clinics.map((clinic: ClinicRef) => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
            : [];
          return {
            ...rawDoctor,
            clinics
          } as Doctor;
        })
      );
  }

  createDoctor(doctor: Doctor, imageFile?: File | null): Observable<Doctor> {
    const formData = new FormData();

    // Required Arabic fields (always append)
    formData.append('name_ar', doctor.name.ar);
    formData.append('phone', doctor.phone);
    formData.append('address_ar', doctor.address.ar);
    formData.append('yearsOfExperience', doctor.yearsOfExperience.toString());
    formData.append('specialization_ar', doctor.specialization.ar);
    formData.append('status_ar', doctor.status.ar || 'متاح');
    formData.append('about_ar', doctor.about.ar);

    // Optional English fields (append only if provided)
    if (doctor.name.en) formData.append('name_en', doctor.name.en);
    if (doctor.address.en) formData.append('address_en', doctor.address.en);
    if (doctor.specialization.en) formData.append('specialization_en', doctor.specialization.en);
    if (doctor.status.en) formData.append('status_en', doctor.status.en);
    if (doctor.about.en) formData.append('about_en', doctor.about.en);

    // Optional email (append only if provided)
    if (doctor.email) formData.append('email', doctor.email);

    // Optional specialties (for "طب تخصصي", bilingual array with ar required)
    if (doctor.specialties && doctor.specialties.length > 0) {
      // Ensure each specialty has ar (required), en optional
      const validSpecialties = doctor.specialties.filter(s => s.ar);
      if (validSpecialties.length > 0) {
        formData.append('specialties', JSON.stringify(validSpecialties));
      }
    }

    // Required clinics (at least one)
    if (doctor.clinics && doctor.clinics.length > 0) {
      // Ensure clinics is an array of IDs
      const clinicIds = Array.isArray(doctor.clinics)
        ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
        : [];
      if (clinicIds.length > 0) {
        formData.append('clinics', JSON.stringify(clinicIds));
      }
    }

    // Optional schedules
    if (doctor.schedules && doctor.schedules.length > 0) {
      // Ensure schedules with "All" are sent as-is (backend handles expansion)
      formData.append('schedules', JSON.stringify(doctor.schedules));
    }

    // Required specialWords (at least one, bilingual with ar required)
    if (doctor.specialWords && doctor.specialWords.length > 0) {
      // Ensure each specialWord has ar (required), en optional
      const validSpecialWords = doctor.specialWords.filter(w => w.ar);
      if (validSpecialWords.length > 0) {
        formData.append('specialWords', JSON.stringify(validSpecialWords));
      }
    }

    // Optional image
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

    // Append only if provided (for partial updates)
    if (doctor.name?.ar !== undefined) formData.append('name_ar', doctor.name.ar);
    if (doctor.name?.en) formData.append('name_en', doctor.name.en); // Optional
    if (doctor.email) formData.append('email', doctor.email); // Optional
    if (doctor.phone) formData.append('phone', doctor.phone);
    if (doctor.address?.ar !== undefined) formData.append('address_ar', doctor.address.ar);
    if (doctor.address?.en) formData.append('address_en', doctor.address.en); // Optional
    if (doctor.yearsOfExperience !== undefined) formData.append('yearsOfExperience', doctor.yearsOfExperience.toString());
    if (doctor.specialization?.ar !== undefined) formData.append('specialization_ar', doctor.specialization.ar);
    if (doctor.specialization?.en) formData.append('specialization_en', doctor.specialization.en); // Optional
    if (doctor.status?.ar !== undefined) formData.append('status_ar', doctor.status.ar);
    if (doctor.status?.en) formData.append('status_en', doctor.status.en); // Optional
    if (doctor.about?.ar !== undefined) formData.append('about_ar', doctor.about.ar);
    if (doctor.about?.en) formData.append('about_en', doctor.about.en); // Optional

    // Optional specialties (bilingual)
    if (doctor.specialties !== undefined && doctor.specialties.length > 0) {
      const validSpecialties = doctor.specialties.filter(s => s.ar);
      if (validSpecialties.length > 0) {
        formData.append('specialties', JSON.stringify(validSpecialties));
      }
    }

    // Optional clinics
    if (doctor.clinics !== undefined && doctor.clinics.length > 0) {
      const clinicIds = Array.isArray(doctor.clinics)
        ? doctor.clinics.map(clinic => typeof clinic === 'string' ? clinic : (clinic as ClinicRef)._id)
        : [];
      if (clinicIds.length > 0) {
        formData.append('clinics', JSON.stringify(clinicIds));
      }
    }

    // Optional schedules
    if (doctor.schedules !== undefined && doctor.schedules.length > 0) {
      formData.append('schedules', JSON.stringify(doctor.schedules));
    }

    // Optional specialWords (bilingual)
    if (doctor.specialWords !== undefined && doctor.specialWords.length > 0) {
      const validSpecialWords = doctor.specialWords.filter(w => w.ar);
      if (validSpecialWords.length > 0) {
        formData.append('specialWords', JSON.stringify(validSpecialWords));
      }
    }

    // Optional image
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
