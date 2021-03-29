import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectEditorComponent } from './project-editor.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ProjectEditorComponent],
  exports: [ProjectEditorComponent],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ProjectEditorModule {}
