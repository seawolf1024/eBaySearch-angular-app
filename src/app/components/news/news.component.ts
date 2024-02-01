import { Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  // public title = 'NewsTitle';
  // msg = 'NewsMsg';
  // username:string = 'NewsUsername';

  // public userinfo:any = {
  //   username: "zhangsan",
  //   age:'20'
  // }

  // public message:any;
  // public student:string = 'I am a student';

  // public content="<h2>I'm a HTML.</h2>";

  // public arr=["ele1", "ele2","ele3","ele4","ele5"];
  // public mylist:any[]=['ELE1', 2, 'ELE3', 4, 5];
  // public userlist:any[] =[{username:'zhangsan', age:20},{username:"lisi", age:19}];
  // public cars:any[] = [{
  //   cate:'BMW',
  //   list:[{title:'x1', price:300},{title:'x2', price:400},{title:'x3', price:500}]
  // },{
  //   cate:'Audi',
  //   list:[{title:'q1', price:1300},{title:'q2', price:2400},{title:'q3', price:1500}]
  // },{
  //   cate:'Toyota',
  //   list:[{title:'a1', price:3300},{title:'a2', price:3400},{title:'a3', price:3500}]
  // }]


  // constructor(){
  //   this.message='NewsMessage';
  // }
  @ViewChild('footer') footer:any;
  getChildMsg(){
    alert(this.footer.msg);
  }
  getChildRun(){
    this.footer.run();
  }
}
