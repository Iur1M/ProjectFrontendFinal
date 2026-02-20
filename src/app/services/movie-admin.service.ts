import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MovieAdminService {
  private baseUrl = 'https://localhost:7220/api/movie';

  constructor(private http: HttpClient) {}

  addMovie(movie: any) {
    return this.http.post(this.baseUrl, movie);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
