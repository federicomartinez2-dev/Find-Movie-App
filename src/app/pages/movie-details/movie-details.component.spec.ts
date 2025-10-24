import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailsComponent } from './movie-details.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoviesService } from 'src/app/services/movies.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<MovieDetailsComponent>>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['updateMovie', 'deleteMovie']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    matDialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);

    await TestBed.configureTestingModule({
      declarations: [MovieDetailsComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, title: 'Test Movie', gen: 'Action', year: 2020, rating: 8, platforms: ['Netflix'], image: 'http://example.com' } },
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle editMode', () => {
    expect(component.editMode).toBeFalse();
    component.toggleEdit();
    expect(component.editMode).toBeTrue();
    component.toggleEdit();
    expect(component.editMode).toBeFalse();
  });

  it('should close the dialog', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should validate correctly', () => {
    expect(component.validate()).toBeTrue();
    component.editedData.year = 1800;
    expect(component.validate()).toBeFalse();
    component.editedData.year = 2020;
    component.editedData.rating = 20;
    expect(component.validate()).toBeFalse();
    component.editedData.rating = 8;
    component.editedData.image = 'invalid-url';
    expect(component.validate()).toBeFalse();
  });

  it('should save if valid', () => {
    component.save();
    expect(moviesServiceSpy.updateMovie).toHaveBeenCalledWith(component.data);
    expect(snackBarSpy.open).toHaveBeenCalled();
    expect(component.editMode).toBeFalse();
  });

  it('should delete movie if confirmed', () => {
    component.deleteMovie();
    expect(moviesServiceSpy.deleteMovie).toHaveBeenCalledWith(component.data.id);
    expect(dialogRefSpy.close).toHaveBeenCalledWith('deleted');
    expect(snackBarSpy.open).toHaveBeenCalled();
  });
});
