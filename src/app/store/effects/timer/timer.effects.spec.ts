import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { TimerEffects } from './timer.effects';
import { createTimersServiceMock } from '@app/services/firestore-data/mocks';
import { TimersService } from '@app/services/firestore-data';
import * as timerActions from '@app/store/actions/timer.actions';
import { Timer } from '@app/models';

let actions$: Observable<any>;
let effects: TimerEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      TimerEffects,
      { provide: TimersService, useFactory: createTimersServiceMock },
      provideMockActions(() => actions$)
    ]
  });

  effects = TestBed.inject<TimerEffects>(TimerEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('load$', () => {
  it('observes changes to the timers', () => {
    const timersService = TestBed.inject(TimersService);
    actions$ = of(timerActions.load());
    effects.changes$.subscribe(() => {});
    expect(timersService.observeChanges).toHaveBeenCalledTimes(1);
  });

  describe('added change', () => {
    it('dispaches and added timer action', done => {
      const timersService = TestBed.inject(TimersService);
      timersService.observeChanges.mockReturnValue(
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
                  customer: 'A & W'
                })
              }
            }
          }
        ])
      );
      actions$ = of(timerActions.load());
      effects.changes$.subscribe(action => {
        const expected = timerActions.timerAdded({
          timer: {
            id: '123499dfi',
            title: 'I am a newly added timer',
            type: 'Advisory',
            minutes: 30,
            date: '2019-11-25',
            customer: 'A & W'
          }
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('modified change', () => {
    it('dispaches and modified timer action', done => {
      const timersService = TestBed.inject(TimersService);
      timersService.observeChanges.mockReturnValue(
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
                  customer: 'A & W'
                })
              }
            }
          }
        ])
      );
      actions$ = of(timerActions.load());
      effects.changes$.subscribe(action => {
        const expected = timerActions.timerModified({
          timer: {
            id: '123499dfi',
            title: 'I am a modified timer',
            type: 'Advisory',
            minutes: 30,
            date: '2019-11-25',
            customer: 'A & W'
          }
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('removed change', () => {
    it('dispaches and removed timer action', done => {
      const timersService = TestBed.inject(TimersService);
      timersService.observeChanges.mockReturnValue(
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
                  customer: 'A & W'
                })
              }
            }
          }
        ])
      );
      actions$ = of(timerActions.load());
      effects.changes$.subscribe(action => {
        const expected = timerActions.timerRemoved({
          timer: {
            id: '123499dfi',
            title: 'I am a timer',
            type: 'Advisory',
            minutes: 30,
            date: '2019-11-25',
            customer: 'A & W'
          }
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('multiple changes', () => {
    it('dispaches the adds as a unit', fakeAsync(() => {
      const timersService = TestBed.inject(TimersService);
      timersService.observeChanges.mockReturnValue(
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
                  customer: 'A & W'
                })
              }
            }
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
                  customer: 'A & W'
                })
              }
            }
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
                  customer: 'A & W'
                })
              }
            }
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
                  customer: 'A & W'
                })
              }
            }
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
                  customer: 'A & W'
                })
              }
            }
          }
        ])
      );
      actions$ = of(timerActions.load());
      let calls = 0;
      effects.changes$.subscribe(action => {
        let expected: Action;
        switch (calls) {
          case 0:
            expected = timerActions.timerRemoved({
              timer: {
                id: '123499dfi',
                title: 'I am a timer',
                type: 'Advisory',
                minutes: 30,
                date: '2019-11-25',
                customer: 'A & W'
              }
            });
            break;

          case 1:
            expected = timerActions.timerModified({
              timer: {
                id: 'fi38849958392j',
                title: 'I am a timer',
                type: 'Advisory',
                minutes: 30,
                date: '2019-11-25',
                customer: 'A & W'
              }
            });
            break;

          case 2:
            expected = timerActions.timersAdded({
              timers: [
                {
                  id: 'f99g0e9fg',
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W'
                },
                {
                  id: 'fkkfig0939r',
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W'
                },
                {
                  id: 'fiig0939034',
                  title: 'I am a timer',
                  type: 'Advisory',
                  minutes: 30,
                  date: '2019-11-25',
                  customer: 'A & W'
                }
              ]
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
    actions$ = of(timerActions.update({ timer: null }));
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
      customer: 'A & W'
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.create({ timer }));
    effects.create$.subscribe(() => {});
    expect(service.add).toHaveBeenCalledTimes(1);
    expect(service.add).toHaveBeenCalledWith(timer);
  });

  it('dispatches create success', done => {
    actions$ = of(timerActions.create({ timer }));
    effects.create$.subscribe(action => {
      expect(action).toEqual({ type: timerActions.TimerActionTypes.createSuccess });
      done();
    });
  });

  it('dispatches create errors', done => {
    const service = TestBed.inject(TimersService);
    (service.add as any).mockRejectedValue(new Error('The create failed'));
    actions$ = of(timerActions.create({ timer }));
    effects.create$.subscribe(action => {
      expect(action).toEqual({
        type: timerActions.TimerActionTypes.createFailure,
        error: new Error('The create failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.update({ timer }));
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
      customer: 'A & W'
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.update({ timer }));
    effects.update$.subscribe(() => {});
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(timer);
  });

  it('dispatches update success', done => {
    actions$ = of(timerActions.update({ timer }));
    effects.update$.subscribe(action => {
      expect(action).toEqual({ type: timerActions.TimerActionTypes.updateSuccess });
      done();
    });
  });

  it('dispatches update errors', done => {
    const service = TestBed.inject(TimersService);
    (service.update as any).mockRejectedValue(new Error('The update failed'));
    actions$ = of(timerActions.update({ timer }));
    effects.update$.subscribe(action => {
      expect(action).toEqual({
        type: timerActions.TimerActionTypes.updateFailure,
        error: new Error('The update failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.create({ timer }));
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
      customer: 'A & W'
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.remove({ timer }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).toHaveBeenCalledTimes(1);
    expect(service.delete).toHaveBeenCalledWith(timer);
  });

  it('dispatches remove success', done => {
    actions$ = of(timerActions.remove({ timer }));
    effects.remove$.subscribe(action => {
      expect(action).toEqual({ type: timerActions.TimerActionTypes.removeSuccess });
      done();
    });
  });

  it('dispatches remove failure', done => {
    const service = TestBed.inject(TimersService);
    (service.delete as any).mockRejectedValue(new Error('The remove failed'));
    actions$ = of(timerActions.remove({ timer }));
    effects.remove$.subscribe(action => {
      expect(action).toEqual({
        type: timerActions.TimerActionTypes.removeFailure,
        error: new Error('The remove failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.update({ timer }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).not.toHaveBeenCalled();
  });
});

describe('$start', () => {
  let timer: Timer;
  beforeEach(() => {
    timer = {
      id: 'fkkfig0939r',
      title: 'I am a timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W'
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.start({ timer }));
    effects.start$.subscribe(() => {});
    expect(service.start).toHaveBeenCalledTimes(1);
    expect(service.start).toHaveBeenCalledWith('fkkfig0939r');
  });

  it('dispatches timer started success', done => {
    actions$ = of(timerActions.start({ timer }));
    effects.start$.subscribe(action => {
      expect(action).toEqual({ type: timerActions.TimerActionTypes.startSuccess });
      done();
    });
  });

  it('dispatches timer started failure', done => {
    const service = TestBed.inject(TimersService);
    (service.start as any).mockRejectedValue(new Error('The start failed'));
    actions$ = of(timerActions.start({ timer }));
    effects.start$.subscribe(action => {
      expect(action).toEqual({
        type: timerActions.TimerActionTypes.startFailure,
        error: new Error('The start failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.update({ timer }));
    effects.start$.subscribe(() => {});
    expect(service.start).not.toHaveBeenCalled();
  });
});

describe('$stop', () => {
  let timer: Timer;
  beforeEach(() => {
    timer = {
      id: 'fkkfig0939r',
      title: 'I am a timer',
      type: 'Advisory',
      minutes: 30,
      date: '2019-11-25',
      customer: 'A & W'
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.stop({ timer }));
    effects.stop$.subscribe(() => {});
    expect(service.stop).toHaveBeenCalledTimes(1);
    expect(service.stop).toHaveBeenCalledWith('fkkfig0939r');
  });

  it('dispatches timer stopped success', done => {
    actions$ = of(timerActions.stop({ timer }));
    effects.stop$.subscribe(action => {
      expect(action).toEqual({ type: timerActions.TimerActionTypes.stopSuccess });
      done();
    });
  });

  it('dispatches timer stopped failure', done => {
    const service = TestBed.inject(TimersService);
    (service.stop as any).mockRejectedValue(new Error('The stop failed'));
    actions$ = of(timerActions.stop({ timer }));
    effects.stop$.subscribe(action => {
      expect(action).toEqual({
        type: timerActions.TimerActionTypes.stopFailure,
        error: new Error('The stop failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(TimersService);
    actions$ = of(timerActions.update({ timer }));
    effects.stop$.subscribe(() => {});
    expect(service.stop).not.toHaveBeenCalled();
  });
});
