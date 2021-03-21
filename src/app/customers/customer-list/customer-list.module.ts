import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerEditorComponentModule } from '../customer-editor/customer-editor.module';
import { CustomerListPageRoutingModule } from './customer-list-routing.module';
import { CustomerListPage } from './customer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerListPageRoutingModule,
    CustomerEditorComponentModule,
  ],
  declarations: [CustomerListPage],
})
export class CustomerListPageModule {}
