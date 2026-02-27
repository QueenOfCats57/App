import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommentChatComponent } from '../../pages/comments/comments';
import { Comment } from '../../pages/comments/com-model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CommentChatComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  chatBgColor: string = '#ffffff';

  onCommentAdded(comment: Comment) {
    console.log('Новый комментарий:', comment);
    // Здесь можно добавить логику, например, отправку на сервер
  }

  onTitleChange(newTitle: string) {
    console.log('Заголовок изменен:', newTitle);
  }
}