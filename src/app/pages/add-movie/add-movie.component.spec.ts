import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMovieComponent } from './add-movie.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoviesService } from 'src/app/services/movies.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MoviesServiceMock {
  addMovie = jasmine.createSpy('addMovie');
  getNextId = jasmine.createSpy('getNextId').and.returnValue(123); // <- agregado
}

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

class MatSnackBarMock {
  open = jasmine.createSpy('open');
}

describe('AddMovieComponent', () => {
  let component: AddMovieComponent;
  let fixture: ComponentFixture<AddMovieComponent>;
  let moviesService: MoviesServiceMock;
  let router: RouterMock;
  let snackBar: MatSnackBarMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMovieComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MoviesService, useClass: MoviesServiceMock },
        { provide: Router, useClass: RouterMock },
        { provide: MatSnackBar, useClass: MatSnackBarMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMovieComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService) as any;
    router = TestBed.inject(Router) as any;
    snackBar = TestBed.inject(MatSnackBar) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched if invalid on submit', () => {
    component.movieForm.controls['title'].setValue('');
    component.onSubmit();
    expect(component.movieForm.touched).toBeTrue();
    expect(moviesService.addMovie).not.toHaveBeenCalled();
  });

  it('should add movie and navigate if form is valid', () => {
    component.movieForm.setValue({
      title: 'Test Movie',
      gen: 'Action',
      year: 2020,
      rating: 8,
      image: '',
      platforms: 'Netflix,HBO'
    });
    component.onSubmit();
    expect(moviesService.getNextId).toHaveBeenCalled();
    expect(moviesService.addMovie).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 123,
      title: 'Test Movie'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('should cancel and navigate to /', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should validate optionalUrlValidator correctly', () => {
    const imageControl = component.movieForm.controls['image'];

    imageControl.setValue('');
    expect(imageControl.valid).toBeTrue();

    imageControl.setValue('https://test.com');
    expect(imageControl.valid).toBeTrue();

    imageControl.setValue('notaurl');
    expect(imageControl.valid).toBeFalse();
  });
});
