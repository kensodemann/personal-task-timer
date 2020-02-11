import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { TimerListItemComponent } from './timer-list-item.component';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { Timer } from '@app/models';
import { remove, stop, start } from '@app/store/actions/timer.actions';
import { TimersState } from '@app/store/reducers/timer/timer.reducer';
import { selectAllActiveTimers } from '@app/store';
import { TimerEditorComponent } from '../timer-editor/timer-editor.component';

describe('TimerListItemComponent', () => {
  let alert;
  let modal;
  let component: TimerListItemComponent;
  let fixture: ComponentFixture<TimerListItemComponent>;
  let store;
  let testTimer: Timer;

  beforeEach(async(() => {
    alert = createOverlayElementMock();
    modal = createOverlayElementMock();
    testTimer = {
      id: '249950kd995sd',
      title: 'Go to the Foo Bar',
      customer: 'bar',
      type: 'Code Review',
      minutes: 120,
      date: '2019-12-26'
    };
    TestBed.configureTestingModule({
      declarations: [TimerListItemComponent],
      imports: [IonicModule],
      providers: [
        provideMockStore<{ timers: TimersState }>({
          initialState: { timers: { ids: [], entities: null, loading: false } }
        }),
        { provide: AlertController, useFactory: () => createOverlayControllerMock(alert) },
        { provide: ModalController, useFactory: () => createOverlayControllerMock(modal) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerListItemComponent);
    component = fixture.componentInstance;
    component.timer = testTimer;
    store = TestBed.inject(Store);
    store.dispatch = jest.fn();
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('sets running minutes to zero for non-running timers', () => {
    fixture.detectChanges();
    expect(component.runningMinutes).toEqual(0);
  });

  it('calculates the running minutes for a running timer', () => {
    Date.now = jest.fn(() => 1577103480000);
    testTimer.startTime = 1577102400000;
    fixture.detectChanges();
    expect(component.runningMinutes).toEqual(18);
  });

  describe('methods', () => {
    beforeEach(() => fixture.detectChanges());

    describe('delete', () => {
      it('asks the user if they would like to delete the timer', async () => {
        const alertController = TestBed.inject(AlertController);
        await component.delete();
        expect(alertController.create).toHaveBeenCalledTimes(1);
        expect(alertController.create).toHaveBeenCalledWith({
          header: 'Remove Timer?',
          subHeader: testTimer.title,
          message: 'This action cannot be undone. Are you sure you want to continue?',
          buttons: [
            { text: 'Yes', role: 'confirm' },
            { text: 'No', role: 'cancel' }
          ]
        });
        expect(alert.present).toHaveBeenCalledTimes(1);
      });

      it('dispatches the delete action on confirm', async () => {
        alert.onDidDismiss.mockResolvedValue({ role: 'confirm' });
        await component.delete();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(remove({ timer: testTimer }));
      });

      it('does not dispatch on cancel', async () => {
        alert.onDidDismiss.mockResolvedValue({ role: 'cancel' });
        await component.delete();
        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('does not dispatch on backdrop dismiss', async () => {
        alert.onDidDismiss.mockResolvedValue({ role: 'backdrop' });
        await component.delete();
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('edit', () => {
      it('displays the timer in the editor modal', async () => {
        const modalController = TestBed.inject(ModalController);
        await component.edit();
        expect(modalController.create).toHaveBeenCalledTimes(1);
        expect(modalController.create).toHaveBeenCalledWith({
          component: TimerEditorComponent,
          componentProps: { timer: testTimer }
        });
        expect(modal.present).toHaveBeenCalledTimes(1);
      });
    });

    describe('toggle', () => {
      describe('when the timer is currently running', () => {
        beforeEach(() => {
          testTimer.startTime = 1577102400000;
        });

        it('stops the timer', () => {
          component.toggle();
          expect(store.dispatch).toHaveBeenCalledTimes(1);
          expect(store.dispatch).toHaveBeenCalledWith(stop({ timer: testTimer }));
        });
      });

      describe('when the timer is currently stopped', () => {
        it('stops other currently running timers', () => {
          store.overrideSelector(selectAllActiveTimers, [
            {
              id: 'ff898gd',
              title: 'Uhg, this is so ugly',
              customer: 'Ace Hardware',
              type: 'Code Review',
              task: '#22950',
              minutes: 27,
              date: '2019-12-25',
              startTime: 4299402593
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
              date: '2019-12-25'
            }
          ]);
          component.toggle();
          expect(store.dispatch).toHaveBeenCalledTimes(3);
          expect(store.dispatch).toHaveBeenCalledWith(
            stop({
              timer: {
                id: 'ff898gd',
                title: 'Uhg, this is so ugly',
                customer: 'Ace Hardware',
                type: 'Code Review',
                task: '#22950',
                minutes: 27,
                date: '2019-12-25',
                startTime: 4299402593
              }
            })
          );
          expect(store.dispatch).toHaveBeenCalledWith(
            stop({
              timer: {
                id: 'ff88t99er',
                title: 'I feel them crawling under my skin',
                customer: 'Wal-Mart',
                type: 'General',
                task: '#22953',
                bugFound: true,
                startTime: 188359,
                minutes: 42,
                date: '2019-12-25'
              }
            })
          );
          expect(store.dispatch).toHaveBeenCalledWith(start({ timer: testTimer }));
        });

        it('starts the timer', () => {
          component.toggle();
          expect(store.dispatch).toHaveBeenCalledTimes(1);
          expect(store.dispatch).toHaveBeenCalledWith(start({ timer: testTimer }));
        });
      });

      it('does nothing if disableToggle is true', () => {
        component.disableToggle = true;
        component.toggle();
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });
});
