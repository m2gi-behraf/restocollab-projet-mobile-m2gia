import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throws } from 'assert';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {

  constructor(private postService: PostService,
    private route: ActivatedRoute) { }

  public id: string = "";
  public post = {} as Post;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? "whatever";
  }

}
