import { Component, OnInit } from '@angular/core';
import { Project, ProjectStatus } from '@app/models';
import {
  selectAllProjectsSorted,
  selectOnHoldProjectsSorted,
  selectOpenProjectsSorted,
  State,
} from '@app/store';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProjectEditorComponent } from '../project-editor/project-editor.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  display: ProjectStatus | 'all';
  allProjects$: Observable<Array<Project>>;
  openProjects$: Observable<Array<Project>>;
  holdProjects$: Observable<Array<Project>>;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.display = 'Open';
    this.allProjects$ = this.store.select(selectAllProjectsSorted);
    this.openProjects$ = this.store.select(selectOpenProjectsSorted);
    this.holdProjects$ = this.store.select(selectOnHoldProjectsSorted);
  }

  async add() {
    const modal = await this.modalController.create({
      component: ProjectEditorComponent,
    });
    modal.present();
  }
}
