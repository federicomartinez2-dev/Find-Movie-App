import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private apiUrl = 'https://streaming-availability.p.rapidapi.com/shows/search/filters';
  private headers = new HttpHeaders({
    'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
    'x-rapidapi-key': 'c7103b1bd8mshd439473b66795c4p121ee1jsn0ef232ba7d86'
  });

  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  movies$ = this.moviesSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('movies');
    this.moviesSubject.next(saved ? JSON.parse(saved) : []);
  }

  getMovies(): Observable<Movie[]> {
    const saved = localStorage.getItem('movies');
    if (saved) {
      this.moviesSubject.next(JSON.parse(saved));
      return of(JSON.parse(saved));
    }

    const params = {
      country: 'us',
      series_granularity: 'show',
      order_direction: 'asc',
      order_by: 'original_title',
      genres_relation: 'and',
      output_language: 'en',
      show_type: 'movie'
    };

    return this.http.get<any>(this.apiUrl, { headers: this.headers, params }).pipe(
      map(response => {
        if (!response || !response.shows) return [];

        const movies: Movie[] = response.shows.map((s: any) => {
          const poster = s.imageSet?.verticalPoster;
          const image = poster?.w720 || poster?.w600 || poster?.w480 || poster?.w360 || '';
          const gen = Array.isArray(s.genres) ? s.genres.map((g: any) => g.name).join(', ') : 'N/A';

          const streaming = s.streamingOptions || {};
          const platformsSet = new Set<string>();
          Object.keys(streaming).forEach(countryKey => {
            const countryStreams = streaming[countryKey];
            if (Array.isArray(countryStreams)) {
              countryStreams.forEach(opt => {
                if (opt.service?.name) platformsSet.add(opt.service.name);
              });
            }
          });
          const platforms = Array.from(platformsSet);

          return {
            id: +s.id,
            title: s.title || s.originalTitle || 'Untitled',
            gen,
            year: s.releaseYear || 0,
            rating: (s.rating || 0) / 10,
            image,
            platforms
          } as Movie;
        });

        this.moviesSubject.next(movies);
        this.saveToStorage(movies);
        return movies;
      }),
      catchError(err => {
        console.warn('Fallo la API, usando data local', err);
        const saved = localStorage.getItem('movies');
        const fallback = saved ? JSON.parse(saved) : [];
        this.moviesSubject.next(fallback);
        return of(fallback);
      })
    );
  }

  deleteMovie(movieId: number): void {
    const updated = this.moviesSubject.value.filter(m => m.id !== movieId);
    this.moviesSubject.next(updated);
    this.saveToStorage(updated);
  }

  updateMovie(updatedMovie: Movie): void {
    const updated = this.moviesSubject.value.map(m => m.id === updatedMovie.id ? { ...updatedMovie } : m);
    this.moviesSubject.next(updated);
    this.saveToStorage(updated);
  }

  addMovie(movie: Movie): void {
    const updated = [...this.moviesSubject.value, movie];
    this.moviesSubject.next(updated);
    this.saveToStorage(updated);
  }

  getNextId(): number {
    const movies = this.moviesSubject.value;
    return movies.length ? Math.max(...movies.map(m => m.id)) + 1 : 1;
  }

  private saveToStorage(movies: Movie[]) {
    localStorage.setItem('movies', JSON.stringify(movies));
  }
}
