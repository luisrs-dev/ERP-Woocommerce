import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/isAuthenticated.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    data: { icon: 'dashboard' },
    //canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
      },
      {
        path: 'orders',
        title: 'Dashboard',
        data: { icon: 'analytics' },

        loadComponent: () =>
          import('./dashboard/pages/orders/orders.component'),
      },
      {
        path: 'transacciones',
        title: 'Transacciones',
        data: { icon: 'query_stats' },
        loadComponent: () =>
          import('./dashboard/pages/transactions/transactions.component'),
      },
      {
        path: 'auditoria',
        title: 'Auditoría',
        data: { icon: 'query_stats' },
        loadComponent: () =>
          import('./dashboard/pages/transactionLogs/transactionLogList/transactionLogList.component'),
      },
      {
        path: 'termino_transacciones',
        title: 'Motivo Terminos',
        data: { icon: 'align_horizontal_left' },
        loadComponent: () =>
          import('./dashboard/pages/summaryReasons/summaryReasons.component'),
      },
      {
        path: 'health-check',
        title: 'Health Check',
        data: { icon: 'health_and_safety' },
        loadComponent: () =>
          import('./dashboard/pages/healthCheck/healthCheck.component'),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.component'),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
