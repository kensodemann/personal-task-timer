import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TimerListItemComponentModule } from '../timer-list-item/timer-list-item.module';
import { HistoryPage } from './history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: HistoryPage }]),
    TimerListItemComponentModule,
  ],
  declarations: [HistoryPage],
})
export class HistoryPageModule {}
