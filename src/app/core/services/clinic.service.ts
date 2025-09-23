import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constant/api-endpoints';

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
  address: string;
  specializationType: 'general' | 'specialized';
  specialties: string[];
  status: 'active' | 'inactive';
  availableDays: string[];
  price: number;
  bookingsToday?: number;
  bookingsLast7Days?: number;
  bookingsLast30Days?: number;
  totalBookings?: number;
  createdAt?: string;
  updatedAt?: string;
  doctors?: ClinicDoctor[];
}

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  constructor(private http: HttpClient) {}

  getAllClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(API_ENDPOINTS.CLINICS.GET_ALL);
  }

  getClinicById(id: string): Observable<Clinic> {
    return this.http.get<Clinic>(API_ENDPOINTS.CLINICS.GET_BY_ID(id));
  }

  createClinic(clinic: Clinic): Observable<Clinic> {
    return this.http.post<Clinic>(
      API_ENDPOINTS.CLINICS.CREATE,
      clinic,
      { headers: this.getAuthHeaders() }
    );
  }

  updateClinic(id: string, clinic: Partial<Clinic>): Observable<Clinic> {
    return this.http.put<Clinic>(
      API_ENDPOINTS.CLINICS.UPDATE(id),
      clinic,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteClinic(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      API_ENDPOINTS.CLINICS.DELETE(id),
      { headers: this.getAuthHeaders() }
    );
  }
}
