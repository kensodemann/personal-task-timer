import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';

import { TimerEditorComponent } from './timer-editor.component';
import { createOverlayControllerMock } from '@test/mocks';
import { TaskTypeState } from '@app/store/reducers/task-type/task-type.reducer';
import { Store } from '@ngrx/store';
import { selectAllTaskTypes } from '@app/store/selectors';
import { create } from '@app/store/actions/timer.actions';

describe('TimerEditorComponent', () => {
  let component: TimerEditorComponent;
  let fixture: ComponentFixture<TimerEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        provideMockStore<{ taskTypes: TaskTypeState }>({
          initialState: { taskTypes: { taskTypes: [] } }
        }),
        { provide: ModalController, useFactory: () => createOverlayControllerMock() }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('subscribes to the task types', () => {
    let taskTypes: Array<string>;
    component.taskTypes$.subscribe(t => (taskTypes = t));
    const store = TestBed.get(Store);
    store.overrideSelector(selectAllTaskTypes, ['Architecture Review', 'Code Review', 'Working Session']);
    store.refreshState();
    fixture.detectChanges();
    expect(taskTypes).toEqual(['Architecture Review', 'Code Review', 'Working Session']);
  });

  describe('close', () => {
    it('dismisses the modal', () => {
      const modalController = TestBed.get(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('dismisses the modal', () => {
      const modalController = TestBed.get(ModalController);
      component.save();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('dispatches a create action', () => {
      const store = TestBed.get(Store);
      store.dispatch = jest.fn();
      component.save();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      store.dispatch.mockRestore();
    });

    it('passes the entered data', () => {
      const store = TestBed.get(Store);
      store.dispatch = jest.fn();
      component.customer = 'Ace Software';
      component.title = 'Stuff is not working';
      component.taskId = '239945';
      component.taskId = '239945';
      component.taskType = 'Consulting';
      component.minutes = 32;
      Date.now = jest.fn(() => 1577102400000);
      component.save();
      expect(store.dispatch).toHaveBeenCalledWith(
        create({
          timer: {
            customer: 'Ace Software',
            title: 'Stuff is not working',
            task: '239945',
            type: 'Consulting',
            date: '2019-12-23',
            minutes: 32
          }
        })
      );
      store.dispatch.mockRestore();
      (Date.now as any).mockRestore();
    });
  });
});
