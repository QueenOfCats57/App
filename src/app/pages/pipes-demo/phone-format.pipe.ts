import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  
  transform(value: string): string {
    if (!value) return '';
    
    // Удаляем все нецифровые символы
    const cleaned = value.replace(/\D/g, '');
    
    // Проверяем длину
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
      // +7 XXX XXX-XX-XX
      return `+7 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    } else if (cleaned.length === 10) {
      // XXX XXX-XX-XX
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}`;
    }
    
    return value;
  }
}