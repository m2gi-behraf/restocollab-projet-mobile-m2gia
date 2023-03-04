import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'topic',
    pathMatch: 'full'
  },
  {
    path: 'topic',
    loadComponent: () => import('./pages/topic/topic.page').then( m => m.TopicPage)
  },
  {
    path: 'topic/:topicId',
    loadComponent: () => import('./pages/topic-details/topic-details.page').then( m => m.TopicDetailsPage)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }