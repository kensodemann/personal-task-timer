import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'timer-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../timers/timer-list/timer-list.module').then(
                m => m.TimerListPageModule,
              ),
          },
        ],
      },
      {
        path: 'project-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../projects/project-list/project-list.module').then(
                m => m.ProjectListPageModule,
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
              import('../about/about.module').then(m => m.AboutPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/timer-list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/timer-list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
