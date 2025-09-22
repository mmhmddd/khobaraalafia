import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { Router, NavigationEnd, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isDashboardRoute = false;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    const dashboardRoutes = ['/dashboard', '/all-users', '/booking-option', '/clinics-option', '/doctors-option'];
    const initialUrl = this.router.url.split('?')[0].split('#')[0];
    this.isDashboardRoute = dashboardRoutes.some(route => initialUrl.startsWith(route)) ||
                           /^\/member\/[^\/]+$/.test(initialUrl);
    console.log('Initial URL:', initialUrl, 'isDashboardRoute:', this.isDashboardRoute);
  }

  ngOnInit() {
    const dashboardRoutes = ['/dashboard', '/all-users', '/booking-option', '/clinics-option', '/doctors-option'];

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects.split('?')[0].split('#')[0];
      this.isDashboardRoute = dashboardRoutes.some(route => url.startsWith(route)) ||
                             /^\/member\/[^\/]+$/.test(url);
      console.log('NavigationEnd URL:', url, 'isDashboardRoute:', this.isDashboardRoute);
    });
  }
}
