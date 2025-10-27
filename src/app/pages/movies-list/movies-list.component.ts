import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private moviesService: MoviesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.moviesService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
      },
      error: (err) => {
        console.error('Error al obtener películas', err);
      }
    });
  }

  openDetail(movie: Movie) {
    const dialogRef = this.dialog.open(MovieDetailsComponent, {
      width: '400px',
      data: movie
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.moviesService.getMovies().subscribe({
          next: (data) => {
            this.movies = data;
          },
          error: (err) => {
            console.error('Error al obtener películas', err);
          }
        });
      }
    });
  }
}
