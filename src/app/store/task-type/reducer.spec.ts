import { initialState, reducer } from './reducer';
import { startup } from '@app/store';

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

it('loads the data', () => {
  const action = startup();
  expect(reducer({ ...initialState }, action)).toEqual({
    ...initialState,
    taskTypes: [
      'Consulting',
      'Bug',
      'CSI Time',
      'Architecture Review',
      'Code Review',
      'Framework Training',
      'Working Session',
      'App Checkup',
      'Appflow Onboarding',
      'UI/UX Review',
    ],
  });
});
