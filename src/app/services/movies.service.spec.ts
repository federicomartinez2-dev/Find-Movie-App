import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { Movie } from '../models/movie.model';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default movies if localStorage is empty', () => {
    const movies = service.getMovies();
    expect(movies.length).toBeGreaterThan(0);
  });

  it('should add a new movie', () => {
    const newMovie: Movie = { id: 999, title: 'Test Movie', gen: 'Test', year: 2025, rating: 10, image: '', platforms: [] };
    service.addMovie(newMovie);
    const movies = service.getMovies();
    expect(movies.find(m => m.id === 999)).toEqual(newMovie);
  });

  it('should delete a movie', () => {
    const movieId = service.getMovies()[0].id;
    service.deleteMovie(movieId);
    const movies = service.getMovies();
    expect(movies.find(m => m.id === movieId)).toBeUndefined();
  });

  it('should update a movie', () => {
    const movie = service.getMovies()[0];
    const updated = { ...movie, title: 'Updated Title' };
    service.updateMovie(updated);
    const movies = service.getMovies();
    expect(movies.find(m => m.id === movie.id)?.title).toBe('Updated Title');
  });

  it('should return next available id', () => {
    const nextId = service.getNextId();
    const maxId = Math.max(...service.getMovies().map(m => m.id));
    expect(nextId).toBe(maxId + 1);
  });
});
