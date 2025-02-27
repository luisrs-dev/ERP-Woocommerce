import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/isAuthenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.component'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    data: { icon: 'dashboard' },
    //canActivate: [isAuthenticatedGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'productos',
      //   pathMatch: 'full'
      // },
      {
        path: 'productos',
        title: 'Pedidos',
        data: { icon: 'storefront' },

        loadComponent: () =>
          import('./dashboard/pages/products/products.component'),
      },
      {
        path: 'productos',
        title: 'Productos',
        data: { icon: 'inventory' },

        loadComponent: () =>
          import('./dashboard/pages/products/products.component'),
      },
      {
        path: 'productos',
        title: 'Finanzas',
        data: { icon: 'account_balance' },

        loadComponent: () =>
          import('./dashboard/pages/products/products.component'),
      },
      {
        path: 'producto/:id',
        title: 'Producto',
        data: { icon: 'user', child: true },
        loadComponent: () =>
          import('./dashboard/pages/products/product-detail/product-detail.component'),
      },
      // {
      //   path: 'transacciones',
      //   title: 'Transacciones',
      //   data: { icon: 'query_stats' },
      //   loadComponent: () =>
      //     import('./dashboard/pages/transactions/transactions.component'),
      // },
      // {
      //   path: 'auditoria',
      //   title: 'Auditoría',
      //   data: { icon: 'query_stats' },
      //   loadComponent: () =>
      //     import('./dashboard/pages/transactionLogs/transactionLogList/transactionLogList.component'),
      // },
      // {
      //   path: 'termino_transacciones',
      //   title: 'Motivo Terminos',
      //   data: { icon: 'align_horizontal_left' },
      //   loadComponent: () =>
      //     import('./dashboard/pages/summaryReasons/summaryReasons.component'),
      // },
      // {
      //   path: 'health-check',
      //   title: 'Health Check',
      //   data: { icon: 'health_and_safety' },
      //   loadComponent: () =>
      //     import('./dashboard/pages/healthCheck/healthCheck.component'),
      // },
    ],
  },

  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // },
];
