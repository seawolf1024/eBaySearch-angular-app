import { Component, OnInit } from '@angular/core';
import { DataService } from "../../service/data.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent {
  public watchlistMap: { [key: string]: any } = {};
  public watchlistMapSubscription: Subscription | undefined;

  constructor(private dataService: DataService, private http: HttpClient) {}

  ngOnInit() {
    this.watchlistMapSubscription = this.dataService.watchlistMap$.subscribe(
      (data) => {
        this.watchlistMap = data;
      }
    );

    console.log("Now data.service.ts ngOnInit");
    // Initially, get all the watchlist data from mongoDB.
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/initialize';

    this.http.post(api, {}, httpOptions).subscribe((response)=>{
      // update data.service.ts
      console.log('Initializing Watchlist: Frontend get the message from backend:');
      console.log(response);
      // this.dataService.updateWatchlistMap(response);
      let tmpWatchlistMap: { [key: string]: any } = {};
      for (const item of JSON.parse(JSON.stringify(response))) {
        tmpWatchlistMap[item.itemId] = item;
      }
      console.log(tmpWatchlistMap);
      this.dataService.updateWatchlistMap(tmpWatchlistMap);
    })
  }

  getMapLength(){
    console.log('this.watchlistmap now = ', this.watchlistMap)
    console.log('Object.entries(this.watchlistMap).length = ',Object.entries(this.watchlistMap).length)
    return Object.entries(this.watchlistMap).length;
  }

  getMapLengthAlert(){
    console.log('getMapLength()=',this.getMapLength());
    console.log('getMapLength() == 0:',this.getMapLength() == 0)
    console.log('getMapLength()==undefined:',this.getMapLength() == undefined);
  }

  getTotalCost(): number {
//     for (let item of Object.entries(this.watchlistMap).entries()) {
//       if () {
//         total += item[1].value.sellingStatus[0].currentPrice[0].__value__
//       }
//     }
    let total = 0;

    for (const key in this.watchlistMap) {
    if (this.watchlistMap.hasOwnProperty(key)) {
      const currentPrice = parseFloat(this.watchlistMap[key].sellingStatus[0].currentPrice[0].__value__);
      total += currentPrice;
      }
    }
    return total;
  }

  removeFromWatchlist(item:any){
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/removeitem';

    this.http.post(api, item, httpOptions).subscribe((response:any)=>{

      console.log('Frontend get message about remove from backend:', response);
      
      if(response.code == "NOTFOUND"){
        // insert this item to data.service.watchlistMap
        console.log("No such item in MongoDB!");
      }else if(response.code == "DELETED"){
        //delete this item from data.service.watchlistMap
        this.dataService.deleteFromWatchlist(item.itemId);
        console.log("Removed item from MongoDB!");
      }else{
        console.log("Failed to do addToWatchlist!");
      }
      console.log("Now, watchlist = ",this.dataService.getWatchlistMap());
    })
  }


}
