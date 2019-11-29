import { Component } from '@angular/core';
import { version } from '@app/default-data/version';
import { Version } from '@app/models/version';

@Component({
  selector: 'app-tab3',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  appVersion: Version = version;
  constructor() {}
}
