import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HoursPipe } from './hours.pipe';

@NgModule({
  declarations: [HoursPipe],
  exports: [HoursPipe],
  imports: [CommonModule]
})
export class HoursPipeModule {}
