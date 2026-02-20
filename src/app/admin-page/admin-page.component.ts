import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  director: string;
  genre: string;
  posterUrl: string;
  trailerUrl?: string;
  description: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  private baseUrl = 'https://localhost:7220/api/movie';

  movies: Movie[] = [];

  genres: string[] = [
    'Action',
    'Drama',
    'Comedy',
    'Thriller',
    'Horror',
    'Sci-Fi',
    'Fantasy',
    'Romance',
    'Crime',
    'Animation'
  ];

  movie = {
    title: '',
    year: new Date().getFullYear(),
    rating: 0,
    director: '',
    genre: '',
    posterUrl: '',
    trailerUrl: '',
    description: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
    this.http.get<any>(this.baseUrl).subscribe(res => {
      this.movies = res.items ?? res;
    });
  }

  addMovie() {
    this.http.post(this.baseUrl, this.movie).subscribe({
      next: () => {
        this.loadMovies();
        this.resetForm();
      },
      error: err => alert(err.error?.message || 'Failed to add movie')
    });
  }

  deleteMovie(id: number) {
    if (!confirm('Delete this movie?')) return;

    this.http.delete(`${this.baseUrl}/${id}`).subscribe({
      next: () => this.movies = this.movies.filter(m => m.id !== id),
      error: err => alert(err.error?.message || 'Delete failed')
    });
  }

  private resetForm() {
    this.movie = {
      title: '',
      year: new Date().getFullYear(),
      rating: 0,
      director: '',
      genre: '',
      posterUrl: '',
      trailerUrl: '',
      description: ''
    };
  }
}