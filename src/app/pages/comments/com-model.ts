export interface Comment {
  id: number;
  author: string;
  text: string;
  date: Date;
  likes: number;
  isEdited: boolean;
  authorColor: string;
  authorLevel: 'beginner' | 'intermediate' | 'advanced';
}