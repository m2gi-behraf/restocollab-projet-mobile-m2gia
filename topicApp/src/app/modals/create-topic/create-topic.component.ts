import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss'],
})
export class CreateTopicComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController, 
    private topicService: TopicService) { }

  topicForm = new FormGroup({
    name: new FormControl('', Validators.required),
    posts: new FormControl(new Array())
  });

  availablePosts: Post[] = new Array()

  ngOnInit() {}

  onSubmit() {
    //NOTHING
  }

  onWillDismiss(event: Event) { }

  cancel(): void{
    this.modalCtrl.dismiss(null, 'cancel')
  }

  confirm(): boolean{
    if (!this.topicForm.valid) {
      console.log('Veuillez remplir les champs obligatoires')
      return false;
    }
    
    const topic = this.topicService.create(this.topicForm.value.name ?? "", this.topicForm.value.posts ?? new Array())
    this.modalCtrl.dismiss(topic, "confirm");
    return true;
  }
}
