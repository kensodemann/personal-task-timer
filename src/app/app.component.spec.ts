import { TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { AppComponent } from './app.component';
import {
  createAngularFireAuthMock,
  createNavControllerMock,
} from '@test/mocks';
import { loginChanged } from './store/actions/auth.actions';
import { load as loadCustomers } from './store/actions/customer.actions';
import { load as loadTimers } from './store/actions/timer.actions';
import { load as loadTaskTypes } from './store/actions/task-type.actions';
import { State } from './store/reducers';
import { ApplicationService } from '@app/services';
import { createApplicationServiceMock } from '@app/services/mocks';

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
          {
            provide: ApplicationService,
            useFactory: createApplicationServiceMock,
          },
          { provide: NavController, useFactory: createNavControllerMock },
          provideMockStore<State>(),
        ],
      }).compileComponents();
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('dispatches the load of the task types', () => {
    const store = TestBed.inject(Store);
    store.dispatch = jest.fn();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(loadTaskTypes());
  });

  it('registers for updates', () => {
    const application = TestBed.inject(ApplicationService);
    const fixture = TestBed.createComponent(AppComponent);
    expect(application.registerForUpdates).not.toHaveBeenCalled();
    fixture.detectChanges();
    expect(application.registerForUpdates).toHaveBeenCalledTimes(1);
  });

  describe('changing the user', () => {
    let store;
    beforeEach(() => {
      store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      store.dispatch.mockClear();
    });

    describe('on login', () => {
      it('does not navigate', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        const navController = TestBed.inject(NavController);
        (angularFireAuth.authState as any).next({
          id: 42,
          email: 'test@testty.com',
        });
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });

      it('dispatches the user change and load', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        (angularFireAuth.authState as any).next({
          id: 42,
          email: 'test@testty.com',
          uid: '38849959af8ec93',
        });
        expect(store.dispatch).toHaveBeenCalledTimes(3);
        expect(store.dispatch).toHaveBeenCalledWith(
          loginChanged({ email: 'test@testty.com', userId: '38849959af8ec93' }),
        );
        expect(store.dispatch).toHaveBeenCalledWith(loadCustomers());
        expect(store.dispatch).toHaveBeenCalledWith(loadTimers());
      });
    });

    describe('on logout', () => {
      it('navigates to login', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        const navController = TestBed.inject(NavController);
        (angularFireAuth.authState as any).next(null);
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['login']);
      });

      it('dispatches the user change', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        (angularFireAuth.authState as any).next(null);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          loginChanged({ email: null, userId: null }),
        );
      });
    });
  });
});
