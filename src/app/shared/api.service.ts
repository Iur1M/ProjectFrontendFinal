import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://localhost:7220/api/movie';

  constructor(private http: HttpClient) {}

  getMovies(
    search?: string,
    sortBy?: string,
    desc: boolean = false,
    year?: number,
    genre?: string
  ) {
    let params = new HttpParams().set('pageSize', '50');

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    if (sortBy) {
      params = params
        .set('sortBy', sortBy)
        .set('desc', desc.toString());
    }

    if (year) {
      params = params.set('year', year.toString());
    }

    if (genre) {
      params = params.set('genre', genre);
    }

    return this.http.get<any>(this.baseUrl, { params });
  }

  getMovieById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
