import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomersState } from '@app/store/customer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { CustomerEditorComponent } from '../customer-editor/customer-editor.component';
import { CustomerListPage } from './customer-list.page';

describe('CustomerListPage', () => {
  let component: CustomerListPage;
  let fixture: ComponentFixture<CustomerListPage>;
  let modal: any;

  beforeEach(
    waitForAsync(() => {
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [CustomerListPage],
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

      fixture = TestBed.createComponent(CustomerListPage);
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
});
