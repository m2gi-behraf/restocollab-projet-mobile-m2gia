import { NgModule } from '@angular/core';
import {HeaderComponent} from "./header.component";
import {IonicModule} from "@ionic/angular";

@NgModule({
  imports: [
    IonicModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [HeaderComponent]
})
export class HeaderModule {}
