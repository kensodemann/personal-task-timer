import { Component, Input, OnInit } from '@angular/core';
import { Customer, Project, ProjectStatus } from '@app/models';
import {
  addProject,
  selectActiveCustomersSorted,
  selectAllTaskTypes,
  selectCustomer,
  State,
  updateProject,
} from '@app/store';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent implements OnInit {
  @Input() customerId: string;
  @Input() project: Project;

  customers$: Observable<Array<Customer>>;
  taskTypes$: Observable<Array<string>>;
  editorTitle: string;

  name: string;
  description: string;
  taskType: string;
  status: ProjectStatus;
  dueDate: string;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    if (this.project) {
      this.initializeUpdate();
    } else {
      this.initializeCreate();
    }
    this.customers$ = this.store.pipe(select(selectActiveCustomersSorted));
    this.taskTypes$ = this.store.pipe(select(selectAllTaskTypes));
  }

  close() {
    this.modalController.dismiss();
  }

  save() {
    this.createProject().subscribe(project => {
      if (this.project) {
        this.store.dispatch(updateProject({ project }));
      } else {
        this.store.dispatch(addProject({ project }));
      }
      this.modalController.dismiss();
    });
  }

  private initializeCreate() {
    this.editorTitle = 'Create Project';
    this.status = 'Open';
  }

  private initializeUpdate() {
    this.editorTitle = 'Update Project';
    this.customerId = this.project.customerId;
    this.name = this.project.name;
    this.description = this.project.description;
    this.taskType = this.project.type;
    this.dueDate = this.project.dueDate;
    this.status = this.project.status;
  }

  private createProject(): Observable<Project> {
    return this.store.pipe(
      select(selectCustomer, { customerId: this.customerId }),
      take(1),
      map(customer => {
        const project: Project = {
          customerName: customer.name,
          customerId: customer.id,
          name: this.name,
          description: this.description,
          type: this.taskType,
          status: this.status,
          dueDate: this.dueDate.substring(0, 10),
        };

        if (this.project && this.project.id) {
          project.id = this.project.id;
        }

        return project;
      }),
    );
  }
}
