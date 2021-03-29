import { Component, OnInit } from '@angular/core';
import { Project } from '@app/models';
import { selectAllProjectsSorted, State } from '@app/store';
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
  projects$: Observable<Array<Project>>;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.projects$ = this.store.select(selectAllProjectsSorted);
  }

  async add() {
    const modal = await this.modalController.create({
      component: ProjectEditorComponent,
    });
    modal.present();
  }
}
