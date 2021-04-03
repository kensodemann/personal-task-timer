import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimerEditorComponentModule } from '@app/timers/timer-editor/timer-editor.module';
import { IonicModule } from '@ionic/angular';
import { ProjectEditorComponentModule } from '../project-editor/project-editor.module';
import { ProjectListItemComponent } from './project-list-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectEditorComponentModule,
    TimerEditorComponentModule,
  ],
  declarations: [ProjectListItemComponent],
  entryComponents: [ProjectListItemComponent],
  exports: [ProjectListItemComponent],
})
export class ProjectListItemComponentModule {}
