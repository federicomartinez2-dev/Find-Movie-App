import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesListComponent } from './movies-list.component';
import { MoviesService } from 'src/app/services/movies.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('MoviesListComponent', () => {
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['getMovies']);
    moviesServiceSpy.getMovies.and.returnValue([
      { id: 1, title: 'Test Movie', gen: 'Action', year: 2020, rating: 8, image: 'http://example.com', platforms: [] }
    ]);

    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);

    await TestBed.configureTestingModule({
      declarations: [MoviesListComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
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

  it('should populate movies on ngOnInit', () => {
    component.ngOnInit();
    expect(component.movies.length).toBe(1);
    expect(component.movies[0].title).toBe('Test Movie');
  });

  it('should open movie detail dialog', () => {
    const movie = component.movies[0];
    component.openDetail(movie);
    expect(matDialogSpy.open).toHaveBeenCalled();
  });

  it('should refresh movies if dialog returns deleted', () => {
    matDialogSpy.open.and.returnValue({ afterClosed: () => of('deleted') } as any);
    component.openDetail(component.movies[0]);
    expect(matDialogSpy.open).toHaveBeenCalled();
    expect(moviesServiceSpy.getMovies).toHaveBeenCalledTimes(2);
  });
});
