import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Timer } from '@app/models';
import { TimersState } from '@app/store/timer/reducer';
import { IonicModule } from '@ionic/angular';
import { Dictionary } from '@ngrx/entity';
import { provideMockStore } from '@ngrx/store/testing';
import { HoursPipeModule } from '../hours/hours.module';
import { InfoItemComponentModule } from '../info-item/info-item.module';
import { CustomerTaskSummaryComponent } from './customer-task-summary.component';

describe('CustomerTaskSummaryComponent', () => {
  let component: CustomerTaskSummaryComponent;
  let fixture: ComponentFixture<CustomerTaskSummaryComponent>;

  let testTimers: Dictionary<Timer>;
  let testTimerIds: Array<string>;

  beforeEach(
    waitForAsync(() => {
      initializeTestData();
      TestBed.configureTestingModule({
        declarations: [CustomerTaskSummaryComponent],
        imports: [IonicModule, HoursPipeModule, InfoItemComponentModule],
        providers: [
          provideMockStore<{ timers: TimersState }>({
            initialState: {
              timers: {
                ids: testTimerIds,
                entities: testTimers,
                loading: false,
              },
            },
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CustomerTaskSummaryComponent);
      component = fixture.componentInstance;
    }),
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  [
    { id: 'aw132', type: 'Advisory', minutes: 105 },
    { id: 'aw132', type: 'Consulting', minutes: 0 },
    { id: '1143we', type: 'Code Review', minutes: 180 },
    { id: 'bogus', type: 'Advisory', minutes: 0 },
    { id: 'bogus', type: undefined, minutes: 0 },
    { id: 'aw132', type: undefined, minutes: 150 },
  ].forEach(test =>
    it(`gets the minutes for ${test.id}, ${test.type}`, () => {
      let minutes: number;
      component.customerId = test.id;
      component.taskType = test.type;
      fixture.detectChanges();
      component.minutes$.subscribe(m => (minutes = m));
      expect(minutes).toEqual(test.minutes);
    }),
  );

  [
    { id: 'aw132', type: 'Advisory', count: 2 },
    { id: 'aw132', type: 'Consulting', count: 0 },
    { id: '1143we', type: 'Code Review', count: 1 },
    { id: 'bogus', type: 'Advisory', count: 0 },
    { id: 'bogus', type: undefined, count: 0 },
    { id: 'aw132', type: undefined, count: 3 },
  ].forEach(test =>
    it(`gets the count for ${test.id}, ${test.type}`, () => {
      let count: number;
      component.customerId = test.id;
      component.taskType = test.type;
      fixture.detectChanges();
      component.count$.subscribe(c => (count = c));
      expect(count).toEqual(test.count);
    }),
  );

  const initializeTestData = () => {
    testTimerIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf'];
    testTimers = {
      'asdf1234': {
        id: 'asdf1234',
        title: 'I am a newly added timer',
        type: 'Advisory',
        minutes: 30,
        date: '2019-11-25',
        customerId: 'aw132',
        customerName: 'A & W',
      },
      'ff898gd': {
        id: 'ff898gd',
        title: 'I am another newly added timer',
        type: 'Code Review',
        minutes: 180,
        date: '2019-11-26',
        customerId: '1143we',
        customerName: 'Amys Arts',
      },
      'ff88t99er': {
        id: 'ff88t99er',
        title: 'it is all ok',
        type: 'Advisory',
        minutes: 75,
        date: '2019-11-25',
        customerId: 'aw132',
        customerName: 'A & W',
      },
      '1849gasdf': {
        id: '1849gasdf',
        title: 'stuff needs review',
        type: 'Code Review',
        minutes: 45,
        date: '2019-11-27',
        customerId: 'aw132',
        customerName: 'A & W',
      },
    };
  };
});
