import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentLanguage: string = 'ar';
  private languageSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      address: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });
  }

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
      const registerContainer = document.querySelector('.register-container') as HTMLElement;
      if (registerContainer) {
        registerContainer.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');
      }
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      const formValue = { ...this.registerForm.value, age: +this.registerForm.value.age };
      this.authService.register(formValue).subscribe({
        next: (response) => {
          this.successMessage = this.translationService.getTranslation('register_success');
          this.authService.storeToken(response.token);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = this.translationService.getTranslation('register_failed') || error.error.message;
        }
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
}
