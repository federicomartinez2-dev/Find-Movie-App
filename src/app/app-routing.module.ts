import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesListComponent } from './pages/movies-list/movies-list.component';
import { AddMovieComponent } from './pages/add-movie/add-movie.component';

const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'movies', component: MoviesListComponent },
  { path: 'add-movie', component: AddMovieComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
