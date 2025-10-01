import { Component, OnInit, HostListener, Inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';

// Define ClinicCard interface (same as in ClinicsComponent)
interface ClinicCard {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  icon: string;
  status: 'active' | 'inactive';
  color: string;
  gradient: string;
  bgPattern: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  email: string = '';
  isScrolled: boolean = false;
  currentYear: number = new Date().getFullYear();
  currentLanguage: string = 'ar';
  clinics: ClinicCard[] = []; // Update type to ClinicCard[]
  private languageSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.languageSubscription = this.translationService.getCurrentLanguage()
      .subscribe(lang => {
        this.currentLanguage = lang;
        this.updateDocumentDirection();
        this.updateClinics();
      });

    if (isPlatformBrowser(this.platformId)) {
      this.updateDocumentDirection();
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  private updateClinics(): void {
    const clinicsData = this.translationService.getTranslation('clinics_data');
    // Check if clinicsData is an array and assign the first 8 items
    if (Array.isArray(clinicsData)) {
      this.clinics = (clinicsData as ClinicCard[]).slice(0, 8);
    } else {
      console.error('Expected clinics_data to be an array, got:', clinicsData);
      this.clinics = []; // Fallback to empty array to avoid runtime errors
    }
  }

  getEncodedName(name: string): string {
    return encodeURIComponent(name);
  }

  private updateDocumentDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const footer = document.querySelector('.footer') as HTMLElement;
      if (footer) {
        footer.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');
      }
    }
  }

  subscribeNewsletter(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log(`Subscribing email: ${this.email}`);
      this.showNotification(this.translationService.getTranslation('newsletter_subscribe_success'), 'success');
      this.email = '';
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

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.pageYOffset > 300;
      const backToTop = document.querySelector('.back-to-top') as HTMLElement;
      if (backToTop) {
        if (this.isScrolled) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
}
