import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HoursPipeModule } from '@app/common/hours/hours.module';
import { InfoItemComponentModule } from '@app/common/info-item/info-item.module';
import { IonicModule } from '@ionic/angular';
import { CustomerTaskSummaryComponent } from './customer-task-summary.component';

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
