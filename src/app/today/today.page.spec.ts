import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodayPage } from './today.page';
import { TimerListItemComponentModule } from '@app/shared/timer-list-item/timer-list-item.module';

describe('TodayPage', () => {
  let component: TodayPage;
  let fixture: ComponentFixture<TodayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TodayPage],
      imports: [IonicModule.forRoot(), TimerListItemComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
