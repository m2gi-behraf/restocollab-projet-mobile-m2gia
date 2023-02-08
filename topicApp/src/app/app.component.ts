import { Component, EnvironmentInjector, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <ion-app>
    <ion-router-outlet [environmentInjector]="environmentInjector"></ion-router-outlet>
  </ion-app>
  `,
  styles: [],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);
}
