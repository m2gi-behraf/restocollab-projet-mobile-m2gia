import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'topic',
    loadComponent: () => import('./pages/topic/topic.page').then( m => m.TopicPage)
  },
  {
    path: 'topic/:topicId',
    loadComponent: () => import('./pages/topic-details/topic-details.page').then( m => m.TopicDetailsPage)
  },
  {
    path: '',
    redirectTo: 'topic',
    pathMatch: 'full'
  }
];
