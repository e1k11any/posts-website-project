import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list';
import { PostDetailComponent } from './components/post-detail/post-detail';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { loginGuard } from './guards/login-guard';
import { PostFormComponent } from './components/post-form/post-form';
import { authGuard } from './guards/auth-guard';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, // PROTECTED ROUTE

  { path: 'post/add', component: PostFormComponent, canActivate: [authGuard] }, // PROTECTED
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'post/edit/:id', component: PostFormComponent, canActivate: [authGuard] }, // PROTECTED

  { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, // PROTECTED
  { path: 'register', component: RegisterComponent, canActivate: [loginGuard] }, // PROTECTED
];
