import { Component, OnInit, HostListener, Inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  email: string = '';
  isScrolled: boolean = false;
  currentYear: number = new Date().getFullYear();
  currentLanguage: string = 'ar';
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
      });

    if (isPlatformBrowser(this.platformId)) {
      this.updateDocumentDirection();
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
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
