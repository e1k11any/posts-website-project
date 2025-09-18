import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post, PostsService, Comment } from '../../services/posts';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css',
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  isLoggedIn$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));

          // forkJoin to make parallel API calls for both post and comments
          return forkJoin({
            post: this.postsService.getPost(id),
            comments: this.postsService.getComments(id),
          });
        })
      )
      .subscribe((data) => {
        this.post = data.post;
        this.comments = data.comments;
      });
  }

  onDelete(): void {
    if (!this.post) return;
    if (confirm('Are you sure you want to delete this post?')) {
      this.postsService.deletePost(this.post.id).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
