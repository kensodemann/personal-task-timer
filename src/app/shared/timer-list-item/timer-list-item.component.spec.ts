import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimerListItemComponent } from './timer-list-item.component';

describe('TimerListItemComponent', () => {
  let component: TimerListItemComponent;
  let fixture: ComponentFixture<TimerListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerListItemComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerListItemComponent);
    component = fixture.componentInstance;
    component.timer = {
      title: 'foo',
      customer: 'bar',
      type: 'Code Review',
      minutes: 120
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
