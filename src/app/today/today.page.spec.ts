import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { TodayPage } from './today.page';
import { TimerListItemComponentModule } from '@app/shared/timer-list-item/timer-list-item.module';
import { logout } from '@app/actions/auth.actions';

describe('TodayPage', () => {
  let component: TodayPage;
  let fixture: ComponentFixture<TodayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TodayPage],
      imports: [IonicModule.forRoot(), TimerListItemComponentModule],
      providers: [provideMockStore()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.get(Store);
      store.dispatch = jest.fn();
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
