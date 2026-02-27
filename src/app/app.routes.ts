import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CourseList } from './pages/course-list/course-list';
import { About } from './pages/about/about';
import { Contacts } from './pages/contacts/contacts';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'courses', component: CourseList },
    { path: 'about', component: About },
    { path: 'contacts', component: Contacts },
    { path: '**', component: NotFound }
];