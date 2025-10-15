import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent
  ]
})
export class AdminManagementComponent implements OnInit {
  addAdminForm: FormGroup;
  admins: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.addAdminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]]
    });
  }

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users from backend:', users); // Debug log
        this.admins = users
          .filter((u: any) => u.role === 'admin')
          .map((u: any) => ({
            ...u,
            id: u._id // Map _id to id for frontend consistency
          }));
        console.log('Mapped admins:', this.admins); // Debug log
      },
      error: (err) => {
        console.error('Error loading users:', err);
        if (err.status === 401) {
          this.errorMessage = 'غير مصرح: يرجى تسجيل الدخول كمشرف.';
        } else {
          this.errorMessage = 'فشل تحميل المشرفين: ' + (err.error?.message || 'خطأ غير معروف');
        }
      }
    });
  }

  createAdmin() {
    if (this.addAdminForm.valid) {
      const adminData = this.addAdminForm.value;
      console.log('Creating admin with data:', adminData); // Debug log
      this.authService.createAdmin(adminData).subscribe({
        next: (res) => {
          console.log('Create admin response:', res); // Debug log
          this.successMessage = 'تم إنشاء المشرف بنجاح.';
          this.errorMessage = '';
          this.addAdminForm.reset();
          this.loadAdmins();
        },
        error: (err) => {
          console.error('Error creating admin:', err);
          if (err.status === 400) {
            this.errorMessage = 'خطأ: المشرف بهذا البريد الإلكتروني موجود بالفعل.';
          } else if (err.status === 401) {
            this.errorMessage = 'غير مصرح: يرجى تسجيل الدخول كمشرف.';
          } else if (err.status === 500) {
            this.errorMessage = 'خطأ في الخادم: غير قادر على إنشاء المشرف. يرجى المحاولة لاحقًا أو التواصل مع الدعم.';
          } else {
            this.errorMessage = 'خطأ في إنشاء المشرف: ' + (err.error?.message || 'خطأ غير معروف');
          }
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'يرجى ملء النموذج بشكل صحيح.';
    }
  }

  sendResetEmail(admin: any) {
    if (!admin.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
      this.errorMessage = 'البريد الإلكتروني غير صالح.';
      this.successMessage = '';
      return;
    }
    this.authService.forgetPassword({ email: admin.email }).subscribe({
      next: (res) => {
        this.successMessage = `تم إرسال بريد إعادة تعيين كلمة المرور إلى ${admin.email}.`;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error sending reset email:', err);
        if (err.status === 500) {
          this.errorMessage = 'خطأ في الخادم: غير قادر على إرسال بريد إعادة التعيين. يرجى التحقق من إعدادات البريد أو التواصل مع الدعم.';
        } else if (err.status === 404) {
          this.errorMessage = 'المستخدم غير موجود.';
        } else {
          this.errorMessage = 'خطأ في إرسال بريد إعادة التعيين: ' + (err.error?.message || 'خطأ غير معروف');
        }
        this.successMessage = '';
      }
    });
  }

  deleteAdmin(id: string) {
    if (!id) {
      this.errorMessage = 'لا يمكن حذف المشرف: معرف غير صالح.';
      this.successMessage = '';
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا المشرف؟')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.successMessage = 'تم حذف المشرف بنجاح.';
          this.errorMessage = '';
          this.loadAdmins();
        },
        error: (err) => {
          console.error('Error deleting admin:', err);
          this.errorMessage = 'خطأ في حذف المشرف: ' + (err.error?.message || 'خطأ غير معروف');
          this.successMessage = '';
        }
      });
    }
  }
}
