import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../pages/comments/com-model';

@Component({
  selector: 'app-comment-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrls: ['./comments.scss']
})
export class CommentChatComponent implements OnInit {
  // 1. Привязка свойства элемента DOM к значению компонента (односторонняя)
  @Input() title: string = 'Обсуждение курсов';
  @Input() maxComments: number = 50;
  
  // 2. Output для двусторонней связи с родительским компонентом
  @Output() commentAdded = new EventEmitter<Comment>();
  @Output() titleChange = new EventEmitter<string>();

  // 3. Двусторонняя привязка (через комбинацию Input/Output)
  @Input() chatBackgroundColor: string = '#ffffff';
  @Output() chatBackgroundColorChange = new EventEmitter<string>();

  // Данные для комментариев
  comments: Comment[] = [];
  
  // 4. Привязка метода компонента к событию в DOM
  newCommentText: string = '';
  newCommentAuthor: string = 'Гость';
  
  // 5. Привязка к атрибуту HTML (будет использоваться в шаблоне)
  textareaPlaceholder: string = 'Напишите ваш комментарий...';
  textareaMaxLength: number = 500;
  
  // 6. Привязка к классу CSS (будет использоваться в шаблоне)
  isChatExpanded: boolean = true;
  commentSortOrder: 'newest' | 'oldest' | 'popular' = 'newest';
  
  // 7. Привязка к стилю (будет использоваться в шаблоне)
  headerFontSize: number = 24;
  chatOpacity: number = 1;
  
  // Статистика для демонстрации привязок
  totalComments: number = 0;
  totalLikes: number = 0;
  
  // Доступные уровни для выбора
  authorLevels = [
    { value: 'beginner', label: 'Начинающий' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];
  
  // Цвета для авторов
  authorColors = [
    '#f8bbd0', // светло-розовый
    '#c8e6c9', // светло-зеленый
    '#ffe0b2', // персиковый
    '#b3e5fc', // голубой
    '#e1bee7'  // сиреневый
  ];

  ngOnInit() {
    // Добавляем несколько тестовых комментариев
    this.addTestComments();
    this.updateStats();
  }

  // Метод для добавления тестовых комментариев
  private addTestComments() {
    const testComments: Comment[] = [
      {
        id: 1,
        author: 'Анна',
        text: 'Отличный курс для начинающих! Очень понятные объяснения.',
        date: new Date('2024-02-10T10:30:00'),
        likes: 15,
        isEdited: false,
        authorColor: '#f8bbd0',
        authorLevel: 'beginner'
      },
      {
        id: 2,
        author: 'Марк',
        text: 'Разговорный клуб супер! За 3 месяца начал свободно общаться.',
        date: new Date('2024-02-11T15:45:00'),
        likes: 23,
        isEdited: true,
        authorColor: '#c8e6c9',
        authorLevel: 'intermediate'
      },
      {
        id: 3,
        author: 'Елена',
        text: 'Подготовка к IELTS на высшем уровне. Сдала на 7.5!',
        date: new Date('2024-02-12T09:15:00'),
        likes: 31,
        isEdited: false,
        authorColor: '#ffe0b2',
        authorLevel: 'advanced'
      }
    ];
    
    this.comments = [...testComments];
  }

  // 8. Привязка метода компонента к событию в DOM
  addComment() {
    if (this.newCommentText.trim() && this.newCommentAuthor.trim()) {
      const newComment: Comment = {
        id: this.comments.length + 1,
        author: this.newCommentAuthor,
        text: this.newCommentText,
        date: new Date(),
        likes: 0,
        isEdited: false,
        authorColor: this.getRandomColor(),
        authorLevel: 'beginner'
      };
      
      this.comments = [newComment, ...this.comments];
      
      // Ограничиваем количество комментариев
      if (this.comments.length > this.maxComments) {
        this.comments = this.comments.slice(0, this.maxComments);
      }
      
      // 9. Генерация события для родительского компонента
      this.commentAdded.emit(newComment);
      
      // Очищаем поле ввода
      this.newCommentText = '';
      
      // Обновляем статистику
      this.updateStats();
    }
  }

  // Метод для лайка комментария
  likeComment(comment: Comment) {
    comment.likes++;
    this.updateStats();
  }

  // Метод для удаления комментария
  deleteComment(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
    this.updateStats();
  }

  // Обновление статистики
  private updateStats() {
    this.totalComments = this.comments.length;
    this.totalLikes = this.comments.reduce((sum, c) => sum + c.likes, 0);
  }

  // Получение случайного цвета
  private getRandomColor(): string {
    return this.authorColors[Math.floor(Math.random() * this.authorColors.length)];
  }

  // 10. Метод для демонстрации различных привязок
  toggleChatExpand() {
    this.isChatExpanded = !this.isChatExpanded;
  }

  changeHeaderSize(delta: number) {
    this.headerFontSize = Math.max(16, Math.min(36, this.headerFontSize + delta));
  }

  changeOpacity(delta: number) {
    this.chatOpacity = Math.max(0.5, Math.min(1, this.chatOpacity + delta));
  }

  // Методы для сортировки комментариев
  sortComments(order: 'newest' | 'oldest' | 'popular') {
    this.commentSortOrder = order;
    
    switch(order) {
      case 'newest':
        this.comments.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        this.comments.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'popular':
        this.comments.sort((a, b) => b.likes - a.likes);
        break;
    }
  }

  // Метод для изменения заголовка (демонстрация двусторонней привязки)
  updateTitle(newTitle: string) {
    this.title = newTitle;
    this.titleChange.emit(newTitle);
  }
}