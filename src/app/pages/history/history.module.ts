import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HistoryPage } from './history.page';
import { TimerListItemComponentModule } from '@app/shared/timer-list-item/timer-list-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: HistoryPage }]),
    TimerListItemComponentModule
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}
