import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListPage } from './customer-list.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerListPage,
  },
  {
    path: 'customer',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../customer/customer.module').then(m => m.CustomerPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerListPageRoutingModule {}
