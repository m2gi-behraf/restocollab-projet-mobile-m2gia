import { NgModule } from '@angular/core';
import {HeaderComponent} from "./header.component";
import {IonicModule} from "@ionic/angular";
import {NgIf} from "@angular/common";

@NgModule({
    imports: [
        IonicModule,
        NgIf
    ],
  exports: [
    HeaderComponent
  ],
  declarations: [HeaderComponent]
})
export class HeaderModule {}
