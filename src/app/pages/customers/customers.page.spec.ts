import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { CustomersPage } from './customers.page';
import { CustomersState } from '@app/store/reducers/customer/customer.reducer';
import { logout } from '@app/store/actions/auth.actions';

describe('CustomersPage', () => {
  let component: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersPage],
      imports: [IonicModule],
      providers: [
        provideMockStore<{ customers: CustomersState }>({
          initialState: { customers: { ids: [], entities: null, loading: false } }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

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
