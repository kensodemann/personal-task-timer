import { Component, Input } from '@angular/core';
import { Timer } from '@app/models/timer';

@Component({
  selector: 'app-timer-list-item',
  templateUrl: './timer-list-item.component.html',
  styleUrls: ['./timer-list-item.component.scss']
})
export class TimerListItemComponent {
  @Input() timer: Timer;

  buttonClicked() {
    console.log('Button Clicked');
  }

  labelClicked() {
    console.log('Label Clicked');
  }
}
