import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimerListItemComponent } from './timer-list-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [TimerListItemComponent],
  entryComponents: [TimerListItemComponent],
  exports: [TimerListItemComponent]
})
export class TimerListItemComponentModule {}
