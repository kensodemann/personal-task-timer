import { initialState, reducer } from './timer.reducer';
import {
  TimerActionTypes,
  createSuccess,
  createFailure,
  updateSuccess,
  updateFailure,
  removeSuccess,
  removeFailure,
  loadFailure,
  loadSuccess
} from '@app/actions/timer.actions';
import { Timer } from '@app/models/timer';

let testTimers: Array<Timer>;

beforeEach(() => {
  initializeTestData();
});

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe(TimerActionTypes.load, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer({ data: [], loading: false, error: new Error('the last load failed') }, { type: TimerActionTypes.load })
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });
});

describe(TimerActionTypes.loadSuccess, () => {
  it('sets the data and clears the loading flag', () => {
    const action = loadSuccess({ timers: testTimers });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      data: testTimers,
      loading: false
    });
  });
});

describe(TimerActionTypes.loadFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = loadFailure({ error: new Error('Could not load the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not load the data')
    });
  });
});

describe(TimerActionTypes.create, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { data: testTimers, loading: false, error: new Error('the last create failed') },
        { type: TimerActionTypes.create }
      )
    ).toEqual({
      ...initialState,
      data: testTimers,
      loading: true,
      error: undefined
    });
  });
});

describe(TimerActionTypes.createSuccess, () => {
  it('adds the timer to the data and clears the loading flag', () => {
    const timer: Timer = {
      id: '4495234fd',
      title: 'Help someone do something else',
      customer: 'Ace Hardware',
      type: 'Advisory',
      minutes: 0,
      date: new Date()
    };
    const action = createSuccess({ timer });
    expect(reducer({ ...initialState, data: testTimers, loading: true }, action)).toEqual({
      ...initialState,
      data: [...testTimers, timer],
      loading: false
    });
  });
});

describe(TimerActionTypes.createFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = createFailure({ error: new Error('Could not create the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not create the data')
    });
  });
});

describe(TimerActionTypes.update, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { data: [], loading: false, error: new Error('the last update failed') },
        { type: TimerActionTypes.update }
      )
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });
});

describe(TimerActionTypes.updateSuccess, () => {
  it('updates the data and clears the loading flag', () => {
    const timer = { ...testTimers[1] };
    timer.minutes = 42;
    timer.title = 'Uhg, this is so super ugly';
    const expected = [...testTimers];
    expected[1] = timer;
    const action = updateSuccess({ timer });
    expect(reducer({ ...initialState, data: testTimers, loading: true }, action)).toEqual({
      ...initialState,
      data: expected,
      loading: false
    });
  });
});

describe(TimerActionTypes.updateFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = updateFailure({ error: new Error('Could not update the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not update the data')
    });
  });
});

describe(TimerActionTypes.remove, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { data: [], loading: false, error: new Error('the last remove failed') },
        { type: TimerActionTypes.remove }
      )
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });
});

describe(TimerActionTypes.updateSuccess, () => {
  it('updates the data and clears the loading flag', () => {
    const timer = testTimers[1];
    const expected = [testTimers[0], testTimers[2], testTimers[3]];
    const action = removeSuccess({ timer });
    expect(reducer({ ...initialState, data: testTimers, loading: true }, action)).toEqual({
      ...initialState,
      data: expected,
      loading: false
    });
  });
});

describe(TimerActionTypes.removeFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = removeFailure({ error: new Error('Could not remove the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not remove the data')
    });
  });
});

function initializeTestData() {
  testTimers = [
    {
      id: 'asdf1234',
      title: 'Help someone do something',
      customer: 'Ace Hardware',
      type: 'Advisory',
      minutes: 0,
      date: new Date()
    },
    {
      id: 'ff898gd',
      title: 'Uhg, this is so ugly',
      customer: 'Ace Hardware',
      type: 'Code Review',
      task: '#22950',
      minutes: 27,
      date: new Date()
    },
    {
      id: 'ff88t99er',
      title: 'I feel them crawling under my skin',
      customer: 'Wal-Mart',
      type: 'General',
      task: '#22953',
      bugFound: true,
      startTime: 188359,
      minutes: 42,
      date: new Date()
    },
    {
      id: '1849gasdf',
      title: 'Help someone do something',
      customer: 'Mc Donalds',
      type: 'Advisory',
      minutes: 93,
      date: new Date()
    }
  ];
}
