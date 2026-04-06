import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentChatComponent } from '../../pages/comments/comments';
import { CourseService } from '../../services/course.service';
import { Comment } from '../../pages/comments/com-model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CommentChatComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  chatBgColor: string = '#ffffff';
  totalCourses: number = 0;
  activeStudents: number = 0;
  averageRating: number = 0;
  
  private subscriptions: Subscription = new Subscription();
  
  constructor(private courseService: CourseService) {}
  
  ngOnInit(): void {
    // Получение статистики из сервиса для отображения на главной странице
    this.subscriptions.add(
      this.courseService.getStatistics().subscribe(stats => {
        this.totalCourses = stats.totalCourses;
        this.activeStudents = stats.totalStudents;
        this.averageRating = stats.averageRating;
        console.log('📊 Главная страница: статистика обновлена', stats);
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCommentAdded(comment: Comment) {
    console.log('Новый комментарий на главной:', comment);
    // Здесь можно добавить логику, например, отправку на сервер
  }

  onTitleChange(newTitle: string) {
    console.log('Заголовок чата изменен:', newTitle);
  }
}