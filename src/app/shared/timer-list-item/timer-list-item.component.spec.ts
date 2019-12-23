import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { TimerListItemComponent } from './timer-list-item.component';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { Timer } from '@app/models';
import { remove } from '@app/store/actions/timer.actions';
import { TimersState } from '@app/store/reducers/timer/timer.reducer';

describe('TimerListItemComponent', () => {
  let alert = createOverlayElementMock();
  let modal = createOverlayElementMock();
  let component: TimerListItemComponent;
  let fixture: ComponentFixture<TimerListItemComponent>;
  let store;
  let testTimer: Timer;

  beforeEach(async(() => {
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
    store = TestBed.get(Store);
    store.dispatch = jest.fn();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('delete', () => {
    it('asks the user if they would like to delete the timer', async () => {
      const alertController = TestBed.get(AlertController);
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
    it('displays the timer in the editor modal', () => {});
  });

  describe('toggle', () => {
    describe('when the timer is currently running', () => {
      beforeEach(() => {
        testTimer.startTime = 1577102400000;
      });

      it('stops the timer', () => {});
    });

    describe('when the timer is currently stopped', () => {
      it('stops other currently running timers', () => {});

      it('starts the timer', () => {});
    });

    it('does nothing if disableToggle is true', () => {
      component.disableToggle = true;
      component.toggle();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
