import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingStars',
  standalone: true
})
export class RatingStarsPipe implements PipeTransform {
  
  transform(rating: number, maxStars: number = 5): string {
    if (!rating) return '☆☆☆☆☆';
    
    const fullStars = Math.floor(rating);
    const emptyStars = maxStars - fullStars;
    
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }
}