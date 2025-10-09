import { Component, OnInit } from '@angular/core';
import { CursorImagesService, CursorImage } from '../../core/services/cursor-images.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";

@Component({
  selector: 'app-cursor-control',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, SidebarComponent],
  templateUrl: './cursor-control.component.html',
  styleUrls: ['./cursor-control.component.scss'],
})
export class CursorControlComponent implements OnInit {
  images: CursorImage[] = [];
  selectedFile: File | null = null;
  form: Partial<CursorImage> & { imageFile?: File } = { order: 0, isActive: true };
  editingId: string | null = null;
  token = localStorage.getItem('token') || ''; // Replace with your auth service
  errorMessage = '';
  successMessage = '';

  constructor(private cursorImagesService: CursorImagesService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.cursorImagesService.getAllCursorImages().subscribe({
      next: (images) => {
        this.images = images.sort((a, b) => a.order - b.order);
      },
      error: (error) => {
        this.errorMessage = 'فشل في تحميل الصور: ' + error.message;
      },
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.form.imageFile = this.selectedFile ? this.selectedFile : undefined;
  }

  submitForm(): void {
    if (!this.selectedFile && !this.editingId) {
      this.errorMessage = 'الصورة مطلوبة للإدخالات الجديدة';
      return;
    }
    if (this.form.order === undefined || this.form.order === null) {
      this.errorMessage = 'الترتيب مطلوب';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) formData.append('image', this.selectedFile);
    formData.append('order', this.form.order.toString());
    if (this.form.title) formData.append('title', this.form.title);
    if (this.form.description) formData.append('description', this.form.description);
    if (this.form.isActive !== undefined) formData.append('isActive', this.form.isActive.toString());

    if (this.editingId) {
      this.cursorImagesService.updateCursorImage(this.editingId, formData, this.token).subscribe({
        next: () => {
          this.successMessage = 'تم تحديث الصورة بنجاح';
          this.resetForm();
          this.loadImages();
        },
        error: (error) => {
          this.errorMessage = 'فشل في تحديث الصورة: ' + error.message;
        },
      });
    } else {
      this.cursorImagesService.createCursorImage(formData, this.token).subscribe({
        next: () => {
          this.successMessage = 'تم إضافة الصورة بنجاح';
          this.resetForm();
          this.loadImages();
        },
        error: (error) => {
          this.errorMessage = 'فشل في إضافة الصورة: ' + error.message;
        },
      });
    }
  }

  editImage(image: CursorImage): void {
    this.editingId = image._id;
    this.form = { ...image, imageFile: undefined };
    this.selectedFile = null;
  }

  deleteImage(id: string): void {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      this.cursorImagesService.deleteCursorImage(id, this.token).subscribe({
        next: () => {
          this.successMessage = 'تم حذف الصورة بنجاح';
          this.loadImages();
        },
        error: (error) => {
          this.errorMessage = 'فشل في حذف الصورة: ' + error.message;
        },
      });
    }
  }

  resetForm(): void {
    this.form = { order: 0, isActive: true };
    this.selectedFile = null;
    this.editingId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  drop(event: CdkDragDrop<CursorImage[]>): void {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
    this.images.forEach((image, index) => {
      if (image.order !== index) {
        const formData = new FormData();
        formData.append('order', index.toString());
        this.cursorImagesService.updateCursorImage(image._id, formData, this.token).subscribe({
          error: (error) => {
            this.errorMessage = `فشل في تحديث ترتيب الصورة ${image._id}: ${error.message}`;
          },
        });
      }
      image.order = index;
    });
  }
}
