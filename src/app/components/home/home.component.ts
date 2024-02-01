import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // public mylist:any[]=[{
  //   "title":"News1"
  // },{
  //   "title":"News2"
  // },{
  //   "title":"News3"
  // }]

  // public flag:boolean = false;
  // public orderStatus:number = 1;
  // public picUrl="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png";
  // public today:any = new Date();
  // public keywords:any='defaultKeywords';

  // constructor(){
  //   console.log(this.today);
  // }

  // ngOnInit(){

  // }

  // run(){
  //   alert('Run');
  // }

  // getDate(){
  //   alert(this.today);
  // }

  // keydown(e:Event){
  //   console.log(e.target);
  // }

  // runEvent(e:Event){
  //   var dom:any = e.target;
  //   dom.style.color="red";
  // }
  // changeKeywords(){
  //   this.keywords='changed.';
  // }
  // getKeywords(){
  //   console.log(this.keywords);
  // }

  public title:string = 'hometitle';
  public msg:string = 'FatherCompMsg';

  run(){
    alert('I an parent node run method');
  }

}

