import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDetailsPageRoutingModule } from './post-details-routing.module';

import { PostDetailsPage } from './post-details.page';
import { EditPostComponent } from 'src/app/modals/edit-post/edit-post.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PostDetailsPageRoutingModule,
  ],
  declarations: [PostDetailsPage, EditPostComponent]
})
export class PostDetailsPageModule {}
