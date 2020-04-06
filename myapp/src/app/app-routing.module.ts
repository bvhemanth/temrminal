import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkerplaceComponent } from './markerplace/markerplace.component';

const routes: Routes = [
  { path: '**', component: MarkerplaceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
