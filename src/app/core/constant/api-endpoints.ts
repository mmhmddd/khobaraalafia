// src/app/core/constant/api-endpoints.ts
import { environment } from "../../../environment/environment";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${environment.apiUrl}/auth/register`,
    LOGIN: `${environment.apiUrl}/auth/login`,
    FORGET_PASSWORD: `${environment.apiUrl}/auth/forgetpassword`,
    RESET_PASSWORD: `${environment.apiUrl}/auth/resetpassword`,
    CREATE_ADMIN: `${environment.apiUrl}/auth/create-admin`
  },
  USERS: {
    GET_ALL: `${environment.apiUrl}/users`,
    GET_BY_ID: (id: string) => `${environment.apiUrl}/users/${id}`,
    UPDATE: (id: string) => `${environment.apiUrl}/users/${id}`,
    DELETE: (id: string) => `${environment.apiUrl}/users/${id}`
  },
  TESTIMONIALS: {
    GET_ALL: `${environment.apiUrl}/testimonials`,
    GET_BY_ID: (id: string) => `${environment.apiUrl}/testimonials/${id}`,
    CREATE: `${environment.apiUrl}/testimonials`,
    UPDATE: (id: string) => `${environment.apiUrl}/testimonials/${id}`,
    DELETE: (id: string) => `${environment.apiUrl}/testimonials/${id}`
  },
  DOCTORS: {
    GET_ALL: `${environment.apiUrl}/doctors`,
    GET_BY_ID: (id: string) => `${environment.apiUrl}/doctors/${id}`,
    CREATE: `${environment.apiUrl}/doctors`,
    UPDATE: (id: string) => `${environment.apiUrl}/doctors/${id}`,
    DELETE: (id: string) => `${environment.apiUrl}/doctors/${id}`
  },
  CLINICS: {
    GET_ALL: `${environment.apiUrl}/clinics`,
    GET_BY_ID: (id: string) => `${environment.apiUrl}/clinics/${id}`,
    CREATE: `${environment.apiUrl}/clinics`,
    UPDATE: (id: string) => `${environment.apiUrl}/clinics/${id}`,
    DELETE: (id: string) => `${environment.apiUrl}/clinics/${id}`,
    ADD_DOCTORS: (id: string) => `${environment.apiUrl}/clinics/${id}/add-doctors`
  },
  BOOKINGS: {
    CREATE: `${environment.apiUrl}/bookings`,
    GET_MY_BOOKINGS: `${environment.apiUrl}/bookings/my`,
    CANCEL: (id: string) => `${environment.apiUrl}/bookings/${id}/cancel`,
    GET_ALL: `${environment.apiUrl}/bookings`
  }
};
