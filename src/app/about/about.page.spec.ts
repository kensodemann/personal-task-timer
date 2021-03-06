import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { logout } from '@app/store/actions';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { AboutPage } from './about.page';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AboutPage],
        imports: [IonicModule],
        providers: [provideMockStore()],
      }).compileComponents();

      fixture = TestBed.createComponent(AboutPage);
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
