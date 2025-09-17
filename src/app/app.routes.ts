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
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  // Wildcard route for handling invalid paths
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
