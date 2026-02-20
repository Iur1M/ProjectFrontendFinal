import { Component } from '@angular/core';
import { ActivityService } from '../shared/activity.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrl: './activity-page.component.css'
})
export class ActivityPageComponent {
 activities: any[] = [];
  loading = true;

  constructor(
    private activity: ActivityService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.activity.getMyHistory().subscribe(res => {
      this.activities = res;
      this.loading = false;
    });
  }

  label(type: string) {
    return type === 'View' ? 'Viewed' : 'Commented';
  }
}
