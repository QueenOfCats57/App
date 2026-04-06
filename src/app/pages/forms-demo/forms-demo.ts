import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  FormControl, 
  Validators, 
  AbstractControl, 
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { Course } from '../../services/course.model';

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './forms-demo.html',
  styleUrls: ['./forms-demo.scss']
})
export class FormsDemoComponent implements OnInit, OnDestroy {
  
  // ========== 1. РЕАКТИВНАЯ ФОРМА (Авторизация) ==========
  loginForm: FormGroup;
  loginSubmitted = false;
  loginSuccess = false;
  
  // ========== 2. TEMPLATE-DRIVEN ФОРМА (Регистрация) ==========
  registrationModel = {
    email: '',
    fullName: '',
    phone: '',
    birthDate: '',
    age: null,
    courseId: null,
    agreeToTerms: false
  };
  registrationSubmitted = false;
  registrationSuccess = false;
  
  // Данные для select (курсы из сервиса)
  courses: Course[] = [];
  private subscriptions: Subscription = new Subscription();
  
  // Валидация телефона: регулярное выражение для российских номеров
  phonePattern = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    // Инициализация реактивной формы
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]],
      rememberMe: [false]
    });
  }
  
  ngOnInit(): void {
    // Загрузка курсов для template-driven формы
    this.subscriptions.add(
      this.courseService.getAllCourses().subscribe(courses => {
        this.courses = courses;
      })
    );
    
    // Подписка на изменения формы для демонстрации
    this.loginForm.valueChanges.subscribe(value => {
      console.log('📝 Реактивная форма изменена:', value);
    });
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  // ========== Геттеры для удобного доступа к полям формы (реактивная форма) ==========
  
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }
  
  // ========== Методы для реактивной формы ==========
  
  /**
   * Валидация email (дополнительная кастомная валидация)
   */
  validateEmail(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;
    
    // Проверка на допустимые домены
    const allowedDomains = ['gmail.com', 'yandex.ru', 'mail.ru', 'inbox.ru', 'list.ru', 'bk.ru'];
    const domain = email.split('@')[1];
    
    if (domain && !allowedDomains.some(d => domain === d) && !domain.includes('.')) {
      return { invalidDomain: true };
    }
    return null;
  }
  
  /**
   * Обработка отправки реактивной формы
   */
  onLoginSubmit(): void {
    this.loginSubmitted = true;
    this.loginSuccess = false;
    
    if (this.loginForm.valid) {
      console.log('✅ Реактивная форма отправлена:', this.loginForm.value);
      this.loginSuccess = true;
      
      // Имитация отправки на сервер
      setTimeout(() => {
        this.loginSuccess = false;
        this.loginSubmitted = false;
        this.loginForm.reset({ email: '', password: '', rememberMe: false });
      }, 3000);
    } else {
      console.log('❌ Ошибка валидации реактивной формы');
      this.markFormGroupTouched(this.loginForm);
    }
  }
  
  /**
   * Вспомогательный метод для отметки всех полей как touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // ========== Методы для template-driven формы ==========
  
  /**
   * Валидация телефона
   */
  validatePhone(phone: string): boolean {
    if (!phone) return false;
    return this.phonePattern.test(phone);
  }
  
  /**
   * Валидация возраста
   */
  validateAge(age: number): boolean {
    return age !== null && age >= 14 && age <= 100;
  }
  
  /**
   * Валидация даты (не в будущем)
   */
  validateDate(date: string): boolean {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  }
  
  /**
   * Обработка отправки template-driven формы
   */
  onRegistrationSubmit(form: any): void {
    this.registrationSubmitted = true;
    this.registrationSuccess = false;
    
    if (form.valid && this.validatePhone(this.registrationModel.phone) && 
        this.validateAge(this.registrationModel.age!) && 
        this.validateDate(this.registrationModel.birthDate)) {
      
      console.log('✅ Template-driven форма отправлена:', this.registrationModel);
      this.registrationSuccess = true;
      
      // Имитация отправки на сервер
      setTimeout(() => {
        this.registrationSuccess = false;
        this.registrationSubmitted = false;
        this.resetRegistrationForm();
      }, 3000);
    } else {
      console.log('❌ Ошибка валидации template-driven формы');
    }
  }
  
  /**
   * Сброс template-driven формы
   */
  resetRegistrationForm(): void {
    this.registrationModel = {
      email: '',
      fullName: '',
      phone: '',
      birthDate: '',
      age: null,
      courseId: null,
      agreeToTerms: false
    };
  }
  
  /**
   * Получение сообщений об ошибках для реактивной формы
   */
  getLoginErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) return '';
    
    const errors = control.errors;
    
    if (errors['required']) return 'Это поле обязательно';
    if (errors['email']) return 'Введите корректный email';
    if (errors['minlength']) return `Минимальная длина: ${errors['minlength'].requiredLength} символов`;
    if (errors['maxlength']) return `Максимальная длина: ${errors['maxlength'].requiredLength} символов`;
    if (errors['invalidDomain']) return 'Используйте допустимый домен (gmail.com, yandex.ru, mail.ru)';
    
    return 'Некорректное значение';
  }
  
  /**
   * Получение сообщений об ошибках для template-driven формы
   */
  getRegistrationErrorMessage(field: string, form: any): string {
    const control = form.controls[field];
    
    if (!control || !control.touched) return '';
    
    if (control.errors?.['required']) return 'Это поле обязательно';
    
    switch(field) {
      case 'email':
        if (control.errors?.['email']) return 'Введите корректный email';
        if (control.errors?.['maxlength']) return 'Email не должен превышать 100 символов';
        break;
      case 'fullName':
        if (control.errors?.['minlength']) return 'ФИО должно содержать минимум 3 символа';
        if (control.errors?.['maxlength']) return 'ФИО не должно превышать 100 символов';
        break;
      case 'phone':
        if (!this.validatePhone(this.registrationModel.phone)) return 'Введите корректный номер телефона';
        break;
      case 'age':
        if (this.registrationModel.age && !this.validateAge(this.registrationModel.age)) {
          return 'Возраст должен быть от 14 до 100 лет';
        }
        break;
      case 'birthDate':
        if (!this.validateDate(this.registrationModel.birthDate)) return 'Дата не может быть в будущем';
        break;
    }
    
    return '';
  }
  
  /**
   * Проверка валидности формы
   */
  isRegistrationFormValid(form: any): boolean {
    return form.valid && 
           this.validatePhone(this.registrationModel.phone) && 
           this.validateAge(this.registrationModel.age!) && 
           this.validateDate(this.registrationModel.birthDate) &&
           this.registrationModel.agreeToTerms;
  }

  /**
 * Получение силы пароля (0-100)
 */
getPasswordStrength(): number {
  const password = this.password?.value || '';
  if (!password) return 0;
  
  let strength = 0;
  
  // Длина
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 10;
  
  // Наличие цифр
  if (/\d/.test(password)) strength += 20;
  
  // Наличие букв в разных регистрах
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  
  // Наличие спецсимволов
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
  
  return Math.min(100, strength);
}

/**
 * Получение текстового описания силы пароля
 */
getPasswordStrengthText(): string {
  const strength = this.getPasswordStrength();
  
  if (strength === 0) return '';
  if (strength < 30) return 'Слабый пароль';
  if (strength < 60) return 'Средний пароль';
  if (strength < 80) return 'Хороший пароль';
  return 'Отличный пароль!';
}
}