import { Dictionary } from '@ngrx/entity';

import { initialState, reducer } from './timer.reducer';
import {
  TimerActionTypes,
  createFailure,
  updateFailure,
  removeFailure,
  loadFailure,
  timerAdded,
  timersAdded,
  timerModified,
  timerRemoved,
} from '@app/store/actions/timer.actions';
import { Timer } from '@app/models';

let testTimers: Dictionary<Timer>;
let testTimerIds: Array<string>;

beforeEach(() => {
  initializeTestData();
});

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe(TimerActionTypes.load, () => {
  it('sets loading true, removes any entities, and undefines any error', () => {
    expect(
      reducer(
        {
          ...initialState,
          ids: [...testTimerIds],
          entities: { ...testTimers },
          error: new Error('the last load failed'),
        },
        { type: TimerActionTypes.load },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(TimerActionTypes.loadFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = loadFailure({ error: new Error('Could not load the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not load the data'),
    });
  });
});

describe(TimerActionTypes.create, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { ...initialState, error: new Error('the last create failed') },
        { type: TimerActionTypes.create },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(TimerActionTypes.createFailure, () => {
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

describe(TimerActionTypes.update, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { ...initialState, error: new Error('the last update failed') },
        { type: TimerActionTypes.update },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(TimerActionTypes.updateFailure, () => {
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

describe(TimerActionTypes.remove, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer(
        { ...initialState, error: new Error('the last remove failed') },
        { type: TimerActionTypes.remove },
      ),
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined,
    });
  });
});

describe(TimerActionTypes.removeFailure, () => {
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

describe(TimerActionTypes.timerAdded, () => {
  it('adds the timer to an empty state', () => {
    const timer: Timer = {
      id: '194309fkadsfoi',
      title: 'I am a newly added timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W',
    };
    const action = timerAdded({ timer });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      ids: ['194309fkadsfoi'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          title: 'I am a newly added timer',
          type: 'Advisory',
          minutes: 30,
          date: '2019-11-25',
          customer: 'A & W',
        },
      },
    });
  });

  it('adds the timer to the existing ones', () => {
    const timer: Timer = {
      id: '194309fkadsfoi',
      title: 'I am a newly added timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-07-25',
      customer: 'A & W',
    };
    const action = timerAdded({ timer });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testTimerIds,
          entities: testTimers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [...testTimerIds, '194309fkadsfoi'],
      entities: {
        ...testTimers,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          title: 'I am a newly added timer',
          type: 'Advisory',
          minutes: 30,
          date: '2019-07-25',
          customer: 'A & W',
        },
      },
    });
  });
});

describe(TimerActionTypes.timersAdded, () => {
  it('adds the timers to an empty state', () => {
    const timers: Array<Timer> = [
      {
        id: '194309fkadsfoi',
        title: 'I am a newly added timer',
        type: 'Advisory',
        minutes: 30,
        date: '2019-11-25',
        customer: 'A & W',
      },
      {
        id: 'fiiagoie92',
        title: 'I am another newly added timer',
        type: 'Code Review',
        minutes: 180,
        date: '2019-11-26',
        customer: 'Amys Arts',
      },
      {
        id: 'figof003f3',
        title: 'it is all ok',
        type: 'Advisory',
        minutes: 30,
        date: '2019-11-25',
        customer: 'A & W',
      },
    ];
    const action = timersAdded({ timers });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      loading: false,
      ids: ['194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          title: 'I am a newly added timer',
          type: 'Advisory',
          minutes: 30,
          date: '2019-11-25',
          customer: 'A & W',
        },
        'fiiagoie92': {
          id: 'fiiagoie92',
          title: 'I am another newly added timer',
          type: 'Code Review',
          minutes: 180,
          date: '2019-11-26',
          customer: 'Amys Arts',
        },
        'figof003f3': {
          id: 'figof003f3',
          title: 'it is all ok',
          type: 'Advisory',
          minutes: 30,
          date: '2019-11-25',
          customer: 'A & W',
        },
      },
    });
  });

  it('adds the timers to the existing ones', () => {
    const timers: Array<Timer> = [
      {
        id: '194309fkadsfoi',
        title: 'I am a newly added timer',
        type: 'Advisory',
        minutes: 30,
        date: '2019-11-25',
        customer: 'A & W',
      },
      {
        id: 'fiiagoie92',
        title: 'I am another newly added timer',
        type: 'Code Review',
        minutes: 180,
        date: '2019-11-26',
        customer: 'Amys Arts',
      },
      {
        id: 'figof003f3',
        title: 'it is all ok',
        type: 'Advisory',
        minutes: 30,
        date: '2019-11-25',
        customer: 'A & W',
      },
    ];
    const action = timersAdded({ timers });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testTimerIds,
          entities: testTimers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [...testTimerIds, '194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        ...testTimers,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          title: 'I am a newly added timer',
          type: 'Advisory',
          minutes: 30,
          date: '2019-11-25',
          customer: 'A & W',
        },
        'fiiagoie92': {
          id: 'fiiagoie92',
          title: 'I am another newly added timer',
          type: 'Code Review',
          minutes: 180,
          date: '2019-11-26',
          customer: 'Amys Arts',
        },
        'figof003f3': {
          id: 'figof003f3',
          title: 'it is all ok',
          type: 'Advisory',
          minutes: 30,
          date: '2019-11-25',
          customer: 'A & W',
        },
      },
    });
  });
});

describe(TimerActionTypes.timerModified, () => {
  it('modifies the specified timer', () => {
    const timer: Timer = {
      id: 'ff898gd',
      title: 'I am a modified timer',
      type: 'Advisory',
      minutes: 90,
      task: undefined,
      date: '2019-12-15',
      customer: 'A & W',
    };
    const expected = { ...testTimers };
    expected.ff898gd = timer;
    const action = timerModified({ timer });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testTimerIds,
          entities: testTimers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: testTimerIds,
      entities: expected,
    });
  });
});

describe(TimerActionTypes.timerRemoved, () => {
  it('deletes the timer', () => {
    const timer: Timer = {
      id: 'ff88t99er',
      title: 'I feel them crawling under my skin',
      customer: 'Wal-Mart',
      type: 'General',
      task: '#22953',
      bugFound: true,
      startTime: 188359,
      minutes: 42,
      date: '2019-12-25',
    };
    const expected = { ...testTimers };
    delete expected.ff88t99er;
    const action = timerRemoved({ timer });
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          ids: testTimerIds,
          entities: testTimers,
        },
        action,
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      ids: [testTimerIds[0], testTimerIds[1], testTimerIds[3]],
      entities: expected,
    });
  });
});

function initializeTestData() {
  testTimerIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf'];
  testTimers = {
    'asdf1234': {
      id: 'asdf1234',
      title: 'Help someone do something',
      customer: 'Ace Hardware',
      type: 'Advisory',
      minutes: 0,
      date: '2019-07-17',
    },
    'ff898gd': {
      id: 'ff898gd',
      title: 'Uhg, this is so ugly',
      customer: 'Ace Hardware',
      type: 'Code Review',
      task: '#22950',
      minutes: 27,
      date: '2019-12-25',
    },
    'ff88t99er': {
      id: 'ff88t99er',
      title: 'I feel them crawling under my skin',
      customer: 'Wal-Mart',
      type: 'General',
      task: '#22953',
      bugFound: true,
      startTime: 188359,
      minutes: 42,
      date: '2019-12-25',
    },
    '1849gasdf': {
      id: '1849gasdf',
      title: 'Help someone do something',
      customer: 'Mc Donalds',
      type: 'Advisory',
      minutes: 93,
      date: '2019-11-19',
    },
  };
}
