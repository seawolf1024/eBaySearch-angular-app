import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title:any;
  @Input() msg:any;
  @Input() run:any;
  @Input() home:any;

  getParentMsg(){
    alert(this.msg);
  }

  getParentRun(){
    // this.run();
    alert(this.home.msg);
    this.home.run();

  }


}
