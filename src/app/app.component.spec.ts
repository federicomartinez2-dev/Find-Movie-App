import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should clear localStorage on init', () => {
    spyOn(localStorage, 'clear');
    component.ngOnInit();
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should update currentRoute on NavigationEnd', () => {
    const navEnd = new NavigationEnd(1, '/movies', '/movies');
    (router.events as any) = of(navEnd);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    expect(component.currentRoute).toBe('/movies');
  });

  it('should return true for movie list routes', () => {
    component.currentRoute = '/movies';
    expect(component.isMovieListRoute()).toBeTrue();

    component.currentRoute = '/';
    expect(component.isMovieListRoute()).toBeTrue();

    component.currentRoute = '/add-movie';
    expect(component.isMovieListRoute()).toBeFalse();
  });
});
