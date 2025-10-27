import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesListComponent } from './movies-list.component';
import { MoviesService } from 'src/app/services/movies.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('MoviesListComponent', () => {
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;
  let moviesServiceMock: any;
  let matDialogMock: any;

  beforeEach(async () => {
    moviesServiceMock = {
      getMovies: jasmine.createSpy('getMovies').and.returnValue(
        of([
          { id: 1, title: 'Test Movie', gen: 'Action', year: 2020, rating: 8, image: 'http://example.com', platforms: [] }
        ])
      )
    };

    matDialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(null)
      })
    };

    await TestBed.configureTestingModule({
      declarations: [MoviesListComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceMock },
        { provide: MatDialog, useValue: matDialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies on init', () => {
    expect(moviesServiceMock.getMovies).toHaveBeenCalled();
    expect(component.movies.length).toBe(1);
    expect(component.movies[0].title).toBe('Test Movie');
  });

  it('should open detail dialog', () => {
    const movie = component.movies[0];
    component.openDetail(movie);
    expect(matDialogMock.open).toHaveBeenCalled();
  });
});
