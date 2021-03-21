import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomerEditorComponent } from '@app/shared/customer-editor/customer-editor.component';
import { logout } from '@app/store/actions';
import { CustomersState } from '@app/store/customer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { CustomersPage } from './customers.page';

describe('CustomersPage', () => {
  let component: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;
  let modal: any;

  beforeEach(
    waitForAsync(() => {
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [CustomersPage],
        imports: [IonicModule, RouterTestingModule],
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

      fixture = TestBed.createComponent(CustomersPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }),
  );

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
        backdropDismiss: false,
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
