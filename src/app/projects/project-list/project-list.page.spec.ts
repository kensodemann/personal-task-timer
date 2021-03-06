import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Project } from '@app/models';
import {
  selectAllProjectsSorted,
  selectOnHoldProjectsSorted,
  selectOpenProjectsSorted,
  State,
} from '@app/store';
import { ProjectsState } from '@app/store/project/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { click } from '@test/util';
import { ProjectEditorComponent } from '../project-editor/project-editor.component';
import { ProjectEditorComponentModule } from '../project-editor/project-editor.module';
import { ProjectListItemComponentModule } from '../project-list-item/project-list-item.module';

import { ProjectListPage } from './project-list.page';

describe('ProjectListPage', () => {
  let component: ProjectListPage;
  let fixture: ComponentFixture<ProjectListPage>;
  let modal: any;
  let projects: Array<Project>;

  beforeEach(
    waitForAsync(() => {
      initializeTestData();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [ProjectListPage],
        imports: [
          FormsModule,
          IonicModule,
          ProjectEditorComponentModule,
          ProjectListItemComponentModule,
        ],
        providers: [
          provideMockStore<{ projects: ProjectsState }>({
            initialState: {
              projects: { ids: [], entities: null, loading: false },
            },
          }),
          {
            provide: ModalController,
            useValue: createOverlayControllerMock(modal),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProjectListPage);
      component = fixture.componentInstance;
      const store = TestBed.inject(Store) as MockStore<State>;
      store.overrideSelector(selectAllProjectsSorted, projects);
      store.overrideSelector(
        selectOpenProjectsSorted,
        projects.filter(p => p.status === 'Open'),
      );
      store.overrideSelector(
        selectOnHoldProjectsSorted,
        projects.filter(p => p.status === 'On Hold'),
      );
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the open projects by default', () => {
    const items = fixture.debugElement.queryAll(By.css('ion-item'));
    const expected = projects.filter(project => project.status === 'Open');
    expect(items.length).toBe(expected.length);
    expected.forEach((project, idx) =>
      expect(items[idx].nativeElement.textContent).toContain(project.name),
    );
  });

  it('displays all the projects when display is "all"', () => {
    component.display = 'all';
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('ion-item'));
    expect(items.length).toBe(projects.length);
    projects.forEach((project, idx) =>
      expect(items[idx].nativeElement.textContent).toContain(project.name),
    );
  });

  it('displays on hold projects when display is "On Hold"', () => {
    component.display = 'On Hold';
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('ion-item'));
    const expected = projects.filter(project => project.status === 'On Hold');
    expect(items.length).toBe(expected.length);
    expected.forEach((project, idx) =>
      expect(items[idx].nativeElement.textContent).toContain(project.name),
    );
  });

  describe('adding a project', () => {
    let btn: DebugElement;
    beforeEach(() => {
      btn = fixture.debugElement.query(
        By.css('[data-testid="add-project-button"]'),
      );
      fixture.detectChanges();
    });

    it('creates the project editor modal', () => {
      const modalController = TestBed.inject(ModalController);
      click(btn.nativeElement);
      fixture.detectChanges();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: ProjectEditorComponent,
      });
    });

    it('presents the modal', () => {
      click(btn.nativeElement);
      fixture.detectChanges();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  const initializeTestData = () => {
    projects = [
      {
        id: 'd84663477583i',
        name: 'Fittings',
        description: 'Fit the whigs on the things.',
        type: 'Consulting',
        status: 'Closed',
        dueDate: '2021-03-20',
        customerId: 'ff88t99er',
        customerName: 'Whigs and Things',
      },
      {
        id: 'c138845d883sj',
        name: 'Design',
        description: 'We need a 420 design',
        type: 'Consulting',
        status: 'Open',
        dueDate: '2021-04-20',
        customerId: 'ff898gd',
        customerName: 'Pot Barn',
      },
      {
        id: 'a993409f9930',
        name: 'Migration Review',
        description:
          'Have a look at their migration path and tell them they are doing it wrong.',
        type: 'Code Review',
        status: 'Open',
        dueDate: '2021-06-13',
        customerId: 'f8r8200394',
        customerName: 'Butts and Nutts',
      },
      {
        id: 'b938847298jdjjf3',
        name: 'Powder',
        description: 'The whigs all need to be powdered, review the plan.',
        type: 'Architecture Review',
        status: 'On Hold',
        dueDate: '2021-07-10',
        customerId: 'ff88t99er',
        customerName: 'Whigs and Things',
      },
      {
        id: 'e477fiie8832',
        name: 'Review Review',
        description: 'Review the review of the review that we reviewed.',
        type: 'Code Review',
        status: 'Open',
        dueDate: '2021-08-07',
        customerId: 'f8r8200394',
        customerName: 'Butts and Nutts',
      },
    ];
  };
});
