import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { logout } from '@app/store/actions';
import { TimersState } from '@app/store/timer/reducer';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TimerListItemComponentModule } from '../timer-list-item/timer-list-item.module';
import { HistoryPage } from './history.page';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HistoryPage],
        imports: [IonicModule, TimerListItemComponentModule],
        providers: [
          provideMockStore<{ timers: TimersState }>({
            initialState: {
              timers: { ids: [], entities: null, loading: false },
            },
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HistoryPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
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
