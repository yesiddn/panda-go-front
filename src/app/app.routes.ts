import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import LandingPage from './pages/landing/landing';
import { Layout } from './modules/shared/components/layout/layout';
import { redirectGuard } from './guards/redirect-guard';
import { authGuard } from './guards/auth-guard';
import { Register } from './pages/register/register';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    pathMatch: 'full'
  },
  {
    path: '',
    component: Layout,
    canActivate: [redirectGuard],
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      }
    ]
  },
  {
    path: 'app',
    component: Layout,
    canActivate: [authGuard],
    children: []
  }
];
