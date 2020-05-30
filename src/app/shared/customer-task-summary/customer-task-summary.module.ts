import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CustomerTaskSummaryComponent } from './customer-task-summary.component';

@NgModule({
  declarations: [CustomerTaskSummaryComponent],
  exports: [CustomerTaskSummaryComponent],
  imports: [CommonModule, IonicModule]
})
export class CustomerTaskSummaryModule {}
