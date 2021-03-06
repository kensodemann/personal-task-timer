import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CustomerTaskSummaryComponent } from './customer-task-summary.component';
import { HoursPipeModule } from '../hours/hours.module';
import { InfoItemComponentModule } from '../info-item/info-item.module';

@NgModule({
  declarations: [CustomerTaskSummaryComponent],
  exports: [CustomerTaskSummaryComponent],
  imports: [
    CommonModule,
    IonicModule,
    HoursPipeModule,
    InfoItemComponentModule,
  ],
})
export class CustomerTaskSummaryModule {}
