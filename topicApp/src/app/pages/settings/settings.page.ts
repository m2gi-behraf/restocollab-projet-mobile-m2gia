import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  settings: any = {
    appNotifications: true,
    emailNotifications: true,
    gpsLocation: true
  }

  constructor() {
  }

  ngOnInit() {
  }

  changeAppNotifications({ev}: { ev: any }) {
    this.settings.appNotifications = ev.detail.checked;
    console.log(this.settings);
  }

  changeEmailNotifications({ev}: { ev: any }) {
    this.settings.emailNotifications = ev.detail.checked;
    console.log(this.settings);
  }

  changeGPSPermission({ev}: { ev: any }) {
    this.settings.gpsLocation = ev.detail.checked;
    console.log(this.settings);
  }
}
