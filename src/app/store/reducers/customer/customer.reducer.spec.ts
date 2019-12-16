import { initialState, reducer } from './customer.reducer';
import { CustomerActions, add, addMany } from '@app/store/actions/customer.actions';

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe(CustomerActions.add, () => {
  it('adds the customer to an empty list', () => {
    const action = add({ customer: 'Jim and John Subs' });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      customers: ['Jim and John Subs']
    });
  });

  it('adds the customer to an existing list', () => {
    const action = add({ customer: 'Jim and John Subs' });
    expect(reducer({ ...initialState, customers: ['Frank Furters', 'Pick & Choose'] }, action)).toEqual({
      ...initialState,
      customers: ['Frank Furters', 'Jim and John Subs', 'Pick & Choose']
    });
  });

  it('adds the customer to the start of an existing list', () => {
    const action = add({ customer: 'Ace Software' });
    expect(reducer({ ...initialState, customers: ['Frank Furters', 'Pick & Choose'] }, action)).toEqual({
      ...initialState,
      customers: ['Ace Software', 'Frank Furters', 'Pick & Choose']
    });
  });

  it('adds the customer to the end of an existing list', () => {
    const action = add({ customer: 'Quiz Knows' });
    expect(reducer({ ...initialState, customers: ['Frank Furters', 'Pick & Choose'] }, action)).toEqual({
      ...initialState,
      customers: ['Frank Furters', 'Pick & Choose', 'Quiz Knows']
    });
  });

  it('does not add the customer if it is already in the list', () => {
    const action = add({ customer: 'Jim and John Subs' });
    expect(
      reducer({ ...initialState, customers: ['Frank Furters', 'Jim and John Subs', 'Pick & Choose'] }, action)
    ).toEqual({
      ...initialState,
      customers: ['Frank Furters', 'Jim and John Subs', 'Pick & Choose']
    });
  });
});

describe(CustomerActions.addMany, () => {
  it('adds unique customers to an empty list', () => {
    const action = addMany({
      customers: ['Ace Software', 'Pick & Choose', 'McDucks', 'Pick & Choose', 'Ace Software']
    });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      customers: ['Ace Software', 'McDucks', 'Pick & Choose']
    });
  });

  it('adds unique customers to an existing list', () => {
    const action = addMany({
      customers: ['Ace Software', 'Pick & Choose', 'McDucks', 'Pick & Choose', 'Ace Software']
    });
    expect(reducer({ ...initialState, customers: ['AA Mobile', 'Noze Divers', 'ZZ Bottoms'] }, action)).toEqual({
      ...initialState,
      customers: ['AA Mobile', 'Ace Software', 'McDucks', 'Noze Divers', 'Pick & Choose', 'ZZ Bottoms']
    });
  });

  it('does not add customers if the are all already there', () => {
    const action = addMany({
      customers: ['Ace Software', 'Pick & Choose', 'McDucks', 'Pick & Choose', 'Ace Software']
    });
    expect(
      reducer(
        {
          ...initialState,
          customers: ['AA Mobile', 'Ace Software', 'McDucks', 'Noze Divers', 'Pick & Choose', 'ZZ Bottoms']
        },
        action
      )
    ).toEqual({
      ...initialState,
      customers: ['AA Mobile', 'Ace Software', 'McDucks', 'Noze Divers', 'Pick & Choose', 'ZZ Bottoms']
    });
  });
});
