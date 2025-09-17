import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss'
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  originalUsers: any[] = [];
  errorMessage: string | null = null;
  isEditModalOpen: boolean = false;
  editForm: FormGroup;
  filterForm: FormGroup;
  selectedUserId: string | null = null;
  isLoading: boolean = false;

  ageRanges = [
    { label: 'All Ages', value: null },
    { label: '0-18', value: '0-18' },
    { label: '19-30', value: '19-30' },
    { label: '31-50', value: '31-50' },
    { label: '51+', value: '51+' }
  ];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      age: [null, [Validators.min(0)]],
      role: ['']
    });

    this.filterForm = this.fb.group({
      search: [''],
      role: [''],
      age: [null]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.filterForm.valueChanges.subscribe(() => this.filterUsers());
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getAllUsers().subscribe({
      next: (response: any) => {
        this.originalUsers = response.map((user: any) => ({
          ...user,
          id: user._id
        }));
        this.users = [...this.originalUsers];
        this.filteredUsers = [...this.originalUsers];
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'غير مصرح، يرجى تسجيل الدخول مرة أخرى.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = error.error?.message || 'فشل تحميل المستخدمين. حاول مرة أخرى لاحقًا.';
        }
        console.error('Error fetching users:', error);
      }
    });
  }

  filterUsers(): void {
    const { search, role, age } = this.filterForm.value;
    this.filteredUsers = this.originalUsers.filter(user => {
      const matchesSearch = !search ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !role || user.role === role;
      let matchesAge = true;
      if (age) {
        if (age === '0-18') matchesAge = user.age >= 0 && user.age <= 18;
        else if (age === '19-30') matchesAge = user.age >= 19 && user.age <= 30;
        else if (age === '31-50') matchesAge = user.age >= 31 && user.age <= 50;
        else if (age === '51+') matchesAge = user.age >= 51;
      }
      return matchesSearch && matchesRole && matchesAge;
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filteredUsers = [...this.originalUsers];
  }

  showUser(id: string): void {
    if (!id) {
      this.errorMessage = 'معرف المستخدم غير صالح.';
      return;
    }
    this.router.navigate(['/dashboard/users', id]);
  }

  openEditModal(user: any): void {
    this.selectedUserId = user._id;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      age: user.age || null,
      role: user.role || ''
    });
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedUserId = null;
    this.editForm.reset();
  }

  submitEditForm(): void {
    if (this.editForm.valid && this.selectedUserId) {
      this.isLoading = true;
      const userData = {
        name: this.editForm.value.name,
        email: this.editForm.value.email,
        phone: this.editForm.value.phone || undefined,
        address: this.editForm.value.address || undefined,
        age: this.editForm.value.age || undefined,
        role: this.editForm.value.role || undefined
      };
      this.usersService.updateUser(this.selectedUserId, userData).subscribe({
        next: (response: any) => {
          this.closeEditModal();
          this.errorMessage = null;
          this.loadUsers();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'فشل تحديث المستخدم. حاول مرة أخرى لاحقًا.';
          console.error('Error updating user:', error);
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (!id) {
      this.errorMessage = 'معرف المستخدم غير صالح.';
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      this.isLoading = true;
      this.usersService.deleteUser(id).subscribe({
        next: (response: any) => {
          this.users = this.users.filter(user => user._id !== id);
          this.filteredUsers = this.filteredUsers.filter(user => user._id !== id);
          this.originalUsers = this.originalUsers.filter(user => user._id !== id);
          this.errorMessage = null;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'فشل حذف المستخدم. حاول مرة أخرى لاحقًا.';
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
