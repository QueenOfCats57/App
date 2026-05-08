import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CourseList } from './pages/course-list/course-list';
import { About } from './pages/about/about';
import { Contacts } from './pages/contacts/contacts';
import { NotFound } from './pages/not-found/not-found';
import { FormsDemoComponent } from './pages/forms-demo/forms-demo';
import { ApiCrudComponent } from './pages/api-crud/api-crud';
import { PipesDemoComponent } from './pages/pipes-demo/pipes-demo';
import { DirectivesDemoComponent } from './pages/directives-demo/directives-demo';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'courses', component: CourseList },
    { path: 'about', component: About },
    { path: 'contacts', component: Contacts },
    { path: 'forms', component: FormsDemoComponent }, 
    { path: 'api-crud', component: ApiCrudComponent },
    { path: 'pipes-demo', component: PipesDemoComponent },
    { path: 'directives-demo', component: DirectivesDemoComponent },
    { path: '404', component: NotFound },
    { path: '**', redirectTo: '/404' }
];