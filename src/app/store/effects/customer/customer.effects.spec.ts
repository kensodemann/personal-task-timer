import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Customer } from '@app/models';
import { CustomersService } from '@app/services/firestore-data';
import { createCustomersServiceMock } from '@app/services/firestore-data/mocks';
import {
  addCustomer,
  addCustomerFailure,
  addCustomerSuccess,
  customerAdded,
  customerModified,
  customerRemoved,
  customersAdded,
  removeCustomer,
  removeCustomerFailure,
  removeCustomerSuccess,
  startup,
  updateCustomer,
  updateCustomerFailure,
  updateCustomerSuccess,
} from '@app/store/actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CustomerEffects } from './customer.effects';

let actions$: Observable<any>;
let effects: CustomerEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      CustomerEffects,
      { provide: CustomersService, useFactory: createCustomersServiceMock },
      provideMockActions(() => actions$),
    ],
  });

  effects = TestBed.inject<CustomerEffects>(CustomerEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('changes$', () => {
  it('observes changes to the customers', () => {
    const customersService = TestBed.inject(CustomersService);
    actions$ = of(startup());
    effects.changes$.subscribe(() => {});
    expect(customersService.observeChanges).toHaveBeenCalledTimes(1);
  });

  describe('added change', () => {
    it('dispaches and added customer action', done => {
      const customersService = TestBed.inject(CustomersService);
      (customersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'I am a newly added customer',
                  hasAdvisory: true,
                  supportHours: 12,
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = customerAdded({
          customer: {
            id: '123499dfi',
            name: 'I am a newly added customer',
            hasAdvisory: true,
            supportHours: 12,
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('modified change', () => {
    it('dispaches and modified customer action', done => {
      const customersService = TestBed.inject(CustomersService);
      (customersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'modified',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'I am a modified customer',
                  hasAdvisory: false,
                  supportHours: 4,
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = customerModified({
          customer: {
            id: '123499dfi',
            name: 'I am a modified customer',
            hasAdvisory: false,
            supportHours: 4,
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('removed change', () => {
    it('dispaches and removed customer action', done => {
      const customersService = TestBed.inject(CustomersService);
      (customersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = customerRemoved({
          customer: {
            id: '123499dfi',
            name: 'I am a customer',
            hasAdvisory: true,
            supportHours: 12,
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('multiple changes', () => {
    it('dispaches the adds as a unit', fakeAsync(() => {
      const customersService = TestBed.inject(CustomersService);
      (customersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: 'f99g0e9fg',
                data: () => ({
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                }),
              },
            },
          },
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                }),
              },
            },
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fkkfig0939r',
                data: () => ({
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                }),
              },
            },
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fiig0939034',
                data: () => ({
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                }),
              },
            },
          },
          {
            type: 'modified',
            payload: {
              doc: {
                id: 'fi38849958392j',
                data: () => ({
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      let calls = 0;
      effects.changes$.subscribe(action => {
        let expected: Action;
        switch (calls) {
          case 0:
            expected = customerRemoved({
              customer: {
                id: '123499dfi',
                name: 'I am a customer',
                hasAdvisory: true,
                supportHours: 12,
              },
            });
            break;

          case 1:
            expected = customerModified({
              customer: {
                id: 'fi38849958392j',
                name: 'I am a customer',
                hasAdvisory: true,
                supportHours: 12,
              },
            });
            break;

          case 2:
            expected = customersAdded({
              customers: [
                {
                  id: 'f99g0e9fg',
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                },
                {
                  id: 'fkkfig0939r',
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                },
                {
                  id: 'fiig0939034',
                  name: 'I am a customer',
                  hasAdvisory: true,
                  supportHours: 12,
                },
              ],
            });
            break;

          default:
            break;
        }
        expect(action).toEqual(expected);
        calls++;
        tick();
      });
      expect(calls).toEqual(3);
    }));
  });

  it('does nothing for other actions', () => {
    const customersService = TestBed.inject(CustomersService);
    actions$ = of(updateCustomer({ customer: null }));
    effects.changes$.subscribe(() => {});
    expect(customersService.observeChanges).not.toHaveBeenCalled();
  });
});

describe('create$', () => {
  let customer: Customer;
  beforeEach(() => {
    customer = {
      id: 'fkkfig0939r',
      name: 'I am a customer',
      hasAdvisory: true,
      supportHours: 12,
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(CustomersService);
    actions$ = of(addCustomer({ customer }));
    effects.create$.subscribe(() => {});
    expect(service.add).toHaveBeenCalledTimes(1);
    expect(service.add).toHaveBeenCalledWith(customer);
  });

  it('dispatches create success', done => {
    const dispatched = addCustomerSuccess();
    actions$ = of(addCustomer({ customer }));
    effects.create$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches create errors', done => {
    const service = TestBed.inject(CustomersService);
    const dispatched = addCustomerFailure({
      error: new Error('The create failed'),
    });

    (service.add as any).mockRejectedValue(new Error('The create failed'));
    actions$ = of(addCustomer({ customer }));
    effects.create$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(CustomersService);
    actions$ = of(updateCustomer({ customer }));
    effects.create$.subscribe(() => {});
    expect(service.add).not.toHaveBeenCalled();
  });
});

describe('update$', () => {
  let customer: Customer;
  beforeEach(() => {
    customer = {
      id: 'fkkfig0939r',
      name: 'I am a customer',
      hasAdvisory: true,
      supportHours: 12,
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(CustomersService);
    actions$ = of(updateCustomer({ customer }));
    effects.update$.subscribe(() => {});
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(customer);
  });

  it('dispatches update success', done => {
    const dispatched = updateCustomerSuccess();
    actions$ = of(updateCustomer({ customer }));
    effects.update$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches update errors', done => {
    const service = TestBed.inject(CustomersService);
    const dispatched = updateCustomerFailure({
      error: new Error('The update failed'),
    });
    (service.update as any).mockRejectedValue(new Error('The update failed'));
    actions$ = of(updateCustomer({ customer }));
    effects.update$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(CustomersService);
    actions$ = of(addCustomer({ customer }));
    effects.update$.subscribe(() => {});
    expect(service.update).not.toHaveBeenCalled();
  });
});

describe('remove$', () => {
  let customer: Customer;
  beforeEach(() => {
    customer = {
      id: 'fkkfig0939r',
      name: 'I am a customer',
      hasAdvisory: true,
      supportHours: 12,
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(CustomersService);
    actions$ = of(removeCustomer({ customer }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).toHaveBeenCalledTimes(1);
    expect(service.delete).toHaveBeenCalledWith(customer);
  });

  it('dispatches remove success', done => {
    const dispatched = removeCustomerSuccess();
    actions$ = of(removeCustomer({ customer }));
    effects.remove$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches remove failure', done => {
    const service = TestBed.inject(CustomersService);
    const dispatched = removeCustomerFailure({
      error: new Error('The remove failed'),
    });
    (service.delete as any).mockRejectedValue(new Error('The remove failed'));
    actions$ = of(removeCustomer({ customer }));
    effects.remove$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(CustomersService);
    actions$ = of(updateCustomer({ customer }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).not.toHaveBeenCalled();
  });
});
