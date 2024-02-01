import { Component } from '@angular/core';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent {
  public keyword:string = '';
  public todoList:any = [];

  doAdd(e:KeyboardEvent){
    console.log(e);
    if(e.key=='Enter'){
      this.todoList.push({
        title:this.keyword,
        status:0
      });
    }
    
    console.log(this.keyword);
  }

  delete(key:number){
    this.todoList.splice(key, 1);
  }
}
