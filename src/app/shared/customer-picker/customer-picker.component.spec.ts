import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, IonSearchbar } from '@ionic/angular';
import { Dictionary } from '@ngrx/entity';
import { provideMockStore } from '@ngrx/store/testing';

import { CustomerPickerComponent } from './customer-picker.component';
import { TimersState } from '@app/store/reducers/timer/timer.reducer';
import { createOverlayControllerMock } from '@test/mocks';
import { Timer } from '@app/models';

describe('CustomerPickerComponent', () => {
  let component: CustomerPickerComponent;
  let fixture: ComponentFixture<CustomerPickerComponent>;
  let searchElement;

  let testTimerIds: Array<string>;
  let testTimers: Dictionary<Timer>;

  beforeEach(async(() => {
    initializeTestData();
    TestBed.configureTestingModule({
      declarations: [CustomerPickerComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ModalController, useFactory: () => createOverlayControllerMock() },
        provideMockStore<{ timers: TimersState }>({
          initialState: { timers: { loading: false, ids: testTimerIds, entities: testTimers } }
        })
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CustomerPickerComponent);
    component = fixture.componentInstance;
    searchElement = { focus: jest.fn() };
    component.searchBar.getInputElement = jest.fn(() => Promise.resolve(searchElement));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('focuses the search element', () => {
    expect(searchElement.focus).toHaveBeenCalledTimes(1);
  });

  it('selects all customers', () => {
    let customers: Array<string>;
    component.customers$.subscribe(c => (customers = c));
    expect(customers).toEqual(['Ace Software', 'Butts Fixtures', 'Jim and John']);
  });

  describe('dismiss', () => {
    it('dismisses the dialog', () => {
      const modalController = TestBed.inject(ModalController);
      component.dismiss();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('dismisses with the cancel role and no data', () => {
      const modalController = TestBed.inject(ModalController);
      component.dismiss();
      expect(modalController.dismiss).toHaveBeenCalledWith(undefined, 'cancel');
    });
  });

  describe('create', () => {
    it('dismisses the dialog', () => {
      const modalController = TestBed.inject(ModalController);
      component.create();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('dismisses with the create role and the entered name', () => {
      const modalController = TestBed.inject(ModalController);
      component.searchText = 'FooBar';
      component.create();
      expect(modalController.dismiss).toHaveBeenCalledWith('FooBar', 'create');
    });
  });

  describe('select', () => {
    it('dismisses the dialog', () => {
      const modalController = TestBed.inject(ModalController);
      component.select('Ace Software');
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('dismisses with the select role and the customer name', () => {
      const modalController = TestBed.inject(ModalController);
      component.select('Ace Software');
      expect(modalController.dismiss).toHaveBeenCalledWith('Ace Software', 'select');
    });
  });

  function initializeTestData() {
    testTimerIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf', '9940295kf'];
    testTimers = {
      asdf1234: {
        id: 'asdf1234',
        title: 'Help someone do something',
        customer: 'Butts Fixtures',
        type: 'Advisory',
        minutes: 0,
        date: '2019-07-17'
      },
      ff898gd: {
        id: 'ff898gd',
        title: 'Uhg, this is so ugly',
        customer: 'Ace Software',
        type: 'Code Review',
        task: '#22950',
        minutes: 27,
        date: '2019-12-25'
      },
      ff88t99er: {
        id: 'ff88t99er',
        title: 'I feel them crawling under my skin',
        customer: 'Butts Fixtures',
        type: 'General',
        task: '#22953',
        bugFound: true,
        startTime: 188359,
        minutes: 42,
        date: '2019-12-25'
      },
      '1849gasdf': {
        id: '1849gasdf',
        title: 'Help someone do something',
        customer: 'Jim and John',
        type: 'Advisory',
        minutes: 93,
        date: '2019-11-19'
      },
      '9940295kf': {
        id: '9940295kf',
        title: 'Help someone do something',
        customer: 'Ace Software',
        type: 'Advisory',
        minutes: 93,
        date: '2019-11-19'
      }
    };
  }
});
