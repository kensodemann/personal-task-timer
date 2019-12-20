import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPickerComponent } from './customer-picker.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [CustomerPickerComponent],
  entryComponents: [CustomerPickerComponent],
  exports: [CustomerPickerComponent]
})
export class CustomerPickerComponentModule {}
