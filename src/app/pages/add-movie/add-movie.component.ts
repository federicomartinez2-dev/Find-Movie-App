import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MoviesService } from 'src/app/services/movies.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const optionalUrlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value?.trim();
  if (!value) return null;

  const urlPattern =
    /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  return urlPattern.test(value) ? null : { invalidUrl: true };
};

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss']
})
export class AddMovieComponent {
  movieForm: FormGroup;
  currentYear = new Date().getFullYear();


  constructor(
    private fb: FormBuilder,
    private moviesService: MoviesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      gen: ['', Validators.required],
      year: [this.currentYear, [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      image: ['', optionalUrlValidator],
      platforms: ['']
    });
  }

  onSubmit() {
    if (this.movieForm.valid) {
      const formValue = this.movieForm.value;
      const newMovie = {
        id: Date.now(),
        title: formValue.title,
        gen: formValue.gen,
        year: formValue.year,
        rating: formValue.rating,
        image: formValue.image || '',
        platforms: formValue.platforms
          ? formValue.platforms.split(',').map((p: string) => p.trim())
          : []
      };
      this.moviesService.addMovie(newMovie);
      this.router.navigate(['/']);
      this.snackBar.open('Movie added successfully!', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    } else {
      this.movieForm.markAllAsTouched();
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  get title() { return this.movieForm.get('title')!; }
  get gen() { return this.movieForm.get('gen')!; }
  get year() { return this.movieForm.get('year')!; }
  get rating() { return this.movieForm.get('rating')!; }
  get platforms() { return this.movieForm.get('platforms')!; }
  get image() { return this.movieForm.get('image')!; }
}
