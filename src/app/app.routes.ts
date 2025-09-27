import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  // Authentication routes
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  // Main application routes with lazy loading
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'doctors',
        loadComponent: () => import('./features/doctors/doctors.component').then(m => m.DoctorsComponent)
      },
      {
        path: 'clinics',
        loadComponent: () => import('./features/clinics/clinics.component').then(m => m.ClinicsComponent)
      },
      {
        path: 'clinics/:name',
        loadComponent: () => import('./features/show-clinics/show-clinics.component').then(m => m.ShowClinicsComponent)
      },
      {
        path: 'media',
        loadComponent: () => import('./features/media/media.component').then(m => m.MediaComponent)
      },
      {
        path: 'appointment',
        loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent)
      },
      {
        path: 'articles/heart-health',
        loadComponent: () => import('./articles/heart-health/heart-health.component').then(m => m.HeartHealthComponent)
      },
      {
        path: 'articles/mental-health',
        loadComponent: () => import('./articles/mental-health/mental-health.component').then(m => m.MentalHealthComponent)
      },
      {
          path: 'articles/nutrition',
          loadComponent: () => import('./articles/nutrition-guide/nutrition-guide.component').then(m => m.NutritionGuideComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'all-users',
        loadComponent: () => import('./dashboard/all-users/all-users.component').then(m => m.AllUsersComponent)
      },
      {
        path: 'add-testimonials',
        loadComponent: () => import('./dashboard/add-testimonials/add-testimonials.component').then(m => m.AddTestimonialsComponent)
      },
      {
        path: 'clinics-option',
        loadComponent: () => import('./dashboard/clinics-options/clinics-options.component').then(m => m.ClinicsOptionsComponent)
      },
      {
        path: 'doctors-option',
        loadComponent: () => import('./dashboard/doctors-options/doctors-options.component').then(m => m.DoctorsOptionsComponent)
      },
      {
        path: 'booking-option',
        loadComponent: () => import('./dashboard/booking-options/booking-options.component').then(m => m.BookingOptionsComponent)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
