import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApplicationService } from '@app/services';
import { createApplicationServiceMock } from '@app/services/mocks';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { createAngularFireAuthMock } from '@test/mocks';
import { AppComponent } from './app.component';
import { loginChanged, startup } from './store/actions';
import { State } from './store/reducers';

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
    expect(store.dispatch).toHaveBeenCalledWith(startup());
  });

  it('registers for updates', () => {
    const application = TestBed.inject(ApplicationService);
    const fixture = TestBed.createComponent(AppComponent);
    expect(application.registerForUpdates).not.toHaveBeenCalled();
    fixture.detectChanges();
    expect(application.registerForUpdates).toHaveBeenCalledTimes(1);
  });

  describe('changing the user', () => {
    let store: Store;
    beforeEach(() => {
      store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      (store.dispatch as any).mockClear();
    });

    describe('on login', () => {
      it('dispatches the user change', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        (angularFireAuth.authState as any).next({
          id: 42,
          email: 'test@testty.com',
          uid: '38849959af8ec93',
        });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          loginChanged({ email: 'test@testty.com', userId: '38849959af8ec93' }),
        );
      });
    });

    describe('on logout', () => {
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
