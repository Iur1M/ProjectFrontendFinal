import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ActivityService } from '../shared/activity.service';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  user: any;
  activities: any[] = [];
  allMovies: any[] = [];
  loading = true;
  showMoviePicker = false;

  constructor(
    private auth: AuthService,
    private activity: ActivityService,
    private api: ApiService,
  ) {
    this.auth.user$.subscribe((u) => (this.user = u));
  }

  ngOnInit() {
    this.activity.getMyHistory().subscribe((res) => {
      this.activities = res.slice(0, 5);
      this.loading = false;
    });

    this.api.getMovies('', '', false, undefined, '', 1, 20).subscribe((res) => {
      this.allMovies = res.items || res;
    });
  }

  toggleMoviePicker() {
    this.showMoviePicker = !this.showMoviePicker;
  }

  selectFavorite(movie: any) {
    this.auth.updateFavoriteMovie(movie.id).subscribe({
      next: () => {
        if (this.user) {
          this.user.favoriteMoviePoster = movie.posterUrl;
          this.auth.updateLocalUser(this.user);
        }
        this.showMoviePicker = false;
      },
      error: (err) => console.error('Update failed:', err),
    });
  }

  label(type: string) {
    return type === 'View' ? 'Viewed' : 'Commented';
  }
}
