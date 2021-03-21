import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Timer } from '@app/models';
import { TimerEditorComponent } from '@app/shared/timer-editor/timer-editor.component';
import { TimerListItemComponentModule } from '@app/shared/timer-list-item/timer-list-item.module';
import { selectTodayTimers, State } from '@app/store';
import { logout } from '@app/store/actions';
import { TimersState } from '@app/store/timer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { TodayPage } from './today.page';

describe('TodayPage', () => {
  let component: TodayPage;
  let fixture: ComponentFixture<TodayPage>;
  let modal: any;

  beforeEach(
    waitForAsync(() => {
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [TodayPage],
        imports: [IonicModule, TimerListItemComponentModule],
        providers: [
          provideMockStore<{ timers: TimersState }>({
            initialState: {
              timers: { ids: [], entities: null, loading: false },
            },
          }),
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock(modal),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TodayPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('subscribes to the timers for today', () => {
    let timers: Array<Timer>;
    component.timers$.subscribe(t => (timers = t));
    const store = TestBed.inject(Store) as MockStore<State>;
    store.overrideSelector(selectTodayTimers, [
      {
        id: 'ff898gd',
        title: 'Uhg, this is so ugly',
        customer: 'Ace Hardware',
        type: 'Code Review',
        task: '#22950',
        minutes: 27,
        date: '2019-12-25',
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
        date: '2019-12-25',
      },
    ]);
    store.refreshState();
    fixture.detectChanges();
    expect(timers).toEqual([
      {
        id: 'ff898gd',
        title: 'Uhg, this is so ugly',
        customer: 'Ace Hardware',
        type: 'Code Review',
        task: '#22950',
        minutes: 27,
        date: '2019-12-25',
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
        date: '2019-12-25',
      },
    ]);
  });

  describe('add', () => {
    it('displays the editor', async () => {
      const modalController = TestBed.inject(ModalController);
      await component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TimerEditorComponent,
        backdropDismiss: false,
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
