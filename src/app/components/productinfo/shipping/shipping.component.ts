import { Component } from '@angular/core';
import { DataService } from "../../../service/data.service";
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent {
  public productInfo: any = {};
  public productInfoSubscription: Subscription | undefined;
  public watchlistMap: { [key: string]: any } = {};
  public watchlistMapSubscription: Subscription | undefined;
  public resultsMap: { [key: string]: any } = {};
  public resultsMapSubscription: Subscription | undefined;
  
  // public shippingInfo:{ [key: string]: any } = {};
  
  constructor(private http: HttpClient, private dataService: DataService) {}
  ngOnInit() {
    this.initShippingInfo();
  }


  ngOnDestroy() {
    if (this.productInfoSubscription) {
      this.productInfoSubscription.unsubscribe();
    }
  }

  public shippingInfo:any = {};

  async initShippingInfo(){
    // await this.importProductInfo();
    this.productInfoSubscription = this.dataService.productInfo$.subscribe(
      (data) => {
        // synchonize productInfo from data.service
        this.productInfo = data;
        console.log('this.productInfo = ', this.productInfo);
        console.log('Oh, God, this.productInfo = ', this.productInfo);
        let itemId = this.productInfo.Item.ItemID;
        
        const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
        let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/getresultvalue';
        this.http.post(api, {"itemId":itemId}, httpOptions).subscribe((response)=>{
          console.log('Shipping component get the message from backend:');
          console.log(response);
          this.shippingInfo = response;
        })
    
      }
    );
    // await this.importResultsMap();
    // await this.importWatchlistMap();

    
    // // try find shippingInfo in resultsMap
    // if(this.productInfo != undefined && this.productInfo.Item != undefined){
    //   console.log('before shipping initalized, this.productInfo = ', this.productInfo);
    //   console.log('before shipping initalized, this.resultsMap = ', this.resultsMap);
    //   console.log('before shipping initalized, this.watchlistMap = ', this.watchlistMap);
    //   let key = this.productInfo.Item.ItemID;
    //   console.log('key = ', key);
    //   if(key in this.resultsMap){
    //     console.log('Found in resultsMap');
    //     this.shippingInfo = this.resultsMap[key];
    //   }else if(key in this.watchlistMap){
    //     console.log('Found in watchlistMap');
    //     this.shippingInfo = this.watchlistMap[key];
    //   }
    //   console.log('after init, shippingInfo = ', this.shippingInfo);
    // }
  }

  async importProductInfo() {
    this.productInfoSubscription = this.dataService.productInfo$.subscribe(
      (data) => {
        // synchonize productInfo from data.service
        this.productInfo = data;
        console.log('this.productInfo = ', this.productInfo);
      }
    );
  }
  // async importResultsMap() {
  //   this.resultsMapSubscription = this.dataService.resultsMap$.subscribe(
  //     (data) => {
  //       // synchonize resultsMap from data.service
  //       this.resultsMap = data;
  //       console.log('this.resultsMap', this.resultsMap);
  //     }
  //   );
  // }
  // async importWatchlistMap() {
  //   this.watchlistMapSubscription = this.dataService.watchlistMap$.subscribe(
  //     (data) => {
  //       // synchonize watchlistMap from data.service
  //       this.watchlistMap = data;
  //       console.log('this.watchlistMap', this.watchlistMap);
  //     }
  //   );
  // }



}


