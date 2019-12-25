import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimerListItemComponent } from './timer-list-item.component';
import { TimerEditorComponentModule } from '../timer-editor/timer-editor.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TimerEditorComponentModule],
  declarations: [TimerListItemComponent],
  entryComponents: [TimerListItemComponent],
  exports: [TimerListItemComponent]
})
export class TimerListItemComponentModule {}
