import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss'],
})
export class CreateTopicComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController, 
    private postService : PostService, 
    private topicService: TopicService) { }

  topicForm = new FormGroup({
    name: new FormControl('', Validators.required),
    posts: new FormControl(new Array())
  });

  availablePosts: Post[] = new Array()

  ngOnInit() {}

  onSubmit() {
    this.topicForm.value.name
    console.warn(this.topicForm.value);
  }

  onWillDismiss(event: Event) { }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel')
  }

  confirm(){
    if (!this.topicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      const topic = this.topicService.create(this.topicForm.value.name ?? "", this.topicForm.value.posts ?? new Array())
      this.modalCtrl.dismiss(topic, "confirm");
      return true;
    }  
  }
}
