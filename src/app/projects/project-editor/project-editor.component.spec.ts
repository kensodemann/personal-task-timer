import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Customer } from '@app/models';
import { addProject, updateProject } from '@app/store/actions';
import { CustomersState } from '@app/store/customer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { click } from '@test/util';
import { ProjectEditorComponent } from './project-editor.component';

describe('ProjectEditorComponent', () => {
  let component: ProjectEditorComponent;
  let modal: any;
  let fixture: ComponentFixture<ProjectEditorComponent>;

  let testCustomers: Dictionary<Customer>;
  let testCustomerIds: Array<string>;

  beforeEach(
    waitForAsync(() => {
      initializeTestData();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [ProjectEditorComponent],
        imports: [FormsModule, IonicModule],
        providers: [
          provideMockStore<{
            customers: CustomersState;
          }>({
            initialState: {
              customers: {
                ids: testCustomerIds,
                entities: testCustomers,
                loading: false,
              },
            },
          }),
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProjectEditorComponent);
      component = fixture.componentInstance;
    }),
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    describe('without a specified project', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('subscribes to the active customers', () => {
        let customers: Array<Customer>;
        component.customers$.subscribe(t => (customers = t));
        expect(customers).toEqual([
          {
            id: 'asdf1234',
            name: 'Ace Hardware',
            hasAdvisory: true,
            supportHours: 10,
            isActive: true,
          },
          {
            id: 'ff898gd',
            name: 'Fred Salvage',
            hasAdvisory: true,
            supportHours: 4,
            isActive: true,
          },
          {
            id: '1849gasdf',
            name: 'Mc Donalds',
            hasAdvisory: true,
            supportHours: 24,
            isActive: true,
          },
        ]);
      });

      it('sets the editor title', () => {
        const title = fixture.debugElement.query(By.css('ion-title'));
        expect(title.nativeElement.textContent).toContain('Create Project');
      });
    });

    describe('with a specified project', () => {
      beforeEach(() => {
        component.project = {
          id: '40049503950',
          customerId: testCustomers.asdf1234.id,
          customerName: testCustomers.asdf1234.name,
          name: 'Upgrade Review',
          description:
            'The cusomer want to go from v1 to v6 with very little time and effort',
          type: 'Consulting',
          status: 'On Hold',
          dueDate: '2021-12-23',
        };
        fixture.detectChanges();
      });

      it('subscribes to the active customers', () => {
        let customers: Array<Customer>;
        component.customers$.subscribe(t => (customers = t));
        expect(customers).toEqual([
          {
            id: 'asdf1234',
            name: 'Ace Hardware',
            hasAdvisory: true,
            supportHours: 10,
            isActive: true,
          },
          {
            id: 'ff898gd',
            name: 'Fred Salvage',
            hasAdvisory: true,
            supportHours: 4,
            isActive: true,
          },
          {
            id: '1849gasdf',
            name: 'Mc Donalds',
            hasAdvisory: true,
            supportHours: 24,
            isActive: true,
          },
        ]);
      });

      it('sets the editor title', () => {
        const title = fixture.debugElement.query(By.css('ion-title'));
        expect(title.nativeElement.textContent).toContain('Update Project');
      });

      it('sets the customer ID', () => {
        expect(component.customerId).toEqual(testCustomers.asdf1234.id);
      });

      it('sets the name', () => {
        expect(component.name).toEqual('Upgrade Review');
      });

      it('sets the description', () => {
        expect(component.description).toEqual(
          'The cusomer want to go from v1 to v6 with very little time and effort',
        );
      });

      it('sets the task type', () => {
        expect(component.taskType).toEqual('Consulting');
      });

      it('sets the status', () => {
        expect(component.status).toEqual('On Hold');
      });

      it('sets the due date', () => {
        expect(component.dueDate).toEqual('2021-12-23');
      });
    });
  });

  describe('close button', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('dismisses the modal', () => {
      const modalController = TestBed.inject(ModalController);
      const btn = fixture.debugElement.query(
        By.css('[data-testid="close-button"]'),
      );
      click(btn.nativeElement);
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save button', () => {
    describe('for create', () => {
      let btn: DebugElement;
      beforeEach(() => {
        fixture.detectChanges();
        btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.customerId = testCustomers.ff898gd.id;
        component.name = 'Do the thing';
        component.description = 'There are things that need doing, do them';
        component.taskType = 'Consulting';
        component.dueDate = '2021-06-01';
        component.status = 'Open';
        click(btn.nativeElement);
        fixture.detectChanges();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff898gd.id;
        component.name = 'Do the thing';
        component.description = 'There are things that need doing, do them';
        component.taskType = 'Consulting';
        component.dueDate = '2021-06-01';
        component.status = 'Open';
        click(btn.nativeElement);
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          addProject({
            project: {
              customerName: testCustomers.ff898gd.name,
              customerId: testCustomers.ff898gd.id,
              name: 'Do the thing',
              description: 'There are things that need doing, do them',
              type: 'Consulting',
              status: 'Open',
              dueDate: '2021-06-01',
            },
          }),
        );
        (store.dispatch as any).mockRestore();
      });

      it('defaults the status to open', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff898gd.id;
        component.name = 'Do the thing';
        component.description = 'There are things that need doing, do them';
        component.taskType = 'Consulting';
        component.dueDate = '2021-06-01';
        click(btn.nativeElement);
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          addProject({
            project: {
              customerName: testCustomers.ff898gd.name,
              customerId: testCustomers.ff898gd.id,
              name: 'Do the thing',
              description: 'There are things that need doing, do them',
              type: 'Consulting',
              status: 'Open',
              dueDate: '2021-06-01',
            },
          }),
        );
        (store.dispatch as any).mockRestore();
      });
    });

    describe('for update', () => {
      let btn: DebugElement;
      beforeEach(() => {
        component.project = {
          id: '40049503950',
          customerName: testCustomers.ff88t99er.name,
          customerId: testCustomers.ff88t99er.id,
          name: 'Whatever',
          description: 'This project is so apathetic',
          type: 'Code Review',
          status: 'On Hold',
          dueDate: '2021-12-29',
        };
        btn = fixture.debugElement.query(By.css('[data-testid="save-button"]'));
        fixture.detectChanges();
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.customerId = testCustomers.ff898gd.id;
        click(btn.nativeElement);
        fixture.detectChanges();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff898gd.id;
        component.name = 'Love and joy';
        component.description = 'God loves you and so do I';
        component.taskType = 'Consulting';
        component.dueDate = '2021-04-12';
        component.status = 'Open';
        click(btn.nativeElement);
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          updateProject({
            project: {
              id: '40049503950',
              customerName: testCustomers.ff898gd.name,
              customerId: testCustomers.ff898gd.id,
              name: 'Love and joy',
              description: 'God loves you and so do I',
              type: 'Consulting',
              status: 'Open',
              dueDate: '2021-04-12',
            },
          }),
        );
        (store.dispatch as any).mockRestore();
      });
    });
  });

  const initializeTestData = () => {
    testCustomerIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf'];
    testCustomers = {
      'asdf1234': {
        id: 'asdf1234',
        name: 'Ace Hardware',
        hasAdvisory: true,
        supportHours: 10,
        isActive: true,
      },
      'ff898gd': {
        id: 'ff898gd',
        name: 'Fred Salvage',
        hasAdvisory: true,
        supportHours: 4,
        isActive: true,
      },
      'ff88t99er': {
        id: 'ff88t99er',
        name: 'Wal-Mart',
        hasAdvisory: false,
        supportHours: 14,
        isActive: false,
      },
      '1849gasdf': {
        id: '1849gasdf',
        name: 'Mc Donalds',
        hasAdvisory: true,
        supportHours: 24,
        isActive: true,
      },
    };
  };
});
