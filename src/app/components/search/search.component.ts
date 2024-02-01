import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from "../../service/data.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  // public keyword:string = "";
  // public category:number = 0;
  // public condition:any = {"new":false, "used":false, "unspecified":false};
  // public shipping:any = {"localPickUp":false, "freeShipping":false};
  // public distance:number = 10;
  // public from:any = 0;
  // public code:string = "";


  // public zipcodes:any = [
  //   {"label": "one","value": 1},
  //   {"label": "two","value": 2},
  //   {"label": "three","value": 3},
  //   {"label": "four","value": 4}
  // ];
  // public currZipcode:string = "";
  public zipcodes:any = [];

  constructor(private http: HttpClient, private dataService: DataService) {}
  ngOnInit(){
    this.GetIPAndClearZipcode();
  }
  public defaultSearchInfo:any={
    keyword:'',
    category: '0',
    condition: {"new":false, "used":false, "unspecified":false},
    shipping: {"localPickUp":false, "freeShipping":false},
    distance: 10,
    from: "currLocation",
    zipcode: "",
  }

  public searchInfo:any={
    keyword:'',
    category: '0',
    condition: {"new":false, "used":false, "unspecified":false},
    shipping: {"localPickUp":false, "freeShipping":false},
    distance: 10,
    from: "currLocation",
    zipcode: "",
  }



  doLogin(){
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/dologin';
    console.log({"username":"zhangsan","age":12});
    this.http.post(api, {"username":"zhangsan","age":12}, httpOptions).subscribe((response)=>{
      console.log(response);
    })
  }

  clearZipcode(){
    this.searchInfo.zipcode = "";
  }
  GetIPAndClearZipcode(){
    // clear zipcode
    this.clearZipcode();
    // call ip function
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='https://ipinfo.io/json?token=e4634b03dd47cf';
    this.http.post(api, this.searchInfo, httpOptions).subscribe((response)=>{
      let ipZipcode = JSON.parse(JSON.stringify(response)).postal;
      console.log('Get IP info!', ipZipcode);
      this.searchInfo.zipcode = ipZipcode == undefined ? "90009" : ipZipcode;
    })
  }
  keywordCheck(){
    if(this.searchInfo.keyword.replace(/\s/g, "") == ''){
      return false;
    }else{
      return true;
    }
  }
  zipcodeCheck(){
    if(this.searchInfo.zipcode.length != 5){
      return false;
    }else{
      for(let i = 0; i < this.searchInfo.zipcode.length; i++){
        if(this.searchInfo.zipcode[i] > '9' || this.searchInfo.zipcode[i] < '0'){
          return false;
        }
      }
      return true;
    }
  }
  
  public showProgressBar = 0;

  getRandomNumber(){
    return 70;
    return Math.floor(Math.random() * (91 - 40) + 40); // Random number between 0 and 90 (inclusive).
  }

  search(){
    this.showProgressBar = 1;
    this.dataService.updateResultsMap({});
    console.log("searchInfo = ",this.searchInfo);

    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/dosearch';
    this.http.post(api, this.searchInfo, httpOptions).subscribe((response)=>{
      console.log('Frontend get the message from backend:');
      console.log(response);
      this.dataService.updateResultsMap(this.parseResponseToMap(response));
      this.showProgressBar = 0;
    })
    this.showProgressBar = 0;
  } 

  getsearchUrl(){
    this.showProgressBar = 1;
    this.dataService.updateResultsMap({});
    console.log("searchInfo = ",this.searchInfo);

    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/getsearchUrl';
    this.http.post(api, this.searchInfo, httpOptions).subscribe((response)=>{
      console.log('Frontend get the message from backend:');
      console.log(response);
      this.dataService.updateResultsMap(this.parseResponseToMap(response));
      this.showProgressBar = 0;
    })
    // this.showProgressBar = 0;
  }


  checkProgress() {
    const resultsmap = []; // Replace with your actual resultsmap data
    const progressBar = document.getElementById("progress-bar");

    if (progressBar != null && resultsmap.length === 0) {
      progressBar.style.display = "block";

      // Generate a random value between 50% and 90%
      const randomValue = Math.random() * 40 + 50;

      // Set the width and aria-valuenow attribute of the progress bar

      progressBar.style.width = randomValue + "%";
      // progressBar.setAttribute("aria-valuenow", randomValue);


    }
  }


  parseResponseToMap(response:any){
    if(response.findItemsAdvancedResponse != undefined &&
       response.findItemsAdvancedResponse[0].ack[0]=='Success'){

      let items =  response.findItemsAdvancedResponse[0].searchResult[0].item;
      if(items == undefined){
        return {};
      }
      let tmpResultsMap: { [key: string]: any } = {};

      for (const item of items) {
        tmpResultsMap[item.itemId[0]] = item;
      }
      console.log('After parsing, resultsMap = ',tmpResultsMap);
      return tmpResultsMap;
    }else{
      return {};
    }
  }
  
  clear(){
    this.searchInfo = JSON.parse(JSON.stringify(this.defaultSearchInfo));
    this.GetIPAndClearZipcode();
    this.dataService.updateResultsMap({});
  }

  getCurrZipcodeRecomm(){
    if(this.searchInfo.zipcode.length <= 5){
      const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
      let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/getzipcodes';
      this.http.post(api, {"currZipcode": this.searchInfo.zipcode}, httpOptions).subscribe((response)=>{
        console.log('Frontend get zipcode message from backend:');
        // console.log(response);
        this.parseZipcodeResponse(response);
      })
    }
  }

  parseZipcodeResponse(zipcodeResponse:any){
    let postalCodes = [];
    for(let item of zipcodeResponse.postalCodes){
      postalCodes.push(item.postalCode);
      // this.zipcodes.push(item.postalCode);
    }
    this.zipcodes = postalCodes;
    // console.log(postalCodes);
    // return postalCodes;
  }

  // test
  searchInfoDetail(){
    console.log(this.searchInfo);

    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/productinfo';
    this.http.post(api, this.searchInfo, httpOptions).subscribe((response)=>{
      console.log('SearchInfo: Frontend get the message from backend:');
      console.log(response);
    })
    
  }




}
