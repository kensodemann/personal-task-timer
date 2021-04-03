import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Project } from '@app/models';
import { TimerEditorComponent } from '@app/timers/timer-editor/timer-editor.component';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { click } from '@test/util';
import { ProjectEditorComponent } from '../project-editor/project-editor.component';

import { ProjectListItemComponent } from './project-list-item.component';

describe('ProjectListItemComponent', () => {
  let component: ProjectListItemComponent;
  let fixture: ComponentFixture<ProjectListItemComponent>;
  let modal: any;
  let project: Project;

  beforeEach(
    waitForAsync(() => {
      modal = createOverlayElementMock();
      project = {
        id: '39900v99d0w9',
        name: 'Test This',
        description: 'This is just a test project to test this this right here',
        type: 'Consulting',
        status: 'Open',
        dueDate: '2014-07-13',
        customerId: '3994fvkk30',
        customerName: 'Thor',
      };
      TestBed.configureTestingModule({
        declarations: [ProjectListItemComponent],
        imports: [IonicModule],
        providers: [
          {
            provide: ModalController,
            useValue: createOverlayControllerMock(modal),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProjectListItemComponent);
      component = fixture.componentInstance;
      component.project = project;
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on label click', () => {
    it('creates a project editor', () => {
      const modalController = TestBed.inject(ModalController);
      const label = fixture.debugElement.query(By.css('ion-label'));
      click(label.nativeElement);
      fixture.detectChanges();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: ProjectEditorComponent,
        componentProps: { project },
      });
    });

    it('present the project editor', () => {
      const label = fixture.debugElement.query(By.css('ion-label'));
      click(label.nativeElement);
      fixture.detectChanges();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('on timer button click', () => {
    it('creates a timer editor', () => {
      const modalController = TestBed.inject(ModalController);
      const btn = fixture.debugElement.query(By.css('ion-button'));
      click(btn.nativeElement);
      fixture.detectChanges();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: TimerEditorComponent,
        componentProps: {
          title: project.name,
          taskType: project.type,
          customerId: project.customerId,
        },
      });
    });

    it('present the project editor', () => {
      const btn = fixture.debugElement.query(By.css('ion-button'));
      click(btn.nativeElement);
      fixture.detectChanges();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });
});
