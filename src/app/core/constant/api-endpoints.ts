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
  }
};
