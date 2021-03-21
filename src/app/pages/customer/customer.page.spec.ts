import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Customer } from '@app/models';
import { CustomerEditorComponent } from '@app/shared/customer-editor/customer-editor.component';
import { CustomerTaskSummaryModule } from '@app/shared/customer-task-summary/customer-task-summary.module';
import { InfoItemComponentModule } from '@app/shared/info-item/info-item.module';
import { CustomersState } from '@app/store/customer/reducer';
import { TaskTypeState } from '@app/store/task-type/reducer';
import { TimersState } from '@app/store/timer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Dictionary } from '@ngrx/entity';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createActivatedRouteMock,
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { CustomerPage } from './customer.page';

describe('CustomerPage', () => {
  let component: CustomerPage;
  let fixture: ComponentFixture<CustomerPage>;

  let modal: any;
  let testCustomers: Dictionary<Customer>;
  let testCustomerIds: Array<string>;

  beforeEach(
    waitForAsync(() => {
      initializeTestData();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [CustomerPage],
        imports: [
          IonicModule,
          RouterTestingModule,
          CustomerTaskSummaryModule,
          InfoItemComponentModule,
        ],
        providers: [
          provideMockStore<{
            customers: CustomersState;
            taskTypes: TaskTypeState;
            timers: TimersState;
          }>({
            initialState: {
              customers: {
                ids: testCustomerIds,
                entities: testCustomers,
                loading: false,
              },
              timers: { ids: [], entities: {}, loading: false },
              taskTypes: {
                taskTypes: [
                  'Code Review',
                  'Architecture Review',
                  'Consulting',
                  'Bug',
                ],
              },
            },
          }),
          { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CustomerPage);
      component = fixture.componentInstance;
    }),
  );

  it('creates', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('obtains the customer ID from the route', () => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap.get as any).mockReturnValue('4399503');
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveReturnedTimes(1);
    expect(component.customerId).toEqual('4399503');
  });

  it('obtains the task types', () => {
    let taskTypes;
    fixture.detectChanges();
    component.taskTypes$.subscribe(t => (taskTypes = t));
    expect(taskTypes).toEqual([
      'Code Review',
      'Architecture Review',
      'Consulting',
      'Bug',
    ]);
  });

  it('obtains the customer data', () => {
    let customer: Customer;
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap.get as any).mockReturnValue('ff898gd');
    fixture.detectChanges();
    component.customer$.subscribe(c => (customer = c));
    expect(customer.name).toEqual('Fred Salvage');
  });

  describe('edit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('displays the editor', async () => {
      const modalController = TestBed.inject(ModalController);
      await component.edit(testCustomers.ff898gd);
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: CustomerEditorComponent,
        componentProps: {
          customer: testCustomers.ff898gd,
        },
        backdropDismiss: false,
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  const initializeTestData = () => {
    testCustomerIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf'];
    testCustomers = {
      'asdf1234': {
        id: 'asdf1234',
        name: 'Ace Hardware',
        hasAdvisory: false,
        supportHours: 12,
      },
      'ff898gd': {
        id: 'ff898gd',
        name: 'Fred Salvage',
        hasAdvisory: true,
        primaryAdvisor: 'Tom Jones',
        supportHours: 40,
      },
      'ff88t99er': {
        id: 'ff88t99er',
        name: 'Wal-Mart',
        hasAdvisory: false,
        supportHours: 12,
      },
      '1849gasdf': {
        id: '1849gasdf',
        name: 'Mc Donalds',
        hasAdvisory: true,
        primaryAdvisor: 'Jim Jones',
        supportHours: 34,
      },
    };
  };
});
