import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectEditorModule } from '../project-editor/project-editor.module';
import { ProjectListPageRoutingModule } from './project-list-routing.module';
import { ProjectListPage } from './project-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectEditorModule,
    ProjectListPageRoutingModule,
  ],
  declarations: [ProjectListPage],
})
export class ProjectListPageModule {}
