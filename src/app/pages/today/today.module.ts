import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TodayPage } from './today.page';
import { TimerListItemComponentModule } from '@app/shared/timer-list-item/timer-list-item.module';
import { TimerEditorComponentModule } from '@app/shared/timer-editor/timer-editor.module';

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
