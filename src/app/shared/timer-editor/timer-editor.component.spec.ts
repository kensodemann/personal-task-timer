import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Customer } from '@app/models';
import { addTimer, updateTimer } from '@app/store/actions';
import { CustomersState } from '@app/store/reducers/customer/customer.reducer';
import { TaskTypeState } from '@app/store/reducers/task-type/task-type.reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { TimerEditorComponent } from './timer-editor.component';

describe('TimerEditorComponent', () => {
  let component: TimerEditorComponent;
  let modal: any;
  let fixture: ComponentFixture<TimerEditorComponent>;

  let testCustomers: Dictionary<Customer>;
  let testCustomerIds: Array<string>;

  beforeEach(
    waitForAsync(() => {
      initializeTestData();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [TimerEditorComponent],
        imports: [FormsModule, IonicModule],
        providers: [
          provideMockStore<{
            customers: CustomersState;
            taskTypes: TaskTypeState;
          }>({
            initialState: {
              customers: {
                ids: testCustomerIds,
                entities: testCustomers,
                loading: false,
              },
              taskTypes: {
                taskTypes: [
                  'Architecture Review',
                  'Code Review',
                  'Working Session',
                ],
              },
            },
          }),
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TimerEditorComponent);
      component = fixture.componentInstance;
    }),
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    describe('without a specified timer', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('subscribes to the task types', () => {
        let taskTypes: Array<string>;
        component.taskTypes$.subscribe(t => (taskTypes = t));
        expect(taskTypes).toEqual([
          'Architecture Review',
          'Code Review',
          'Working Session',
        ]);
      });

      it('subscribes to the customers', () => {
        let customers: Array<Customer>;
        component.customers$.subscribe(t => (customers = t));
        expect(customers).toEqual([
          {
            id: 'asdf1234',
            name: 'Ace Hardware',
            hasAdvisory: true,
            supportHours: 10,
          },
          {
            id: 'ff898gd',
            name: 'Fred Salvage',
            hasAdvisory: true,
            supportHours: 4,
          },
          {
            id: '1849gasdf',
            name: 'Mc Donalds',
            hasAdvisory: true,
            supportHours: 24,
          },
          {
            id: 'ff88t99er',
            name: 'Wal-Mart',
            hasAdvisory: false,
            supportHours: 14,
          },
        ]);
      });

      it('sets the editor title', () => {
        expect(component.editorTitle).toEqual('Create Timer');
      });

      it('sets the minutes to zero', () => {
        expect(component.minutes).toEqual(0);
      });

      it('enable minute editing', () => {
        expect(component.disableMinutes).toEqual(false);
      });
    });

    describe('with a specified timer', () => {
      beforeEach(() => {
        component.timer = {
          id: '40049503950',
          customerId: testCustomers.asdf1234.id,
          customerName: testCustomers.asdf1234.name,
          title: 'Stuff is not working',
          task: '239945',
          type: 'Consulting',
          date: '2019-12-23',
          minutes: 32,
        };
        fixture.detectChanges();
      });

      it('subscribes to the task types', () => {
        let taskTypes: Array<string>;
        component.taskTypes$.subscribe(t => (taskTypes = t));
        expect(taskTypes).toEqual([
          'Architecture Review',
          'Code Review',
          'Working Session',
        ]);
      });

      it('subscribes to the customers', () => {
        let customers: Array<Customer>;
        component.customers$.subscribe(t => (customers = t));
        expect(customers).toEqual([
          {
            id: 'asdf1234',
            name: 'Ace Hardware',
            hasAdvisory: true,
            supportHours: 10,
          },
          {
            id: 'ff898gd',
            name: 'Fred Salvage',
            hasAdvisory: true,
            supportHours: 4,
          },
          {
            id: '1849gasdf',
            name: 'Mc Donalds',
            hasAdvisory: true,
            supportHours: 24,
          },
          {
            id: 'ff88t99er',
            name: 'Wal-Mart',
            hasAdvisory: false,
            supportHours: 14,
          },
        ]);
      });

      it('enable minute editing', () => {
        expect(component.disableMinutes).toEqual(false);
      });

      it('sets the editor title', () => {
        expect(component.editorTitle).toEqual('Update Timer');
      });

      it('sets the customer ID', () => {
        expect(component.customerId).toEqual(testCustomers.asdf1234.id);
      });

      it('sets the title', () => {
        expect(component.title).toEqual('Stuff is not working');
      });

      it('sets the task ID', () => {
        expect(component.taskId).toEqual('239945');
      });

      it('sets the task type', () => {
        expect(component.taskType).toEqual('Consulting');
      });

      it('sets the minutes', () => {
        expect(component.minutes).toEqual(32);
      });
    });

    describe('with a running timer', () => {
      beforeEach(() => {
        component.timer = {
          id: '40049503950',
          customerId: testCustomers.asdf1234.id,
          customerName: testCustomers.asdf1234.name,
          title: 'Stuff is not working',
          task: '239945',
          type: 'Consulting',
          date: '2019-12-23',
          minutes: 32,
          startTime: 12341234,
        };
        fixture.detectChanges();
      });

      it('disables minute editing', () => {
        expect(component.disableMinutes).toEqual(true);
      });
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('dismisses the modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    describe('for create', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.customerId = testCustomers.ff898gd.id;
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('dispatches a create action', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff898gd.id;
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        (store.dispatch as any).mockRestore();
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff898gd.id;
        component.title = 'Stuff is not working';
        component.taskId = '239945';
        component.taskType = 'Consulting';
        component.minutes = 32;
        Date.now = jest.fn(() => 1577102400000);
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          addTimer({
            timer: {
              customerName: testCustomers.ff898gd.name,
              customerId: testCustomers.ff898gd.id,
              title: 'Stuff is not working',
              task: '239945',
              type: 'Consulting',
              date: '2019-12-23',
              minutes: 32,
              startTime: null,
            },
          }),
        );
        (store.dispatch as any).mockRestore();
        (Date.now as any).mockRestore();
      });

      it('sets the task to null if there is no taskId', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff88t99er.id;
        component.title = 'Stuff is not working';
        component.taskType = 'Consulting';
        component.minutes = 32;
        Date.now = jest.fn(() => 1577102400000);
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          addTimer({
            timer: {
              customerName: testCustomers.ff88t99er.name,
              customerId: testCustomers.ff88t99er.id,
              title: 'Stuff is not working',
              type: 'Consulting',
              date: '2019-12-23',
              minutes: 32,
              startTime: null,
              task: null,
            },
          }),
        );
        (store.dispatch as any).mockRestore();
        (Date.now as any).mockRestore();
      });
    });

    describe('for update', () => {
      beforeEach(() => {
        component.timer = {
          id: '40049503950',
          customerName: testCustomers.ff88t99er.name,
          customerId: testCustomers.ff88t99er.id,
          title: 'Whatever',
          task: '384953',
          type: 'Code Review',
          date: '2019-12-29',
          startTime: 189843123489,
          minutes: 14,
        };
        fixture.detectChanges();
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.customerId = testCustomers.ff898gd.id;
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('dispatches an update action', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff898gd.id;
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        (store.dispatch as any).mockRestore();
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customerId = testCustomers.ff898gd.id;
        component.title = 'Stuff is not working';
        component.taskId = '239945';
        component.taskId = '239945';
        component.taskType = 'Consulting';
        component.minutes = 32;
        Date.now = jest.fn(() => 1577102400000);
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          updateTimer({
            timer: {
              id: '40049503950',
              customerName: testCustomers.ff898gd.name,
              customerId: testCustomers.ff898gd.id,
              title: 'Stuff is not working',
              task: '239945',
              type: 'Consulting',
              date: '2019-12-29',
              startTime: 189843123489,
              minutes: 32,
            },
          }),
        );
        (store.dispatch as any).mockRestore();
        (Date.now as any).mockRestore();
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
      },
      'ff898gd': {
        id: 'ff898gd',
        name: 'Fred Salvage',
        hasAdvisory: true,
        supportHours: 4,
      },
      'ff88t99er': {
        id: 'ff88t99er',
        name: 'Wal-Mart',
        hasAdvisory: false,
        supportHours: 14,
      },
      '1849gasdf': {
        id: '1849gasdf',
        name: 'Mc Donalds',
        hasAdvisory: true,
        supportHours: 24,
      },
    };
  };
});
