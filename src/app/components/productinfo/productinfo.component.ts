import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from "../../service/data.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productinfo',
  templateUrl: './productinfo.component.html',
  styleUrls: ['./productinfo.component.css']
})
export class ProductinfoComponent {
  public itemId:string = '';
  public productInfo: any = {};
  private productInfoSubscription: Subscription | undefined;

  //NEW ADD
    // NEW ADD
    public watchlistMap: { [key: string]: any } = {};
    public watchlistMapSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemId = params['itemId'];
    });
    this.productInfoSubscription = this.dataService.productInfo$.subscribe(
      (data) => {
        this.productInfo = data;
      }
    );
    this.watchlistMapSubscription = this.dataService.watchlistMap$.subscribe(
      (data) => {
        this.watchlistMap = data;
      }
    );
    // call node.js to get productinfo data
    console.log('itemId', this.itemId);
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/productinfo';

    const urlWithParams = `${api}?itemId=${this.itemId}`;
    // send http post to get productInfo
    this.http.get(urlWithParams, httpOptions).subscribe((response) => {
    // this.http.post(api, {"itemId": this.itemId}, httpOptions).subscribe((response)=>{
      // update data.service.ts
      console.log('Productinfo: Frontend get the message from backend:');
      console.log(response);
      this.dataService.updateProductInfo(response);
      console.log('check again, productInfo = ',this.productInfo);
    })
  }


  addToWatchlist(){
    // First, send itemId to /getresultvalue to get the resultMap
    // Then, send the result map to /storeitem
    var itemId = this.productInfo.Item.ItemID;

      console.log("In productInfo page, now want to add/remove product:", itemId);
      const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
      let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/getresultvalue';

      this.http.post(api, {"itemId": itemId}, httpOptions).subscribe((response:any)=>{
  
        console.log('Get addToWatchList message from backend:', response);
        if(response.msg == undefined){
          console.log('Succesfully get resultsMap')
          api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/storeitem';
          this.http.post(api, response, httpOptions).subscribe((resp:any)=>{
            console.log(resp);
            console.log('Successfully operate MongoDB on productinfo page!');
          })
        }else{
          console.log('get resultsMap failed')
        }
      })
  }
  

  // addToWatchlist(){
  //   var item = this.productInfo.Item;

  //     console.log("In productInfo page, now want to add/remove product:", item);
  //     const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
  //     let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/storeitem';
      
  
  //     this.http.post(api, item, httpOptions).subscribe((response:any)=>{
  
  //       console.log('Frontend get message about mongodb from backend:', response);
        
  //       if(response.code == "INSERTED"){
  //         // insert this item to data.service.watchlistMap
  //         this.dataService.addToWatchlist(item.itemId, item);
  //       }else if(response.code == "DELETED"){
  //         //delete this item from data.service.watchlistMap
  //         this.dataService.deleteFromWatchlist(item.itemId);
  //       }else{
  //         console.log("Failed to do addToWatchlist!");
  //       }
  //       console.log("Now, watchlist = ",this.dataService.getWatchlistMap());
  //     })
  // }
  isInWatchlist(itemId:string){
    // console.log('this.wathlist = ', this.watchlistMap);
    if(this.watchlistMap.hasOwnProperty(itemId)){
      // console.log('this itemId = ', this.itemId);
      // console.log('this.watchlistMap.hasOwnProperty',this.watchlistMap.hasOwnProperty(itemId));
      return true;
    }else{
      return false;
    }
  }
  

}
