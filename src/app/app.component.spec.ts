import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { AppComponent } from './app.component';
import { createAngularFireAuthMock, createNavControllerMock } from '@test/mocks';
import { loginChanged } from './store/actions/auth.actions';
import { load as loadTimers } from './store/actions/timer.actions';
import { load as loadTaskTypes } from './store/actions/task-type.actions';
import { State } from './store/reducers';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: NavController, useFactory: createNavControllerMock },
        provideMockStore<State>()
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('dispatches the load of the task types', () => {
    const store = TestBed.get(Store);
    store.dispatch = jest.fn();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(loadTaskTypes());
  });

  describe('changing the user', () => {
    let store;
    beforeEach(() => {
      store = TestBed.get(Store);
      store.dispatch = jest.fn();
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      store.dispatch.mockClear();
    });

    describe('on login', () => {
      it('does not navigate', () => {
        const angularFireAuth = TestBed.get(AngularFireAuth);
        const navController = TestBed.get(NavController);
        angularFireAuth.authState.next({ id: 42, email: 'test@testty.com' });
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });

      it('dispatches the user change and load', () => {
        const angularFireAuth = TestBed.get(AngularFireAuth);
        angularFireAuth.authState.next({ id: 42, email: 'test@testty.com' });
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(loginChanged({ email: 'test@testty.com' }));
        expect(store.dispatch).toHaveBeenCalledWith(loadTimers());
      });
    });

    describe('on logout', () => {
      it('navigates to login', () => {
        const angularFireAuth = TestBed.get(AngularFireAuth);
        const navController = TestBed.get(NavController);
        angularFireAuth.authState.next(null);
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['login']);
      });

      it('dispatches the user change', () => {
        const angularFireAuth = TestBed.get(AngularFireAuth);
        angularFireAuth.authState.next(null);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(loginChanged({ email: null }));
      });
    });
  });
});
