import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from "../../service/data.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  // NEW ADD
  public watchlistMap: { [key: string]: any } = {};
  public watchlistMapSubscription: Subscription | undefined;
  
  // public localResultsInfo: any = {};
  public localResultsMap: { [key: string]: any } = {};
  private resultsMapSubscription: Subscription | undefined;
  
  // Pagination
  public itemsPerPage:number = 10;
  public currentPage = 1;
  public maxPageIdx = 5; // start from 1, 1 ~ maxPageIdx
  public pageIndexes:number[] = [1,2,3,4,5];
  public paginatedArray:any = [];

  setMaxPages(){
    this.maxPageIdx = Math.ceil(Object.entries(this.localResultsMap).length / this.itemsPerPage);
    console.log("this.localResultsMap['size'] = ",Object.entries(this.localResultsMap).length);
    console.log("this.maxPageIdx = ", this.maxPageIdx);
  }
  
  setPageIndexes(){
    let tmp:number[] = [];
    for (let i = 1; i <= this.maxPageIdx; i++) {
      tmp.push(i);
    }
    this.pageIndexes = tmp;
    console.log("this.pageIndexes=", this.pageIndexes);
  }

  updatePage(i:number){
    this.currentPage = i;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Convert the map into an array of key-value pairs
    var keyValueArray = Object.entries(this.localResultsMap);
    

    // Get key-value pairs from index i to j
    const keyValuePairSlice = keyValueArray.slice(startIndex, endIndex);

    this.paginatedArray = keyValuePairSlice;
    // console.log('When searching for sdfdsfddfd, paginatedArray.length = ', this.paginatedArray.length);
  }


  constructor(private dataService: DataService, private http: HttpClient) {}
  ngOnInit() {
    // get resultsMap from data.service
    this.resultsMapSubscription = this.dataService.resultsMap$.subscribe(
      (data) => {
        this.localResultsMap = data;
        // set page info
        this.setMaxPages(); 
        this.setPageIndexes();
        this.updatePage(1);
       
      }
    );
    this.watchlistMapSubscription = this.dataService.watchlistMap$.subscribe(
      (data) => {
        this.watchlistMap = data;
      }
    );



    // Initially, get all the watchlist data from mongoDB.
    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/initialize';

    this.http.post(api, {}, httpOptions).subscribe((response)=>{
      // update data.service.ts
      console.log('Initializing Watchlist: Frontend get the message from backend:');
      console.log(response);


      // this.dataService.updateWatchlistMap(response);
      // construct a map: [itemId] -> item
      let tmpWatchlistMap: { [key: string]: any } = {};
      for (const item of JSON.parse(JSON.stringify(response))) {
        tmpWatchlistMap[item.itemId] = item;
      }
      // console.log(tmpWatchlistMap);
      this.dataService.updateWatchlistMap(tmpWatchlistMap);
    })
  }


  ngOnDestroy() {
    if (this.resultsMapSubscription) {
      this.resultsMapSubscription.unsubscribe();
    }
  }

  addToWatchlist(item:any){
    console.log(item);

    const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
    let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/storeitem';

    this.http.post(api, item, httpOptions).subscribe((response:any)=>{

      console.log('Frontend get message about mongodb from backend:', response);
      
      if(response.code == "INSERTED"){
        // insert this item to data.service.watchlistMap
        this.dataService.addToWatchlist(item.itemId, item);
      }else if(response.code == "DELETED"){
        //delete this item from data.service.watchlistMap
        this.dataService.deleteFromWatchlist(item.itemId);
      }else{
        console.log("Failed to do addToWatchlist!");
      }
      console.log("Now, watchlist = ",this.dataService.getWatchlistMap());
    })  
  }

  isInWatchlist(itemId:string){
    if(this.watchlistMap.hasOwnProperty(itemId)){
      return true;
    }else{
      return false;
    }
  }
}
