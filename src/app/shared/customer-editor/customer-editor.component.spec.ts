import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';

import { CustomerEditorComponent } from './customer-editor.component';
import { createOverlayControllerMock } from '@test/mocks';
import { CustomersState } from '@app/store/reducers/customer/customer.reducer';
import { Store } from '@ngrx/store';
import { create, update } from '@app/store/actions/customer.actions';

describe('CustomerEditorComponent', () => {
  let component: CustomerEditorComponent;
  let fixture: ComponentFixture<CustomerEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        provideMockStore<{
          customers: CustomersState;
        }>({
          initialState: {
            customers: { ids: [], entities: {}, loading: false }
          }
        }),
        { provide: ModalController, useFactory: () => createOverlayControllerMock() }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerEditorComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    describe('without a specified customer', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('sets the editor title', () => {
        expect(component.editorTitle).toEqual('Create Customer');
      });

      it('starts with a blank name', () => {
        expect(component.name).toEqual('');
      });

      it('starts with zero hours', () => {
        expect(component.supportHours).toEqual(0);
      });

      it('assumes advisory', () => {
        expect(component.hasAdvisory).toEqual(true);
      });

      it('starts with a blank advisor', () => {
        expect(component.primaryAdvisor).toEqual('');
      });

      it('assumes no Stencil', () => {
        expect(component.hasStencil).toEqual(false);
      });

      it('assumes no Capacitor', () => {
        expect(component.hasCapacitor).toEqual(false);
      });

      it('assumes no Identity Vault', () => {
        expect(component.hasIdentityVault).toEqual(false);
      });

      it('assumes no Auth Connect', () => {
        expect(component.hasAuthConnect).toEqual(false);
      });

      it('assumes no Offline Storage', () => {
        expect(component.hasOfflineStorage).toEqual(false);
      });
    });

    describe('with a specified customer', () => {
      beforeEach(() => {
        component.customer = {
          id: '40049503950',
          name: 'We do Stuff',
          hasAdvisory: true,
          primaryAdvisor: 'Joe Anderson',
          hasStencil: false,
          supportHours: 42,
          hasCapacitor: true,
          hasIdentityVault: true,
          hasAuthConnect: false,
          hasOfflineStorage: true
        };
        fixture.detectChanges();
      });

      it('sets the editor title', () => {
        expect(component.editorTitle).toEqual('Update Customer');
      });

      it('initializes the name', () => {
        expect(component.name).toEqual('We do Stuff');
      });

      it('initializes the advisory flag', () => {
        expect(component.hasAdvisory).toEqual(true);
      });

      it('initializes the advisor', () => {
        expect(component.primaryAdvisor).toEqual('Joe Anderson');
      });

      it('initializes the support hours', () => {
        expect(component.supportHours).toEqual(42);
      });

      it('initializes the Stencil flag', () => {
        expect(component.hasStencil).toEqual(false);
      });

      it('initializes the Capacitor flag', () => {
        expect(component.hasCapacitor).toEqual(true);
      });

      it('initializes the identity vault flag', () => {
        expect(component.hasIdentityVault).toEqual(true);
      });

      it('initializes the auth connect flag', () => {
        expect(component.hasAuthConnect).toEqual(false);
      });

      it('initializes the offline storage flag', () => {
        expect(component.hasOfflineStorage).toEqual(true);
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
        component.name = 'Fred Flintstone';
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('dispatches a create action', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.name = 'Fred Flintstone';
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        (store.dispatch as any).mockRestore();
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.name = 'Fred Flintstone';
        component.hasAdvisory = true;
        component.primaryAdvisor = 'Sarah Trelles';
        component.hasAuthConnect = false;
        component.hasCapacitor = true;
        component.hasIdentityVault = false;
        component.hasStencil = false;
        component.hasOfflineStorage = true;
        component.supportHours = 16;
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          create({
            customer: {
              name: 'Fred Flintstone',
              hasAdvisory: true,
              primaryAdvisor: 'Sarah Trelles',
              hasStencil: false,
              hasAuthConnect: false,
              hasCapacitor: true,
              hasIdentityVault: false,
              hasOfflineStorage: true,
              supportHours: 16
            }
          })
        );
        (store.dispatch as any).mockRestore();
      });

      it('clears the primary advisor if there is no advisory', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.name = 'Fred Flintstone';
        component.hasAdvisory = false;
        component.primaryAdvisor = 'Sarah Trelles';
        component.hasAuthConnect = false;
        component.hasStencil = false;
        component.hasCapacitor = true;
        component.hasIdentityVault = false;
        component.hasOfflineStorage = true;
        component.supportHours = 16;
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          create({
            customer: {
              name: 'Fred Flintstone',
              hasAdvisory: false,
              primaryAdvisor: null,
              hasStencil: false,
              hasAuthConnect: false,
              hasCapacitor: true,
              hasIdentityVault: false,
              hasOfflineStorage: true,
              supportHours: 16
            }
          })
        );
        (store.dispatch as any).mockRestore();
      });
    });

    describe('for update', () => {
      beforeEach(() => {
        component.customer = {
          id: '40049503950',
          name: 'Fred Flintstone',
          hasAdvisory: true,
          primaryAdvisor: 'Joe James',
          hasStencil: false,
          hasCapacitor: true,
          hasIdentityVault: false,
          hasAuthConnect: false,
          hasOfflineStorage: true,
          supportHours: 42
        };
        fixture.detectChanges();
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.name = 'Spacely Sprockets';
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('dispatches an update action', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.name = 'Spacely Sprockets';
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        (store.dispatch as any).mockRestore();
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.name = 'Spacely Sprockets';
        component.hasIdentityVault = true;
        component.hasAuthConnect = true;
        component.hasOfflineStorage = false;
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          update({
            customer: {
              id: '40049503950',
              name: 'Spacely Sprockets',
              hasAdvisory: true,
              primaryAdvisor: 'Joe James',
              hasStencil: false,
              hasCapacitor: true,
              hasIdentityVault: true,
              hasAuthConnect: true,
              hasOfflineStorage: false,
              supportHours: 42
            }
          })
        );
        (store.dispatch as any).mockRestore();
      });

      it('passes false for undefined boolean flags', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.hasAdvisory = undefined;
        component.hasAuthConnect = undefined;
        component.hasCapacitor = undefined;
        component.hasIdentityVault = undefined;
        component.hasOfflineStorage = undefined;
        component.hasStencil = undefined;
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          update({
            customer: {
              id: '40049503950',
              name: 'Fred Flintstone',
              hasAdvisory: false,
              primaryAdvisor: null,
              hasStencil: false,
              hasCapacitor: false,
              hasIdentityVault: false,
              hasAuthConnect: false,
              hasOfflineStorage: false,
              supportHours: 42
            }
          })
        );
        (store.dispatch as any).mockRestore();
      });

      it('clears the primary advisor if there is not advisory', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.name = 'Spacely Sprockets';
        component.hasAdvisory = false;
        component.supportHours = 18;
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          update({
            customer: {
              id: '40049503950',
              name: 'Spacely Sprockets',
              hasAdvisory: false,
              primaryAdvisor: null,
              hasStencil: false,
              hasCapacitor: true,
              hasIdentityVault: false,
              hasAuthConnect: false,
              hasOfflineStorage: true,
              supportHours: 18
            }
          })
        );
        (store.dispatch as any).mockRestore();
      });
    });
  });
});
