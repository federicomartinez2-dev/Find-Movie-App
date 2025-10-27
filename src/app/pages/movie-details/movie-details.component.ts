import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Movie } from '../../models/movie.model';
import { MoviesService } from 'src/app/services/movies.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  editMode = false;
  editedData!: Movie;
  platformsString: string = '';
  currentYear: number = new Date().getFullYear();
  yearInvalid = false;
  ratingInvalid = false;
  urlInvalid = false;

  constructor(
    public dialogRef: MatDialogRef<MovieDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie,
    private moviesService: MoviesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.editedData = { ...this.data, platforms: [...this.data.platforms] };
    this.platformsString = this.editedData.platforms.join(', ');
  }

  close() {
    this.dialogRef.close();
  }

  toggleEdit() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.editedData = { ...this.data, platforms: [...this.data.platforms] };
      this.platformsString = this.editedData.platforms.join(', ');
    } else {
      this.platformsString = this.data.platforms.join(', ');
    }
  }

  clearValidation() {
    this.yearInvalid = false;
    this.ratingInvalid = false;
    this.urlInvalid = false;
  }

  validate(): boolean {
    let valid = true;
    this.clearValidation();

    if (this.editedData.year < 1900 || this.editedData.year > this.currentYear) {
      this.yearInvalid = true;
      valid = false;
    }

    if (this.editedData.rating < 0 || this.editedData.rating > 10) {
      this.ratingInvalid = true;
      valid = false;
    }

    try {
      new URL(this.editedData.image);
    } catch (_) {
      this.urlInvalid = true;
      valid = false;
    }

    return valid;
  }

  save() {
    if (!this.validate()) return;

    this.editedData.platforms = this.platformsString.split(',').map(p => p.trim());
    Object.assign(this.data, this.editedData);

    this.moviesService.updateMovie(this.data);

    this.editMode = false;
    this.snackBar.open('Movie updated successfully!', '', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  deleteMovie() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete the movie?' }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.moviesService.deleteMovie(this.data.id);

        this.dialogRef.close('deleted');
        this.snackBar.open('Movie deleted successfully!', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}
