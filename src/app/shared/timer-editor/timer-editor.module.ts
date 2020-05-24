import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimerEditorComponent } from './timer-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [TimerEditorComponent],
  entryComponents: [TimerEditorComponent],
  exports: [TimerEditorComponent]
})
export class TimerEditorComponentModule {}
