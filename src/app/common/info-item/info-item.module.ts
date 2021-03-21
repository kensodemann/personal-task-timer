import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { InfoItemComponent } from './info-item.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [InfoItemComponent],
  entryComponents: [InfoItemComponent],
  exports: [InfoItemComponent],
})
export class InfoItemComponentModule {}
