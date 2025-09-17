import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showForgotPassword: boolean = false;
  showResetPassword: boolean = false;
  resetToken: string | null = null;
  currentLanguage: string = 'ar';
  private languageSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
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

    this.route.paramMap.subscribe(params => {
      this.resetToken = params.get('token');
      if (this.resetToken) {
        this.showResetPassword = true;
        this.showForgotPassword = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  private updateDocumentDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loginContainer = document.querySelector('.login-container') as HTMLElement;
      if (loginContainer) {
        loginContainer.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');
      }
    }
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.storeToken(response.token);
          this.successMessage = this.translationService.getTranslation('login_success').replace('{name}', response.user.name);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = this.translationService.getTranslation('login_failed') || error.error.message;
        }
      });
    }
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.errorMessage = null;
      this.successMessage = null;
      this.authService.forgetPassword(this.forgotPasswordForm.value).subscribe({
        next: (response) => {
          this.successMessage = this.translationService.getTranslation('forgot_password_success') || response.message;
          this.showForgotPassword = false;
        },
        error: (error) => {
          this.errorMessage = this.translationService.getTranslation('forgot_password_failed') || error.error.message;
        }
      });
    }
  }

  onResetPasswordSubmit(): void {
    if (this.resetPasswordForm.valid && this.resetToken) {
      this.errorMessage = null;
      this.successMessage = null;
      this.authService.resetPassword(this.resetToken, this.resetPasswordForm.value).subscribe({
        next: (response) => {
          this.successMessage = this.translationService.getTranslation('reset_password_success') || response.message;
          this.showResetPassword = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = this.translationService.getTranslation('reset_password_failed') || error.error.message;
        }
      });
    }
  }

  toggleForgotPassword(): void {
    this.showForgotPassword = !this.showForgotPassword;
    this.errorMessage = null;
    this.successMessage = null;
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
}
