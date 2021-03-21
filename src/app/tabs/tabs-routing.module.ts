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
            loadChildren: () =>
              import('../timers/today/today.module').then(
                m => m.TodayPageModule,
              ),
          },
        ],
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../timers/history/history.module').then(
                m => m.HistoryPageModule,
              ),
          },
        ],
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../customers/customer-list/customer-list.module').then(
                m => m.CustomerListPageModule,
              ),
          },
        ],
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../about/about.module').then(
                m => m.AboutPageModule,
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/today',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/today',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
