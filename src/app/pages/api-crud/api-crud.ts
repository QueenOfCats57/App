import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../api-crud/api.service';
import { ApiObject, CreateApiObject } from '../api-crud/api.model';

@Component({
  selector: 'app-api-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './api-crud.html',
  styleUrls: ['./api-crud.scss']
})
export class ApiCrudComponent implements OnInit, OnDestroy {
  
  // Данные
  objects: ApiObject[] = [];
  selectedObject: ApiObject | null = null;
  
  // Состояние загрузки
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Форма для создания нового объекта
  newObject: CreateApiObject = {
    name: '',
    data: {
      year: new Date().getFullYear(),
      price: 0,
      CPU_model: '',
      Hard_disk_size: '',
      color: '',
      description: '',
      rating: 0
    }
  };
  
  // Форма для обновления
  updateObject: {
    id: string;
    name: string;
    year: number;
    price: number;
    CPU_model: string;
    Hard_disk_size: string;
    color: string;
    description: string;
    rating: number;
  } = {
    id: '',
    name: '',
    year: 0,
    price: 0,
    CPU_model: '',
    Hard_disk_size: '',
    color: '',
    description: '',
    rating: 0
  };
  
  // Подписки
  private subscriptions: Subscription = new Subscription();
  
  // Состояние UI
  showAddForm = false;
  showEditForm = false;
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit(): void {
    this.loadAllObjects();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('🧹 API Demo компонент уничтожен');
  }
  
  /**
   * Загрузка всех объектов
   */
  loadAllObjects(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.subscriptions.add(
      this.apiService.getAllObjects().subscribe({
        next: (objects) => {
          this.objects = objects;
          this.isLoading = false;
          this.showSuccess('Данные успешно загружены!');
        },
        error: (error) => {
          this.isLoading = false;
          this.showError(error.message);
        }
      })
    );
  }
  
  /**
   * Создание нового объекта
   */
  createObject(): void {
    if (!this.isFormValid()) {
      this.showError('Заполните все обязательные поля');
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = null;
    
    const objectToCreate: CreateApiObject = {
      name: this.newObject.name,
      data: {
        year: this.newObject.data.year,
        price: this.newObject.data.price,
        CPU_model: this.newObject.data.CPU_model,
        Hard_disk_size: this.newObject.data.Hard_disk_size,
        color: this.newObject.data.color,
        description: this.newObject.data.description,
        rating: this.newObject.data.rating
      }
    };
    
    this.subscriptions.add(
      this.apiService.createObject(objectToCreate).subscribe({
        next: (newObj) => {
          this.objects.unshift(newObj);
          this.resetAddForm();
          this.isSubmitting = false;
          this.showAddForm = false;
          this.showSuccess('Объект успешно создан!');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showError(error.message);
        }
      })
    );
  }
  
  /**
   * Обновление объекта
   */
  updateObjectMethod(): void {
    if (!this.updateObject.id || !this.updateObject.name) {
      this.showError('ID и название обязательны');
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = null;
    
    const updateData = {
      name: this.updateObject.name,
      data: {
        year: this.updateObject.year,
        price: this.updateObject.price,
        CPU_model: this.updateObject.CPU_model,
        Hard_disk_size: this.updateObject.Hard_disk_size,
        color: this.updateObject.color,
        description: this.updateObject.description,
        rating: this.updateObject.rating
      }
    };
    
    this.subscriptions.add(
      this.apiService.updateObject(this.updateObject.id, updateData).subscribe({
        next: (updated) => {
          // Обновляем объект в списке
          const index = this.objects.findIndex(obj => obj.id === updated.id);
          if (index !== -1) {
            this.objects[index] = updated;
          }
          this.resetUpdateForm();
          this.isSubmitting = false;
          this.showEditForm = false;
          this.selectedObject = null;
          this.showSuccess('Объект успешно обновлен!');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showError(error.message);
        }
      })
    );
  }
  
  /**
   * Удаление объекта
   */
  deleteObject(id: string, name: string): void {
    if (confirm(`Вы уверены, что хотите удалить "${name}"?`)) {
      this.isSubmitting = true;
      
      this.subscriptions.add(
        this.apiService.deleteObject(id).subscribe({
          next: () => {
            this.objects = this.objects.filter(obj => obj.id !== id);
            this.isSubmitting = false;
            this.showSuccess(`"${name}" успешно удален!`);
            
            if (this.selectedObject?.id === id) {
              this.selectedObject = null;
              this.showEditForm = false;
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            this.showError(error.message);
          }
        })
      );
    }
  }
  
  /**
   * Выбор объекта для редактирования
   */
  selectObjectForEdit(object: ApiObject): void {
    this.selectedObject = object;
    this.updateObject = {
      id: object.id,
      name: object.name,
      year: object.data.year,
      price: object.data.price,
      CPU_model: object.data.CPU_model,
      Hard_disk_size: object.data.Hard_disk_size,
      color: object.data.color || '',
      description: object.data.description || '',
      rating: object.data.rating || 0
    };
    this.showEditForm = true;
    this.showAddForm = false;
  }
  
  /**
   * Проверка валидности формы
   */
  isFormValid(): boolean {
    return !!(
      this.newObject.name &&
      this.newObject.data.year &&
      this.newObject.data.price > 0 &&
      this.newObject.data.CPU_model &&
      this.newObject.data.Hard_disk_size
    );
  }
  
  /**
   * Сброс формы добавления
   */
  resetAddForm(): void {
    this.newObject = {
      name: '',
      data: {
        year: new Date().getFullYear(),
        price: 0,
        CPU_model: '',
        Hard_disk_size: '',
        color: '',
        description: '',
        rating: 0
      }
    };
  }
  
  /**
   * Сброс формы обновления
   */
  resetUpdateForm(): void {
    this.updateObject = {
      id: '',
      name: '',
      year: 0,
      price: 0,
      CPU_model: '',
      Hard_disk_size: '',
      color: '',
      description: '',
      rating: 0
    };
  }
  
  /**
   * Отображение ошибки
   */
  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
  
  /**
   * Отображение успеха
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }
  
  /**
   * Получение цвета для рейтинга
   */
  getRatingColor(rating: number): string {
    if (rating >= 4) return '#4caf50';
    if (rating >= 3) return '#ff9800';
    return '#f44336';
  }
  
  /**
   * Обновление списка (перезагрузка)
   */
  refreshList(): void {
    this.loadAllObjects();
  }
  
  /**
   * Отмена редактирования
   */
  cancelEdit(): void {
    this.showEditForm = false;
    this.selectedObject = null;
    this.resetUpdateForm();
  }
  
  /**
   * Отмена добавления
   */
  cancelAdd(): void {
    this.showAddForm = false;
    this.resetAddForm();
  }
}