import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'test-page',
    pathMatch: 'full'
  },
  {
    path: 'test-page',
    loadChildren: () => import('./pages/test-page/test-page.module').then( m => m.TestPagePageModule)
  },
  {
    path: 'test2-page',
    loadChildren: () => import('./pages/test2-page/test2-page.module').then( m => m.Test2PagePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
