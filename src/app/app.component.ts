import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { User } from './shared/models/user.model';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', [
        style({
          opacity: 0,
          transform: 'translateY(10px)'
        }),
        animate('300ms ease', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ])
  ]
})

export class AppComponent {
  title = 'Project';
  user: User | null = null;
  menuOpen = false;

 constructor(
  private auth: AuthService,
  public router: Router
) {
    this.auth.user$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.menuOpen = false;
    this.auth.logout(this.router);
  }
}
