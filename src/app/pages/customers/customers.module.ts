import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';

import { CustomersPage } from './customers.page';
import { CustomerEditorComponentModule } from '@app/shared/customer-editor/customer-editor.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomersPageRoutingModule,
    CustomerEditorComponentModule,
  ],
  declarations: [CustomersPage],
})
export class CustomersPageModule {}
