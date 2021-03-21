import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Timer } from '@app/models';
import { TimersService } from '@app/core/firestore-data';
import { createTimersServiceMock } from '@app/core/firestore-data/mocks';
import {
  addTimer,
  addTimerFailure,
  addTimerSuccess,
  removeTimer,
  removeTimerFailure,
  removeTimerSuccess,
  startTimer,
  startTimerFailure,
  startTimerSuccess,
  startup,
  stopTimer,
  stopTimerFailure,
  stopTimerSuccess,
  timerAdded,
  timerModified,
  timerRemoved,
  timersAdded,
  updateTimer,
  updateTimerFailure,
  updateTimerSuccess,
} from '@app/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { TimerEffects } from './effects';

let actions$: Observable<any>;
let effects: TimerEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      TimerEffects,
      { provide: TimersService, useFactory: createTimersServiceMock },
      provideMockActions(() => actions$),
    ],
  });

  effects = TestBed.inject<TimerEffects>(TimerEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('changes$', () => {
  it('observes changes to the timers', () => {
    const timersService = TestBed.inject(TimersService);
    actions$ = of(startup());
    effects.changes$.subscribe(() => {});
    expect(timersService.observeChanges).toHaveBeenCalledTimes(1);
  });

  describe('added change', () => {
    it('dispaches and added timer action', done => {
      const timersService = TestBed.inject(TimersService);
      (timersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  title: 'I am a newly added timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = timerAdded({
          timer: {
            id: '123499dfi',
            title: 'I am a newly added timer',
            type: 'Advisory',
            minutes: 30,
            date: '2019-11-25',
            customer: 'A & W',
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('modified change', () => {
    it('dispaches and modified timer action', done => {
      const timersService = TestBed.inject(TimersService);
      (timersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'modified',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  title: 'I am a modified timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = timerModified({
          timer: {
            id: '123499dfi',
            title: 'I am a modified timer',
            type: 'Advisory',
            minutes: 30,
            date: '2019-11-25',
            customer: 'A & W',
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('removed change', () => {
    it('dispaches and removed timer action', done => {
      const timersService = TestBed.inject(TimersService);
      (timersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
                }),
              },
            },
          },
        ]),
      );
      actions$ = of(startup());
      effects.changes$.subscribe(action => {
        const expected = timerRemoved({
          timer: {
            id: '123499dfi',
            title: 'I am a timer',
            type: 'Advisory',
            minutes: 30,
            date: '2019-11-25',
            customer: 'A & W',
          },
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('multiple changes', () => {
    it('dispaches the adds as a unit', fakeAsync(() => {
      const timersService = TestBed.inject(TimersService);
      (timersService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: 'f99g0e9fg',
                data: () => ({
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
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
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
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
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
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
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
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
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
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
            expected = timerRemoved({
              timer: {
                id: '123499dfi',
                title: 'I am a timer',
                type: 'Advisory',
                minutes: 30,
                date: '2019-11-25',
                customer: 'A & W',
              },
            });
            break;

          case 1:
            expected = timerModified({
              timer: {
                id: 'fi38849958392j',
                title: 'I am a timer',
                type: 'Advisory',
                minutes: 30,
                date: '2019-11-25',
                customer: 'A & W',
              },
            });
            break;

          case 2:
            expected = timersAdded({
              timers: [
                {
                  id: 'f99g0e9fg',
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
                },
                {
                  id: 'fkkfig0939r',
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
                },
                {
                  id: 'fiig0939034',
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W',
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
    const timersService = TestBed.inject(TimersService);
    actions$ = of(updateTimer({ timer: null }));
    effects.changes$.subscribe(() => {});
    expect(timersService.observeChanges).not.toHaveBeenCalled();
  });
});

describe('create$', () => {
  let timer: Timer;
  beforeEach(() => {
    timer = {
      id: 'fkkfig0939r',
      title: 'I am a timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W',
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(addTimer({ timer }));
    effects.create$.subscribe(() => {});
    expect(service.add).toHaveBeenCalledTimes(1);
    expect(service.add).toHaveBeenCalledWith(timer);
  });

  it('dispatches create success', done => {
    const dispatched = addTimerSuccess();
    actions$ = of(addTimer({ timer }));
    effects.create$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches create errors', done => {
    const service = TestBed.inject(TimersService);
    const dispatched = addTimerFailure({
      error: new Error('The create failed'),
    });
    (service.add as any).mockRejectedValue(new Error('The create failed'));
    actions$ = of(addTimer({ timer }));
    effects.create$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(updateTimer({ timer }));
    effects.create$.subscribe(() => {});
    expect(service.add).not.toHaveBeenCalled();
  });
});

describe('update$', () => {
  let timer: Timer;
  beforeEach(() => {
    timer = {
      id: 'fkkfig0939r',
      title: 'I am a timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W',
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(updateTimer({ timer }));
    effects.update$.subscribe(() => {});
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(timer);
  });

  it('dispatches update success', done => {
    const dispatched = updateTimerSuccess();
    actions$ = of(updateTimer({ timer }));
    effects.update$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches update errors', done => {
    const service = TestBed.inject(TimersService);
    const dispatched = updateTimerFailure({
      error: new Error('The update failed'),
    });
    (service.update as any).mockRejectedValue(new Error('The update failed'));
    actions$ = of(updateTimer({ timer }));
    effects.update$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(addTimer({ timer }));
    effects.update$.subscribe(() => {});
    expect(service.update).not.toHaveBeenCalled();
  });
});

describe('remove$', () => {
  let timer: Timer;
  beforeEach(() => {
    timer = {
      id: 'fkkfig0939r',
      title: 'I am a timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W',
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(removeTimer({ timer }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).toHaveBeenCalledTimes(1);
    expect(service.delete).toHaveBeenCalledWith(timer);
  });

  it('dispatches remove success', done => {
    const dispatched = removeTimerSuccess();
    actions$ = of(removeTimer({ timer }));
    effects.remove$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches remove failure', done => {
    const service = TestBed.inject(TimersService);
    const dispatched = removeTimerFailure({
      error: new Error('The remove failed'),
    });
    (service.delete as any).mockRejectedValue(new Error('The remove failed'));
    actions$ = of(removeTimer({ timer }));
    effects.remove$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(updateTimer({ timer }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).not.toHaveBeenCalled();
  });
});

describe('start$', () => {
  let timer: Timer;
  beforeEach(() => {
    timer = {
      id: 'fkkfig0939r',
      title: 'I am a timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W',
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(startTimer({ timer }));
    effects.start$.subscribe(() => {});
    expect(service.start).toHaveBeenCalledTimes(1);
    expect(service.start).toHaveBeenCalledWith('fkkfig0939r');
  });

  it('dispatches timer started success', done => {
    const dispatched = startTimerSuccess();
    actions$ = of(startTimer({ timer }));
    effects.start$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches timer started failure', done => {
    const service = TestBed.inject(TimersService);
    const dispatched = startTimerFailure({
      error: new Error('The start failed'),
    });
    (service.start as any).mockRejectedValue(new Error('The start failed'));
    actions$ = of(startTimer({ timer }));
    effects.start$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(updateTimer({ timer }));
    effects.start$.subscribe(() => {});
    expect(service.start).not.toHaveBeenCalled();
  });
});

describe('stop$', () => {
  let timer: Timer;
  beforeEach(() => {
    timer = {
      id: 'fkkfig0939r',
      title: 'I am a timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W',
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(stopTimer({ timer }));
    effects.stop$.subscribe(() => {});
    expect(service.stop).toHaveBeenCalledTimes(1);
    expect(service.stop).toHaveBeenCalledWith('fkkfig0939r');
  });

  it('dispatches timer stopped success', done => {
    const dispatched = stopTimerSuccess();
    actions$ = of(stopTimer({ timer }));
    effects.stop$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches timer stopped failure', done => {
    const service = TestBed.inject(TimersService);
    const dispatched = stopTimerFailure({
      error: new Error('The stop failed'),
    });
    (service.stop as any).mockRejectedValue(new Error('The stop failed'));
    actions$ = of(stopTimer({ timer }));
    effects.stop$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(updateTimer({ timer }));
    effects.stop$.subscribe(() => {});
    expect(service.stop).not.toHaveBeenCalled();
  });
});
