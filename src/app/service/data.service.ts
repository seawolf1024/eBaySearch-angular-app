import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private resultsInfoSubject = new BehaviorSubject<any>({});
  private resultsMapSubject = new BehaviorSubject<{ [key: string]: any }>({});
  resultsMap$ = this.resultsMapSubject.asObservable();

  private productInfoSubject = new BehaviorSubject<any>({});
  productInfo$ = this.productInfoSubject.asObservable();

  private watchlistMapSubject = new BehaviorSubject<{ [key: string]: any }>({});
  watchlistMap$ = this.watchlistMapSubject.asObservable();


  constructor() {}

  // resultsInfo: [key] -> value
  updateResultsMap(data: any) {
    this.resultsMapSubject.next(data);
    console.log("resultMap now = ", this.resultsMapSubject.getValue());
  }

  // productInfo
  updateProductInfo(data:any){
    this.productInfoSubject.next(data);
  }
  getProductInfo(){
    return this.productInfoSubject.getValue();
  }
  // watchlistMap: [key] -> value
  updateWatchlistMap(data:any){
    this.watchlistMapSubject.next(data);
  }
  getWatchlistMap(){
    return this.watchlistMapSubject.getValue();
  }
  addToWatchlist(key: string, value: any) {
    const currentWatchlist = this.watchlistMapSubject.getValue();
    currentWatchlist[key] = value;
    this.watchlistMapSubject.next(currentWatchlist);
  }
  deleteFromWatchlist(key: string) {
    console.log('deleteFromWatchlist', key);
    const currentWatchlist = this.watchlistMapSubject.getValue();
    if (currentWatchlist.hasOwnProperty(key)) {
      console.log('FIND KEY');
      delete currentWatchlist[key];
      this.watchlistMapSubject.next(currentWatchlist);
      console.log('Then, currentWatchlist = ', this.watchlistMapSubject.getValue());

      // const updatedWatchlist = { ...currentWatchlist }; // Create a new object
      // delete updatedWatchlist[key]; // Remove the item
      // this.watchlistMapSubject.next(updatedWatchlist); // Notify subscribers with the updated watchlist
      // console.log('Then, currentWatchlist = ', this.watchlistMapSubject.getValue());
    }else{
      console.log('DID NOT FIND KEY');
    }
  }
}
