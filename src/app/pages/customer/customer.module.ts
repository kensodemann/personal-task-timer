import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPageRoutingModule } from './customer-routing.module';
import { CustomerTaskSummaryModule } from '@app/shared/customer-task-summary/customer-task-summary.module';

import { CustomerPage } from './customer.page';
import { InfoItemComponentModule } from '@app/shared/info-item/info-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerPageRoutingModule,
    CustomerTaskSummaryModule,
    InfoItemComponentModule,
  ],
  declarations: [CustomerPage],
})
export class CustomerPageModule {}
