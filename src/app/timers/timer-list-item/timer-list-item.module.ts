import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TimerEditorComponentModule } from '../timer-editor/timer-editor.module';
import { TimerListItemComponent } from './timer-list-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TimerEditorComponentModule],
  declarations: [TimerListItemComponent],
  entryComponents: [TimerListItemComponent],
  exports: [TimerListItemComponent],
})
export class TimerListItemComponentModule {}
