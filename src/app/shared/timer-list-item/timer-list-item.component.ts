import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Timer } from '@app/models/timer';

@Component({
  selector: 'app-timer-list-item',
  templateUrl: './timer-list-item.component.html',
  styleUrls: ['./timer-list-item.component.scss']
})
export class TimerListItemComponent {
  @Input() timer: Timer;
  @Output() edit: EventEmitter<Timer>;
  @Output() delete: EventEmitter<Timer>;
  @Output() toggle: EventEmitter<Timer>;

  constructor() {
    this.edit = new EventEmitter();
    this.delete = new EventEmitter();
    this.toggle = new EventEmitter();
  }
}
