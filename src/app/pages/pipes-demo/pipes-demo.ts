import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Импортируем собственные пайпы (создадим их позже)
import { TruncatePipe } from '../pipes-demo/truncate.pipe';
import { PhoneFormatPipe } from '../pipes-demo/phone-format.pipe';
import { RatingStarsPipe } from '../pipes-demo/rating-stars.pipe';

@Component({
  selector: 'app-pipes-demo',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe, PhoneFormatPipe, RatingStarsPipe],
  templateUrl: './pipes-demo.html',
  styleUrls: ['./pipes-demo.scss']
})
export class PipesDemoComponent {
  
  // Данные для демонстрации разных типов
  price = 12500.5;           // денежный тип
  discount = 0.25;           // процент
  rating = 4.7;              // рейтинг
  isAvailable = true;        // булево значение
  productName = 'английский язык';  // строка для регистров
  createdAt = new Date();     // дата
  bigNumber = 1234567.89123;  // большое число
  description = 'Это очень длинное описание курса по английскому языку для начинающих, которое нужно обрезать'; // длинная строка
  
  // Массив товаров для демонстрации в таблице
  products = [
    { name: 'Курс английского', price: 15000, discount: 0.2, rating: 4.8, available: true, date: new Date(2024, 0, 15), phone: '+79161234567' },
    { name: 'Разговорный клуб', price: 18000, discount: 0, rating: 4.9, available: true, date: new Date(2024, 1, 20), phone: '84951234567' },
    { name: 'Подготовка к IELTS', price: 25000, discount: 0.15, rating: 4.9, available: false, date: new Date(2024, 1, 10), phone: '89501234567' }
  ];
}