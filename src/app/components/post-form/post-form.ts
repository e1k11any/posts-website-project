import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  private postId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.postId = +id; // The '+' converts string to number
        this.postsService.getPost(this.postId).subscribe((post) => {
          this.postForm.patchValue({ title: post.title, body: post.body });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    if (this.isEditMode && this.postId) {
      // Logic for UPDATING a post
      const updatedPost = { ...this.postForm.value, id: this.postId, userId: 1 };
      this.postsService.updatePost(this.postId, updatedPost).subscribe(() => {
        this.router.navigate(['/post', this.postId]);
      });
    } else {
      // Logic for ADDING a new post
      const newPost = { ...this.postForm.value, userId: 1 }; // Assume userId 1 for new posts
      this.postsService.addPost(newPost).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
