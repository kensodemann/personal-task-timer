import { Component, Input } from '@angular/core';
import { Project } from '@app/models';
import { TimerEditorComponent } from '@app/timers/timer-editor/timer-editor.component';
import { ModalController } from '@ionic/angular';
import { ProjectEditorComponent } from '../project-editor/project-editor.component';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss'],
})
export class ProjectListItemComponent {
  @Input() project: Project;

  constructor(private modalController: ModalController) {}

  async edit() {
    const modal = await this.modalController.create({
      backdropDismiss: false,
      component: ProjectEditorComponent,
      componentProps: { project: this.project },
    });
    modal.present();
  }

  async createTimer() {
    const modal = await this.modalController.create({
      backdropDismiss: false,
      component: TimerEditorComponent,
      componentProps: {
        title: this.project.name,
        taskType: this.project.type,
        customerId: this.project.customerId,
      },
    });
    modal.present();
  }
}
