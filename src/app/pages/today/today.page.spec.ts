import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { TodayPage } from './today.page';
import { TimerListItemComponentModule } from '@app/shared/timer-list-item/timer-list-item.module';
import { TimerEditorComponent } from '@app/shared/timer-editor/timer-editor.component';
import { logout } from '@app/store/actions/auth.actions';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { TimersState } from '@app/store/reducers/timer/timer.reducer';

describe('TodayPage', () => {
  let component: TodayPage;
  let fixture: ComponentFixture<TodayPage>;
  let modal;

  beforeEach(async(() => {
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [TodayPage],
      imports: [IonicModule, TimerListItemComponentModule],
      providers: [
        provideMockStore<{ timers: TimersState }>({
          initialState: { timers: { ids: [], entities: null, loading: false } }
        }),
        { provide: ModalController, useFactory: () => createOverlayControllerMock(modal) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add', () => {
    it('displays the editor', async () => {
      const modalController = TestBed.get(ModalController);
      await component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({ component: TimerEditorComponent, backdropDismiss: false });
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
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
