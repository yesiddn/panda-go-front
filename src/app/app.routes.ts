import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import LandingPage from './pages/landing/landing';
import { Layout } from './modules/shared/components/layout/layout';
import { redirectGuard } from './guards/redirect-guard';
import { authGuard } from './guards/auth-guard';
import { Register } from './pages/register/register';
import { RegisterCompany } from './pages/register-company/register-company';
import DashboardPage from './pages/dashboard/dashboard';
import { RoutesComponent } from './pages/routes/routes';

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
      },
      {
        path: 'register-company',
        component: RegisterCompany
      }
    ]
  },
  {
    path: 'app',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardPage
      },
      {
        path: 'routes',
        component: RoutesComponent
      },
      {
        path: 'routes/create',
        loadComponent: () => import('./pages/routes/create-route').then(m => m.CreateRouteComponent)
      },
      {
        path: 'routes/detail/:id',
        loadComponent: () => import('./pages/routes/route-detail/route-detail').then(m => m.RouteDetail)
      },
      {
        path: 'routes/request/:id',
        loadComponent: () => import('./pages/colletion-requests/complete-request/complete-request').then(m => m.CompleteRequest)
      }
    ]
  }
];
