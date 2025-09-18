import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Post, PostsService } from '../../services/posts';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  isLoggedIn$: Observable<boolean>;

  constructor(private postsService: PostsService, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  ngOnInit(): void {
    this.postsService.getPosts().subscribe((posts) => {
      this.posts = posts;
      console.log(this.posts);
    });
  }
}
