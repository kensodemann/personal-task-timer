import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
      imports: [IonicModule],
      providers: [
        provideMockStore<{
          customers: CustomersState;
        }>({
          initialState: {
            customers: { ids: [], entities: {}, loading: false }
          }
        }),
        { provide: ModalController, useFactory: () => createOverlayControllerMock('ModalController') }
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
        expect(component.name).toBeFalsy();
      });
    });

    describe('with a specified customer', () => {
      beforeEach(() => {
        component.customer = {
          id: '40049503950',
          name: 'We do Stuff'
        };
        fixture.detectChanges();
      });

      it('sets the editor title', () => {
        expect(component.editorTitle).toEqual('Update Customer');
      });

      it('initializes the name', () => {
        expect(component.name).toEqual('We do Stuff');
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
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          create({
            customer: {
              name: 'Fred Flintstone'
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
          name: 'Fred Flintstone'
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
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          update({
            customer: {
              id: '40049503950',
              name: 'Spacely Sprockets'
            }
          })
        );
        (store.dispatch as any).mockRestore();
      });
    });
  });
});
