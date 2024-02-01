import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  public peopleInfo:any={
    username:'zhangsan',
    sex: '1',
    cityList: ['LA', 'Shanghai', 'Tokyo', 'Singapore'],
    city:'Tokyo',

    hobby:[{title:'eating', checked:false},
    {title:'sleeping', checked:true},
    {title:'coding', checked:false}],
    mark:''
  }
  doSubmit(){
    let usernameDom:any=document.getElementById("username");
    console.log(usernameDom.value);

    console.log(this.peopleInfo);
  }
}
