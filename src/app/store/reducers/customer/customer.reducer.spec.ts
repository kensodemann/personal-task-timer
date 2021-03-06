import { Customer } from '@app/models';
import {
  createFailure,
  CustomerActionTypes,
  customerAdded,
  customerModified,
  customerRemoved,
  customersAdded,
  loadFailure,
  removeFailure,
  updateFailure,
} from '@app/store/actions/customer.actions';
import { Dictionary } from '@ngrx/entity';
import { initialState, reducer } from './customer.reducer';

let testCustomers: Dictionary<Customer>;
let testCustomerIds: Array<string>;

beforeEach(() => {
  initializeTestData();
});

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe(CustomerActionTypes.load, () => {
  it('sets loading true, removes any entities, and undefines any error', () => {
    expect(
      reducer(
        {
          ...initialState,
          ids: [...testCustomerIds],
          entities: { ...testCustomers },
          error: new Error('the last load failed'),
        },
        { type: CustomerActionTypes.load },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(CustomerActionTypes.loadFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = loadFailure({ error: new Error('Could not load the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not load the data'),
    });
  });
});

describe(CustomerActionTypes.create, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { ...initialState, error: new Error('the last create failed') },
        { type: CustomerActionTypes.create },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(CustomerActionTypes.createFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = createFailure({
      error: new Error('Could not create the data'),
    });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not create the data'),
    });
  });
});

describe(CustomerActionTypes.update, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { ...initialState, error: new Error('the last update failed') },
        { type: CustomerActionTypes.update },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(CustomerActionTypes.updateFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = updateFailure({
      error: new Error('Could not update the data'),
    });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not update the data'),
    });
  });
});

describe(CustomerActionTypes.remove, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { ...initialState, error: new Error('the last remove failed') },
        { type: CustomerActionTypes.remove },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(CustomerActionTypes.removeFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = removeFailure({
      error: new Error('Could not remove the data'),
    });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not remove the data'),
    });
  });
});

describe(CustomerActionTypes.customerAdded, () => {
  it('adds the customer to an empty state', () => {
    const customer: Customer = {
      id: '194309fkadsfoi',
      name: 'A & W',
      hasAdvisory: true,
      supportHours: 12,
    };
    const action = customerAdded({ customer });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      ids: ['194309fkadsfoi'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'A & W',
          hasAdvisory: true,
          supportHours: 12,
        },
      },
    });
  });

  it('adds the customer to the existing ones', () => {
    const customer: Customer = {
      id: '194309fkadsfoi',
      name: 'A & W',
      hasAdvisory: false,
      supportHours: 16,
    };
    const action = customerAdded({ customer });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testCustomerIds,
          entities: testCustomers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [...testCustomerIds, '194309fkadsfoi'],
      entities: {
        ...testCustomers,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'A & W',
          hasAdvisory: false,
          supportHours: 16,
        },
      },
    });
  });
});

describe(CustomerActionTypes.customersAdded, () => {
  it('adds the customers to an empty state', () => {
    const customers: Array<Customer> = [
      {
        id: '194309fkadsfoi',
        name: 'A & W',
        hasAdvisory: true,
        supportHours: 12,
      },
      {
        id: 'fiiagoie92',
        name: 'Amys Arts',
        hasAdvisory: false,
        supportHours: 18,
      },
      {
        id: 'figof003f3',
        name: 'Mars Candy',
        hasAdvisory: true,
        supportHours: 4,
      },
    ];
    const action = customersAdded({ customers });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      loading: false,
      ids: ['194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'A & W',
          hasAdvisory: true,
          supportHours: 12,
        },
        'fiiagoie92': {
          id: 'fiiagoie92',
          name: 'Amys Arts',
          hasAdvisory: false,
          supportHours: 18,
        },
        'figof003f3': {
          id: 'figof003f3',
          name: 'Mars Candy',
          hasAdvisory: true,
          supportHours: 4,
        },
      },
    });
  });

  it('adds the customers to the existing ones', () => {
    const customers: Array<Customer> = [
      {
        id: '194309fkadsfoi',
        name: 'A & W',
        hasAdvisory: false,
        supportHours: 0,
      },
      {
        id: 'fiiagoie92',
        name: 'Amys Arts',
        hasAdvisory: true,
        supportHours: 12,
      },
      {
        id: 'figof003f3',
        name: 'Hunt Brothers',
        hasAdvisory: true,
        supportHours: 8,
      },
    ];
    const action = customersAdded({ customers });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testCustomerIds,
          entities: testCustomers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [...testCustomerIds, '194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        ...testCustomers,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'A & W',
          hasAdvisory: false,
          supportHours: 0,
        },
        'fiiagoie92': {
          id: 'fiiagoie92',
          name: 'Amys Arts',
          hasAdvisory: true,
          supportHours: 12,
        },
        'figof003f3': {
          id: 'figof003f3',
          name: 'Hunt Brothers',
          hasAdvisory: true,
          supportHours: 8,
        },
      },
    });
  });
});

describe(CustomerActionTypes.customerModified, () => {
  it('modifies the specified customer', () => {
    const customer: Customer = {
      id: 'ff898gd',
      name: 'A & W',
      hasAdvisory: true,
      supportHours: 9,
    };
    const expected = { ...testCustomers };
    expected.ff898gd = customer;
    const action = customerModified({ customer });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testCustomerIds,
          entities: testCustomers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: testCustomerIds,
      entities: expected,
    });
  });
});

describe(CustomerActionTypes.customerRemoved, () => {
  it('deletes the customer', () => {
    const customer: Customer = {
      id: 'ff88t99er',
      name: 'Wal-Mart',
      hasAdvisory: false,
      supportHours: 10,
    };
    const expected = { ...testCustomers };
    delete expected.ff88t99er;
    const action = customerRemoved({ customer });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testCustomerIds,
          entities: testCustomers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [testCustomerIds[0], testCustomerIds[1], testCustomerIds[3]],
      entities: expected,
    });
  });
});

function initializeTestData() {
  testCustomerIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf'];
  testCustomers = {
    'asdf1234': {
      id: 'asdf1234',
      name: 'Ace Hardware',
      hasAdvisory: true,
      supportHours: 42,
    },
    'ff898gd': {
      id: 'ff898gd',
      name: 'Fred Salvage',
      hasAdvisory: false,
      supportHours: 0,
    },
    'ff88t99er': {
      id: 'ff88t99er',
      name: 'Wal-Mart',
      hasAdvisory: true,
      supportHours: 17,
    },
    '1849gasdf': {
      id: '1849gasdf',
      name: 'Mc Donalds',
      hasAdvisory: true,
      supportHours: 0,
    },
  };
}
