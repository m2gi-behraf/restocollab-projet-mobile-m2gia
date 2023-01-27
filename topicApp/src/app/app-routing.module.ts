import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'topic-details/:id',
    loadChildren: () => import('./pages/topic-details/topic-details.module').then(m => m.TopicDetailsPageModule)
  },
  {
    path: 'post-details/:id',
    loadChildren: () => import('./pages/post-details/post-details.module').then(m => m.PostDetailsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
