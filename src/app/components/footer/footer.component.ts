import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  public msg="I'm from childnode footer";
  run(){
    alert("I'm run method from childnode footer");
  }
}


