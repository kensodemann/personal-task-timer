import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';

import { CustomerPickerComponent } from './customer-picker.component';
import { CustomerState } from '@app/store/reducers/customer/customer.reducer';
import { createOverlayControllerMock } from '@test/mocks';

describe('CustomerPickerComponent', () => {
  let component: CustomerPickerComponent;
  let fixture: ComponentFixture<CustomerPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPickerComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ModalController, useFactory: () => createOverlayControllerMock() },
        provideMockStore<{ customers: CustomerState }>({
          initialState: { customers: { customers: ['Ace Software', 'Butts Fixtures', 'Jim and John'] } }
        })
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CustomerPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selects all customers', () => {
    let customers: Array<string>;
    component.customers$.subscribe(c => (customers = c));
    expect(customers).toEqual(['Ace Software', 'Butts Fixtures', 'Jim and John']);
  });

  describe('dismiss', () => {
    it('dismisses the dialog', () => {
      const modalController = TestBed.get(ModalController);
      component.dismiss();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('dismisses with the cancel role and no data', () => {
      const modalController = TestBed.get(ModalController);
      component.dismiss();
      expect(modalController.dismiss).toHaveBeenCalledWith(undefined, 'cancel');
    });
  });

  describe('select', () => {
    it('dismisses the dialog', () => {
      const modalController = TestBed.get(ModalController);
      component.select('Ace Software');
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('dismisses with the select role and the customer name', () => {
      const modalController = TestBed.get(ModalController);
      component.select('Ace Software');
      expect(modalController.dismiss).toHaveBeenCalledWith('Ace Software', 'select');
    });
  });
});
