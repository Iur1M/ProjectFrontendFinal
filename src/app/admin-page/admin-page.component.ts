import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent {
  private movieUrl = 'https://localhost:7220/api/movie';
  private commentUrl = 'https://localhost:7220/api/comments';
  private userUrl = 'https://localhost:7220/api/users';

  tab: 'add' | 'movies' | 'comments' | 'users' = 'add';

  movies: any[] = [];
  comments: any[] = [];
  users: any[] = [];
  directors: string[] = [];
  filteredDirectors: string[] = [];
  showDropdown: boolean = false;

  genres = [
    'Action',
    'Drama',
    'Comedy',
    'Thriller',
    'Horror',
    'Sci-Fi',
    'Fantasy',
    'Romance',
    'Crime',
    'Animation',
  ];

  movie = {
    title: '',
    year: new Date().getFullYear(),
    rating: 0,
    director: '',
    genre: '',
    posterUrl: '',
    trailerUrl: '',
    description: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadMovies();
    this.loadDirectors();
  }

  setTab(tab: any) {
    this.tab = tab;

    if (tab === 'movies') this.loadMovies();
    if (tab === 'comments') this.loadComments();
    if (tab === 'users') this.loadUsers();
  }

  loadMovies() {
    this.http.get<any>(this.movieUrl).subscribe((res) => {
      this.movies = res.items ?? res;
    });
  }

  addMovie() {
    this.http.post(this.movieUrl, this.movie).subscribe(() => {
      this.loadMovies();
      this.resetForm();
    });
  }

  updateMovie(movie: any) {
    this.http.put(`${this.movieUrl}/${movie.id}`, movie).subscribe(() => {
      alert('Updated');
    });
  }

  deleteMovie(id: number) {
    if (!confirm('Delete movie?')) return;

    this.http.delete(`${this.movieUrl}/${id}`).subscribe(() => {
      this.movies = this.movies.filter((m) => m.id !== id);
    });
  }

  goToMovie(id: number) {
    this.router.navigate(['/movies', id]);
  }

  loadComments() {
    this.http.get<any[]>(`${this.commentUrl}/all`).subscribe((res) => {
      this.comments = res;
    });
  }

  deleteComment(id: number) {
    this.http.delete(`${this.commentUrl}/${id}`).subscribe(() => {
      this.comments = this.comments.filter((c) => c.id !== id);
    });
  }

  loadUsers() {
    this.http.get<any>('https://localhost:7220/api/users/all').subscribe({
      next: (res) => (this.users = res),
      error: (err) => console.error(err),
    });
  }

  banUser(id: string) {
    if (!confirm('Ban this user?')) return;

    this.http.delete(`https://localhost:7220/api/users/${id}`).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
      },
      error: (err) => alert(err.error?.message || 'Delete failed'),
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
      description: '',
    };
  }

  loadDirectors() {
    this.http.get<string[]>(`${this.movieUrl}/directors`).subscribe((res) => {
      this.directors = res;
      this.filteredDirectors = res;
    });
  }

  filterDirectors() {
  const value = this.movie.director?.toLowerCase() || '';

  this.filteredDirectors = this.directors.filter(d =>
    d.toLowerCase().includes(value)
  );
}

onFocus() {
  this.showDropdown = true;
  this.filteredDirectors = this.directors;
}

selectDirector(director: string) {
  this.movie.director = director;
  this.showDropdown = false;
}

hideDropdown() {
  setTimeout(() => {
    this.showDropdown = false;
  }, 200);
}
}
