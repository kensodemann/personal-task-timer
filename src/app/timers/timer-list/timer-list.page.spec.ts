import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Timer } from '@app/models';
import { selectPeriodTimersSorted, selectTodayTimers, State } from '@app/store';
import { TimersState } from '@app/store/timer/reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayControllerMock,
  createOverlayElementMock,
} from '@test/mocks';
import { TimerEditorComponent } from '../timer-editor/timer-editor.component';
import { TimerListItemComponentModule } from '../timer-list-item/timer-list-item.module';
import { TimerListPage } from './timer-list.page';

describe('TimerListPage', () => {
  let component: TimerListPage;
  let fixture: ComponentFixture<TimerListPage>;
  let modal: any;
  let timers: Array<Timer>;

  beforeEach(
    waitForAsync(() => {
      initializeTestData();
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [TimerListPage],
        imports: [FormsModule, IonicModule, TimerListItemComponentModule],
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

      fixture = TestBed.createComponent(TimerListPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const store = TestBed.inject(Store) as MockStore<State>;
      store.overrideSelector(
        selectTodayTimers,
        timers.filter(t => t.date === '2019-12-25'),
      );
      store.overrideSelector(selectPeriodTimersSorted, timers);
      store.refreshState();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('timer list', () => {
    it('shows the timers for today by default', () => {
      fixture.detectChanges();
      const timerItems = fixture.debugElement.queryAll(
        By.css('app-timer-list-item'),
      );
      expect(timerItems.length).toBe(2);
      expect(timerItems[0].nativeElement.textContent).toContain(
        'Uhg, this is so ugly',
      );
      expect(timerItems[1].nativeElement.textContent).toContain(
        'I feel them crawling under my skin',
      );
    });

    it('shows the historical timers if history is clicked', () => {
      component.display = 'history';
      fixture.detectChanges();
      const timerItems = fixture.debugElement.queryAll(
        By.css('app-timer-list-item'),
      );
      expect(timerItems.length).toBe(4);
    });
  });

  describe('add button', () => {
    it('displays the editor', async () => {
      const btn = fixture.debugElement.query(
        By.css('[data-testid="add-timer-button"]'),
      );
      const modalController = TestBed.inject(ModalController);
      click(btn.nativeElement);
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TimerEditorComponent,
        backdropDismiss: false,
      });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };

  const initializeTestData = () => {
    timers = [
      {
        id: 'f8r8200394',
        title: 'The cat is a whiney cow',
        customer: 'Miller Marks',
        type: 'Architecture Review',
        bugFound: false,
        minutes: 360,
        date: '2019-12-23',
      },
      {
        id: 'dd93492034',
        title: 'The other cat is fat',
        customer: 'Miller Marks',
        type: 'Architecture Review',
        bugFound: false,
        minutes: 360,
        date: '2019-12-24',
      },
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
    ];
  };
});
