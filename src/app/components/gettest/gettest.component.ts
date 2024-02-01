import { Component } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-gettest',
  templateUrl: './gettest.component.html',
  styleUrls: ['./gettest.component.css']
})
export class GettestComponent {
  public foodlist:any[] = [];

  constructor(public http:HttpClient){}

  getData(){
    let api = 'http://a.itying.com/api/productlist';
    this.http.get(api).subscribe((response:any)=>{
      console.log(response);
      this.foodlist = response.result;
      console.log(this.foodlist);
    })
  }
  doLogin(){
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/dologin';
    this.http.post(api, {"username":"zhangsan","age":12}, httpOptions).subscribe((response)=>{
      console.log(response);
    })
  }
}
