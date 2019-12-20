import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimerEditorComponent } from './timer-editor.component';
import { CustomerPickerComponentModule } from '../customer-picker/customer-picker.module';

@NgModule({
  imports: [CommonModule, CustomerPickerComponentModule, FormsModule, IonicModule],
  declarations: [TimerEditorComponent],
  entryComponents: [TimerEditorComponent],
  exports: [TimerEditorComponent]
})
export class TimerEditorComponentModule {}
