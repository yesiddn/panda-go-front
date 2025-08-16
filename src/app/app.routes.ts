import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './modules/shared/components/layout/layout';

export const routes: Routes = [
  {
    path: 'app',
    component: Layout,
    children: [
      {
        path: 'login',
        component: Login
      }
    ]
  }
];
