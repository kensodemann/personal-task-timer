import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfoItemComponentModule } from '@app/common/info-item/info-item.module';
import { IonicModule } from '@ionic/angular';
import { CustomerEditorComponentModule } from '../customer-editor/customer-editor.module';
import { CustomerTaskSummaryModule } from '../customer-task-summary/customer-task-summary.module';
import { CustomerPageRoutingModule } from './customer-routing.module';
import { CustomerPage } from './customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerEditorComponentModule,
    CustomerPageRoutingModule,
    CustomerTaskSummaryModule,
    InfoItemComponentModule,
  ],
  declarations: [CustomerPage],
})
export class CustomerPageModule {}
