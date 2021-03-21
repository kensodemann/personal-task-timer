import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TimerEditorComponentModule } from '../timer-editor/timer-editor.module';
import { TimerListItemComponentModule } from '../timer-list-item/timer-list-item.module';
import { TodayPage } from './today.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TodayPage }]),
    TimerEditorComponentModule,
    TimerListItemComponentModule,
  ],
  declarations: [TodayPage],
})
export class TodayPageModule {}
