import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-contact.component.html',
  styleUrl: './home-contact.component.scss'
})
export class HomeContactComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'ar';
  private languageSubscription: Subscription | undefined;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(lang => {
        this.currentLanguage = lang;
        this.updateDocumentDirection();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      this.errorMessage = this.getTranslation('contact_form_invalid');
      return;
    }

    const formData = form.value;
    this.successMessage = '';
    this.errorMessage = '';

    // Log form data for debugging
    console.log('Form Data:', formData);

    // Construct WhatsApp message with form data
    const phoneNumber = '966551028800'; // Removed '+' for WhatsApp API compatibility
    const message = [
      `${this.getTranslation('contact_name_label')}: ${formData.name || 'N/A'}`,
      `${this.getTranslation('contact_email_label')}: ${formData.email || 'N/A'}`,
      `${this.getTranslation('contact_message_label')}: ${formData.message || 'N/A'}`
    ].join('\n');

    // Double encode to handle special characters properly
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Log the URL for debugging
    if (isPlatformBrowser(this.platformId)) {
      console.log('WhatsApp URL:', whatsappUrl);
      const newWindow = window.open(whatsappUrl, '_blank');
      if (newWindow) {
        this.successMessage = this.getTranslation('contact_success_message');
        form.resetForm();
      } else {
        this.errorMessage = this.getTranslation('contact_whatsapp_error');
        console.error('Failed to open WhatsApp window. Possible pop-up blocker or WhatsApp not installed.');
      }
    } else {
      this.errorMessage = this.getTranslation('contact_error_message');
      console.error('Not in browser environment. Cannot open WhatsApp.');
    }
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }

  private updateDocumentDirection(): void {
    const contactSection = document.querySelector('.contact-section') as HTMLElement;
    const direction = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (contactSection) {
      contactSection.setAttribute('dir', direction);
    }
    document.documentElement.setAttribute('lang', this.currentLanguage);
  }
}
