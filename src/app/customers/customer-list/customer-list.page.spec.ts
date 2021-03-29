import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Customer } from '@app/models';
import {
  selectActiveCustomersSorted,
  selectAllCustomersSorted,
  State,
} from '@app/store';
import { CustomersState } from '@app/store/customer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { click } from '@test/util';
import { CustomerEditorComponent } from '../customer-editor/customer-editor.component';
import { CustomerListPage } from './customer-list.page';

describe('CustomerListPage', () => {
  let component: CustomerListPage;
  let fixture: ComponentFixture<CustomerListPage>;
  let modal: any;
  let customers: Array<Customer>;

  beforeEach(
    waitForAsync(() => {
      initializeTestData();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [CustomerListPage],
        imports: [FormsModule, IonicModule, RouterTestingModule],
        providers: [
          provideMockStore<{ customers: CustomersState }>({
            initialState: {
              customers: { ids: [], entities: null, loading: false },
            },
          }),
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CustomerListPage);
      component = fixture.componentInstance;
      const store = TestBed.inject(Store) as MockStore<State>;
      store.overrideSelector(selectAllCustomersSorted, customers);
      store.overrideSelector(
        selectActiveCustomersSorted,
        customers.filter(customer => customer.isActive),
      );
      store.refreshState();
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('list', () => {
    it('displays active customers by default', () => {
      const activeCustomers = customers.filter(c => c.isActive);
      const customerItems = fixture.debugElement.queryAll(
        By.css('[data-testid="customer-item"]'),
      );
      expect(customerItems.length).toBe(activeCustomers.length);
      customerItems.forEach((c, i) =>
        expect(c.nativeElement.textContent).toContain(activeCustomers[i].name),
      );
    });

    it('displays all customers for the "all" display mode', () => {
      component.display = 'all';
      fixture.detectChanges();
      const customerItems = fixture.debugElement.queryAll(
        By.css('[data-testid="customer-item"]'),
      );
      expect(customerItems.length).toBe(5);
      customerItems.forEach((c, i) =>
        expect(c.nativeElement.textContent).toContain(customers[i].name),
      );
    });
  });

  describe('add', () => {
    it('displays the editor', async () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="add-customer-button"]'),
      );
      const modalController = TestBed.inject(ModalController);
      click(btn.nativeElement);
      fixture.detectChanges();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: CustomerEditorComponent,
        backdropDismiss: false,
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  const initializeTestData = () => {
    customers = [
      {
        id: 'f8r8200394',
        name: 'Butts and Nutts',
        hasAdvisory: true,
        primaryAdvisor: 'Fred Flintstone',
        supportHours: 48,
        isActive: false,
      },
      {
        id: 'dd93492034',
        name: 'Faux Firs',
        hasAdvisory: true,
        primaryAdvisor: 'Ken Sodemann',
        supportHours: 19,
        isActive: true,
      },
      {
        id: 'ff898gd',
        name: 'Pot Barn',
        hasAdvisory: true,
        primaryAdvisor: 'Bob Smith',
        supportHours: 420,
        isActive: false,
      },
      {
        id: 'ff88t99er',
        name: 'Whigs and Things',
        hasAdvisory: false,
        primaryAdvisor: null,
        supportHours: 0,
        isActive: true,
      },
      {
        id: 'dif9950349j',
        name: 'The Land of Make Believe',
        hasAdvisory: true,
        primaryAdvisor: 'Fred Rogers',
        supportHours: 18,
        isActive: true,
      },
    ];
  };
});
