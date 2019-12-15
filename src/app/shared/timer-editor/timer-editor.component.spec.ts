import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';

import { TimerEditorComponent } from './timer-editor.component';
import { createOverlayControllerMock } from '@test/mocks';

describe('TimerEditorComponent', () => {
  let component: TimerEditorComponent;
  let fixture: ComponentFixture<TimerEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [provideMockStore(), { provide: ModalController, useFactory: () => createOverlayControllerMock() }]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
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
  });
});
