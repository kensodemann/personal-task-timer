import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';

import { TimerEditorComponent } from './timer-editor.component';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { TaskTypeState } from '@app/store/reducers/task-type/task-type.reducer';
import { Store } from '@ngrx/store';
import { create, update } from '@app/store/actions/timer.actions';

describe('TimerEditorComponent', () => {
  let component: TimerEditorComponent;
  let modal;
  let fixture: ComponentFixture<TimerEditorComponent>;

  beforeEach(async(() => {
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [TimerEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        provideMockStore<{ taskTypes: TaskTypeState }>({
          initialState: { taskTypes: { taskTypes: ['Architecture Review', 'Code Review', 'Working Session'] } }
        }),
        { provide: ModalController, useFactory: () => createOverlayControllerMock(modal) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerEditorComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    describe('without a specified timer', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('subscribes to the task types', () => {
        let taskTypes: Array<string>;
        component.taskTypes$.subscribe(t => (taskTypes = t));
        expect(taskTypes).toEqual(['Architecture Review', 'Code Review', 'Working Session']);
      });

      it('sets the editor title', () => {
        expect(component.editorTitle).toEqual('Create Timer');
      });

      it('sets the minutes to zero', () => {
        expect(component.minutes).toEqual(0);
      });

      it('enable minute editing', () => {
        expect(component.disableMinutes).toEqual(false);
      });
    });

    describe('with a specified timer', () => {
      beforeEach(() => {
        component.timer = {
          id: '40049503950',
          customer: 'Ace Software',
          title: 'Stuff is not working',
          task: '239945',
          type: 'Consulting',
          date: '2019-12-23',
          minutes: 32
        };
        fixture.detectChanges();
      });

      it('subscribes to the task types', () => {
        let taskTypes: Array<string>;
        component.taskTypes$.subscribe(t => (taskTypes = t));
        expect(taskTypes).toEqual(['Architecture Review', 'Code Review', 'Working Session']);
      });

      it('enable minute editing', () => {
        expect(component.disableMinutes).toEqual(false);
      });

      it('sets the editor title', () => {
        expect(component.editorTitle).toEqual('Update Timer');
      });

      it('sets the customer', () => {
        expect(component.customer).toEqual('Ace Software');
      });

      it('sets the title', () => {
        expect(component.title).toEqual('Stuff is not working');
      });

      it('sets the task ID', () => {
        expect(component.taskId).toEqual('239945');
      });

      it('sets the task type', () => {
        expect(component.taskType).toEqual('Consulting');
      });

      it('sets the minutes', () => {
        expect(component.minutes).toEqual(32);
      });
    });

    describe('with a running timer', () => {
      beforeEach(() => {
        component.timer = {
          id: '40049503950',
          customer: 'Ace Software',
          title: 'Stuff is not working',
          task: '239945',
          type: 'Consulting',
          date: '2019-12-23',
          minutes: 32,
          startTime: 12341234
        };
        fixture.detectChanges();
      });

      it('disables minute editing', () => {
        expect(component.disableMinutes).toEqual(true);
      });
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('dismisses the modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    describe('for create', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('dispatches a create action', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        (store.dispatch as any).mockRestore();
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customer = 'Ace Software';
        component.title = 'Stuff is not working';
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
              minutes: 32,
              startTime: null
            }
          })
        );
        (store.dispatch as any).mockRestore();
        (Date.now as any).mockRestore();
      });

      it('sets the task to null if there is no taskId', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.customer = 'Ace Software';
        component.title = 'Stuff is not working';
        component.taskType = 'Consulting';
        component.minutes = 32;
        Date.now = jest.fn(() => 1577102400000);
        component.save();
        expect(store.dispatch).toHaveBeenCalledWith(
          create({
            timer: {
              customer: 'Ace Software',
              title: 'Stuff is not working',
              type: 'Consulting',
              date: '2019-12-23',
              minutes: 32,
              startTime: null,
              task: null
            }
          })
        );
        (store.dispatch as any).mockRestore();
        (Date.now as any).mockRestore();
      });
    });

    describe('for update', () => {
      beforeEach(() => {
        component.timer = {
          id: '40049503950',
          customer: 'Butts and Nuts',
          title: 'Whatever',
          task: '384953',
          type: 'Code Review',
          date: '2019-12-29',
          startTime: 189843123489,
          minutes: 14
        };
        fixture.detectChanges();
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('dispatches a create action', () => {
        const store = TestBed.inject(Store);
        store.dispatch = jest.fn();
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        (store.dispatch as any).mockRestore();
      });

      it('passes the entered data', () => {
        const store = TestBed.inject(Store);
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
          update({
            timer: {
              id: '40049503950',
              customer: 'Ace Software',
              title: 'Stuff is not working',
              task: '239945',
              type: 'Consulting',
              date: '2019-12-29',
              startTime: 189843123489,
              minutes: 32
            }
          })
        );
        (store.dispatch as any).mockRestore();
        (Date.now as any).mockRestore();
      });
    });
  });
});
