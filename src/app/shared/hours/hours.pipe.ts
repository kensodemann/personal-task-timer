import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours'
})
export class HoursPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (value !== undefined) {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
  }
}
