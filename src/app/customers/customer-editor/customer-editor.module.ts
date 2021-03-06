import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerEditorComponent } from './customer-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [CustomerEditorComponent],
  entryComponents: [CustomerEditorComponent],
  exports: [CustomerEditorComponent],
})
export class CustomerEditorComponentModule {}
