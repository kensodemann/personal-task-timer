import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { CustomersPage } from './customers.page';
import { CustomersState } from '@app/store/reducers/customer/customer.reducer';
import { logout } from '@app/store/actions/auth.actions';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { CustomerEditorComponent } from '@app/shared/customer-editor/customer-editor.component';

describe('CustomersPage', () => {
  let component: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;
  let modal;

  beforeEach(async(() => {
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      imports: [IonicModule],
      providers: [
        provideMockStore<{ customers: CustomersState }>({
          initialState: { customers: { ids: [], entities: null, loading: false } }
        }),
        { provide: ModalController, useFactory: () => createOverlayControllerMock(modal) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add', () => {
    it('displays the editor', async () => {
      const modalController = TestBed.inject(ModalController);
      await component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: CustomerEditorComponent,
        backdropDismiss: false
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
