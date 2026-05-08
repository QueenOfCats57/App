import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Для template-driven формы
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms'; // Для реактивной формы
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forms-demo.html',
  styleUrls: ['./forms-demo.scss']
})
export class FormsDemoComponent {
  
  // ========== 1. TEMPLATE-DRIVEN ФОРМА (Авторизация - через ngModule) ==========
  loginModel = {
    email: '',
    password: '',
    rememberMe: false
  };
  loginSubmitted = false;
  loginSuccess = false;
  
  // ========== 2. REACTIVE ФОРМА (Регистрация - FormControl/FormBuilder) ==========
  registrationForm: FormGroup;
  registrationSubmitted = false;
  registrationSuccess = false;
  
  // Валидация телефона (регулярное выражение)
  phonePattern = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  
  constructor(private fb: FormBuilder) {
    // Реактивная форма для регистрации
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      birthDate: ['', [Validators.required, this.futureDateValidator]],
      age: [null, [Validators.required, Validators.min(14), Validators.max(100)]],
      courseId: [null],
      agreeToTerms: [false, [Validators.requiredTrue]]
    });
  }
  
  // Кастомный валидатор: дата не может быть в будущем
  futureDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today ? null : { futureDate: true };
  }
  
  // ========== Методы для template-driven формы (авторизация) ==========
  onLoginSubmit(form: any): void {
    this.loginSubmitted = true;
    
    if (form.valid) {
      console.log('✅ Template-driven форма отправлена:', this.loginModel);
      this.loginSuccess = true;
      setTimeout(() => {
        this.loginSuccess = false;
        this.loginSubmitted = false;
        this.loginModel = { email: '', password: '', rememberMe: false };
        form.resetForm();
      }, 3000);
    }
  }
  
  // ========== Методы для реактивной формы (регистрация) ==========
  onRegistrationSubmit(): void {
    this.registrationSubmitted = true;
    
    if (this.registrationForm.valid) {
      console.log('✅ Реактивная форма отправлена:', this.registrationForm.value);
      this.registrationSuccess = true;
      setTimeout(() => {
        this.registrationSuccess = false;
        this.registrationSubmitted = false;
        this.registrationForm.reset();
      }, 3000);
    }
  }
  
  // Геттеры для удобного доступа к полям реактивной формы
  get regEmail() { return this.registrationForm.get('email'); }
  get regFullName() { return this.registrationForm.get('fullName'); }
  get regPhone() { return this.registrationForm.get('phone'); }
  get regBirthDate() { return this.registrationForm.get('birthDate'); }
  get regAge() { return this.registrationForm.get('age'); }
  get regAgreeToTerms() { return this.registrationForm.get('agreeToTerms'); }
  
  // Получение сообщений об ошибках для реактивной формы
  getRegistrationErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    
    const errors = control.errors;
    
    if (errors['required']) return 'Это поле обязательно';
    if (errors['email']) return 'Введите корректный email';
    if (errors['minlength']) return `Минимум ${errors['minlength'].requiredLength} символов`;
    if (errors['maxlength']) return `Максимум ${errors['maxlength'].requiredLength} символов`;
    if (errors['min']) return `Минимальное значение: ${errors['min'].min}`;
    if (errors['max']) return `Максимальное значение: ${errors['max'].max}`;
    if (errors['pattern']) return 'Введите корректный номер телефона';
    if (errors['futureDate']) return 'Дата не может быть в будущем';
    if (errors['requiredTrue']) return 'Необходимо согласие на обработку данных';
    
    return 'Некорректное значение';
  }
}