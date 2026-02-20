import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.css']
})
export class MoviesPageComponent implements OnInit {
  movies: any[] = [];
  searchTerm = '';
  sortBy = '';
  desc = false;
  selectedYear?: number;
  selectedGenre?: string;

  years = [
    1960,1972,1980,1990,1991,1994,1995,1998,1999,2000,2001,
    2002,2003,2006,2008,2009,2010,2012,2013,2014,2017,2018,2019
  ];

  genres = [
    'Action','Drama','Comedy','Thriller','Horror',
    'Sci-Fi','Fantasy','Romance','Crime','Animation'
  ];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.api.getMovies(
      this.searchTerm,
      this.sortBy,
      this.desc,
      this.selectedYear,
      this.selectedGenre
    ).subscribe(res => {
      this.movies = res.items ?? res;
    });
  }

  onSortChange(value: string) {
    if (value === 'ratingAsc') {
      this.sortBy = 'rating';
      this.desc = false;
    } else if (value === 'ratingDesc') {
      this.sortBy = 'rating';
      this.desc = true;
    } else {
      this.sortBy = '';
      this.desc = false;
    }
    this.loadMovies();
  }

  onYearChange(year: string) {
    this.selectedYear = year ? Number(year) : undefined;
    this.loadMovies();
  }

  onGenreChange(genre: string) {
    this.selectedGenre = genre || undefined;
    this.loadMovies();
  }

  openDetails(id: number) {
    this.router.navigate(['/movies', id]);
  }
}
