import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'today',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/today/today.module').then(m => m.TodayPageModule)
          }
        ]
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/history/history.module').then(m => m.HistoryPageModule)
          }
        ]
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/customers/customers.module').then(m => m.CustomersPageModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/about/about.module').then(m => m.AboutPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/today',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/today',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
