import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommentService } from '../shared/comment.service';
import { AuthService } from '../shared/auth.service';
import { Comment } from '../shared/models/comment.model';

@Component({
  selector: 'app-movie-detail-page',
  templateUrl: 'movie-detail-page.component.html',
  styleUrls: ['movie-detail-page.component.css'],
})
export class MovieDetailPageComponent {
  movie: any;
  comments: Comment[] = [];
  newComment = '';
  newRating = 8;

  safeTrailerUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private commentService: CommentService,
    public auth: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getMovieById(id).subscribe((movie) => {
      this.movie = movie;
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        movie.trailerUrl,
      );
    });

    this.loadComments(id);
  }

  loadComments(movieId: number) {
    this.commentService
      .getByMovie(movieId)
      .subscribe((c) => (this.comments = c));
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.commentService
      .create({
        movieId: this.movie.id,
        text: this.newComment,
        rating: this.newRating,
      })
      .subscribe((c) => {
        this.comments.unshift(c);
        this.newComment = '';
        this.newRating = 8;
      });
  }

  deleteComment(id: number) {
    this.commentService.delete(id).subscribe(() => {
      this.comments = this.comments.filter((c) => c.id !== id);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  watchNow() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/movies']);
  }
}
