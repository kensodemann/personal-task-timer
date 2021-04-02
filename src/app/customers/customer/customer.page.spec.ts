import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Customer } from '@app/models';
import { InfoItemComponentModule } from '@app/common/info-item/info-item.module';
import { CustomersState } from '@app/store/customer/reducer';
import { TimersState } from '@app/store/timer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Dictionary } from '@ngrx/entity';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createActivatedRouteMock,
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { CustomerEditorComponent } from '../customer-editor/customer-editor.component';
import { CustomerTaskSummaryModule } from '../customer-task-summary/customer-task-summary.module';
import { CustomerPage } from './customer.page';
import { By } from '@angular/platform-browser';
import { TimerEditorComponent } from '@app/timers/timer-editor/timer-editor.component';
import { click } from '@test/util';

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
            timers: TimersState;
          }>({
            initialState: {
              customers: {
                ids: testCustomerIds,
                entities: testCustomers,
                loading: false,
              },
              timers: { ids: [], entities: {}, loading: false },
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

  describe('for an active customer', () => {
    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as any).mockReturnValue('ff898gd');
      fixture.detectChanges();
    });

    it('displays the name', () => {
      const name = fixture.debugElement.query(
        By.css('[data-testid="customer-name"]'),
      );
      expect(name.nativeElement.textContent).toContain(
        testCustomers.ff898gd.name,
      );
    });

    it('does not display "Inactive"', () => {
      const tag = fixture.debugElement.query(
        By.css('[data-testid="inactive-tag"]'),
      );
      expect(tag).toBeFalsy();
    });

    it('has an edit button', () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="edit-customer-button"]'),
      );
      expect(btn).toBeTruthy();
    });

    it('has an add timer button', () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="add-timer-button"]'),
      );
      expect(btn).toBeTruthy();
    });
  });

  describe('for an inactive customer', () => {
    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as any).mockReturnValue('ff88t99er');
      fixture.detectChanges();
    });

    it('displays the name', () => {
      const name = fixture.debugElement.query(
        By.css('[data-testid="customer-name"]'),
      );
      expect(name.nativeElement.textContent).toContain(
        testCustomers.ff88t99er.name,
      );
    });

    it('displays "Inactive"', () => {
      const tag = fixture.debugElement.query(
        By.css('[data-testid="inactive-tag"]'),
      );
      expect(tag).toBeTruthy();
    });

    it('has an edit button', () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="edit-customer-button"]'),
      );
      expect(btn).toBeTruthy();
    });

    it('does not have an add timer button', () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="add-timer-button"]'),
      );
      expect(btn).toBeFalsy();
    });
  });

  describe('edit', () => {
    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as any).mockReturnValue('ff898gd');
      fixture.detectChanges();
    });

    it('displays the customer editor', async () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="edit-customer-button"]'),
      );
      const modalController = TestBed.inject(ModalController);
      click(btn.nativeElement);
      fixture.detectChanges();
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

  describe('add timer', () => {
    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as any).mockReturnValue('ff898gd');
      fixture.detectChanges();
    });

    it('displays the customer editor', async () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="add-timer-button"]'),
      );
      const modalController = TestBed.inject(ModalController);
      click(btn.nativeElement);
      fixture.detectChanges();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TimerEditorComponent,
        componentProps: {
          customerId: testCustomers.ff898gd.id,
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
        isActive: true,
      },
      'ff898gd': {
        id: 'ff898gd',
        name: 'Fred Salvage',
        hasAdvisory: true,
        primaryAdvisor: 'Tom Jones',
        supportHours: 40,
        isActive: true,
      },
      'ff88t99er': {
        id: 'ff88t99er',
        name: 'Wal-Mart',
        hasAdvisory: false,
        supportHours: 12,
        isActive: false,
      },
      '1849gasdf': {
        id: '1849gasdf',
        name: 'Mc Donalds',
        hasAdvisory: true,
        primaryAdvisor: 'Jim Jones',
        supportHours: 34,
        isActive: true,
      },
    };
  };
});
