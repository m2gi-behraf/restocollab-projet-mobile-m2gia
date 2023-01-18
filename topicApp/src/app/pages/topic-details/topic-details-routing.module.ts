import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopicDetailsPage } from './topic-details.page';

const routes: Routes = [
  {
    path: '',
    component: TopicDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicDetailsPageRoutingModule {}
