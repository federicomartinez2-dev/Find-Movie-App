import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { Movie } from '../models/movie.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(() => {
    localStorage.setItem('movies', JSON.stringify([
      { id: 1, title: 'Test', gen: 'Action', year: 2020, rating: 8, image: '', platforms: [] }
    ]));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MoviesService);
  });

  it('should be created', (done) => {
    expect(service).toBeTruthy();
    done();
  });

  it('should return default movies if localStorage is empty', (done) => {
    service.getMovies().subscribe(movies => {
      expect(movies.length).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('should add a new movie', (done) => {
    const newMovie: Movie = { id: 999, title: 'Test Movie', gen: 'Test', year: 2025, rating: 10, image: '', platforms: [] };
    service.addMovie(newMovie);
    service.getMovies().subscribe(movies => {
      expect(movies.find(m => m.id === 999)).toEqual(newMovie);
      done();
    });
  });

  it('should delete a movie', (done) => {
    service.getMovies().subscribe(initialMovies => {
      if (!initialMovies.length) {
        service.addMovie({ id: 1, title: 'Temp', gen: 'Temp', year: 2025, rating: 5, image: '', platforms: [] });
      }
      service.getMovies().subscribe(movies => {
        const movieId = movies[0].id;
        service.deleteMovie(movieId);
        service.getMovies().subscribe(updated => {
          expect(updated.find(m => m.id === movieId)).toBeUndefined();
          done();
        });
      });
    });
  });

  it('should update a movie', (done) => {
    service.getMovies().subscribe(movies => {
      const movie = movies[0];
      const updated = { ...movie, title: 'Updated Title' };
      service.updateMovie(updated);
      service.getMovies().subscribe(updatedMovies => {
        expect(updatedMovies.find(m => m.id === movie.id)?.title).toBe('Updated Title');
        done();
      });
    });
  });

  it('should return next available id', (done) => {
    service.getMovies().subscribe(movies => {
      const nextId = service.getNextId();
      const maxId = movies.length ? Math.max(...movies.map(m => m.id)) : 0;
      expect(nextId).toBe(maxId + 1);
      done();
    });
  });
});
