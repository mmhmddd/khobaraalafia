import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  currentLanguage: string = 'ar';
  isScrolled: boolean = false;
  private routerSubscription?: Subscription;
  private languageSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private translationService: TranslationService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkLoginStatus();
  }

  ngOnInit(): void {
    this.languageSubscription = this.translationService.getCurrentLanguage()
      .subscribe(lang => {
        this.currentLanguage = lang;
        this.updateDocumentDirection();
      });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
        this.updateActiveStates();
        this.closeMobileMenu();
      });

    if (isPlatformBrowser(this.platformId)) {
      this.setupDropdownTouchHandling();
      this.setupOutsideClickListener();
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.pageYOffset > 50;
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (this.isScrolled) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      const navbarCollapse = document.getElementById('navbarNav');
      const navbarToggler = document.querySelector('.navbar-toggler');
      const target = event.target as HTMLElement;

      // Check if the click is outside the navbar collapse and not on the toggler
      if (
        navbarCollapse?.classList.contains('show') &&
        !navbarCollapse.contains(target) &&
        !navbarToggler?.contains(target)
      ) {
        this.closeMobileMenu();
      }
    }
  }

  checkLoginStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.isAdmin = this.authService.isAdmin();
    }
  }

  toggleAuth(): void {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.navigateToLogin();
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
    this.closeMobileMenu();
  }

  private logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.showNotification(this.translationService.getTranslation('logout_success'), 'success');
    this.router.navigate(['/home']);
  }

  private navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguage(newLang);
    this.showNotification(
      this.translationService.getTranslation(`language_changed_to_${newLang}`),
      'info'
    );
  }

  private updateDocumentDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      if (this.currentLanguage === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        htmlElement.setAttribute('lang', 'ar');
        bodyElement.classList.add('rtl');
        bodyElement.classList.remove('ltr');
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        htmlElement.setAttribute('lang', 'en');
        bodyElement.classList.add('ltr');
        bodyElement.classList.remove('rtl');
      }
    }
  }

  private updateActiveStates(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const activeLinks = document.querySelectorAll('.nav-link.active');
        activeLinks.forEach(link => {
          link.classList.add('active');
        });
      }, 100);
    }
  }

  private showNotification(message: string, type: 'success' | 'info' | 'error'): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log(`${type.toUpperCase()}: ${message}`);
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-content">
          <span>${message}</span>
          <button class="toast-close">&times;</button>
        </div>
      `;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        ${this.currentLanguage === 'ar' ? 'right: 20px' : 'left: 20px'};
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      }, 100);
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn?.addEventListener('click', () => {
        this.removeToast(toast);
      });
      setTimeout(() => {
        this.removeToast(toast);
      }, 3000);
    }
  }

  private removeToast(toast: HTMLElement): void {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  closeMobileMenu(): void {
    if (isPlatformBrowser(this.platformId)) {
      const navbarCollapse = document.getElementById('navbarNav');
      const navbarToggler = document.querySelector('.navbar-toggler') as HTMLButtonElement | null;
      if (navbarCollapse && navbarCollapse.classList.contains('show') && navbarToggler) {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
      }
    }
  }

  private setupDropdownTouchHandling(): void {
    if (isPlatformBrowser(this.platformId)) {
      const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (event: Event) => {
          const dropdownMenu = toggle.nextElementSibling as HTMLElement;
          if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
            if (dropdownMenu.classList.contains('show')) {
              return;
            }
            event.preventDefault();
          }
        });
      });
    }
  }

  private setupOutsideClickListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.onDocumentClick.bind(this));
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMobileMenu();
    }
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
}
