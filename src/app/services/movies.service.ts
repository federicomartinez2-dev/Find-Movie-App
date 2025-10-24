import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private defaultMovies = [
    {
      id: 1,
      title: 'Inception',
      gen: 'Sci-Fi',
      year: 2010,
      rating: 8.8,
      image: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg',
      platforms: ['Netflix', 'Amazon Prime', 'HBO Max']
    },
    {
      id: 2,
      title: 'The Dark Knight',
      gen: 'Action',
      year: 2008,
      rating: 9.0,
      image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      platforms: ['HBO Max', 'Disney+']
    },
    {
      id: 3,
      title: 'Interstellar',
      gen: 'Adventure',
      year: 2014,
      rating: 8.6,
      image: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      platforms: ['Netflix', 'HBO Max']
    },
    {
      id: 4,
      title: 'Inside Out 2',
      gen: 'Comedy',
      year: 2024,
      rating: 9.6,
      image: 'https://images.squarespace-cdn.com/content/v1/540c1c1ce4b08734f6c2f42f/1721930375337-4B6QHQK3LUIP9IDLA06R/ANALIZANDO+LA+PELICULA+INSIDE+OUT+2.jpeg?format=1000w',
      platforms: ['Netflix', 'HBO Max']
    }
  ];

  private movies: Movie[] = [];

  constructor() {
    const saved = localStorage.getItem('movies');
    this.movies = saved ? JSON.parse(saved) : [...this.defaultMovies];
  }

  getMovies(): Movie[] {
    return this.movies;
  }

  deleteMovie(movieId: number): void {
    this.movies = this.movies.filter(m => m.id !== movieId);
    this.saveToStorage();
  }

  updateMovie(updatedMovie: Movie): void {
    const index = this.movies.findIndex(m => m.id === updatedMovie.id);
    if (index !== -1) {
      this.movies[index] = { ...updatedMovie };
    }
    this.saveToStorage();
  }

  getNextId(): number {
    return this.movies.length ? Math.max(...this.movies.map(m => m.id)) + 1 : 1;
  }

  addMovie(movie: Movie): void {
    this.movies.push(movie);
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('movies', JSON.stringify(this.movies));
  }
}
