import { Component } from '@angular/core';
import { DataService } from "../../../service/data.service";
import { Subscription, single } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-similarproduct',
  templateUrl: './similarproduct.component.html',
  styleUrls: ['./similarproduct.component.css']
})
export class SimilarproductComponent {
  public productInfo: any = {};
  private productInfoSubscription: Subscription | undefined;
  public defaultSimilarInfo:any = {};
  public similarInfo:any = {};
  public sortStatus:string = "0"; // 0 default, 1 Product Name, 2 Price, 3 Shipping Cost, 4 Days Left
  public isAscending:boolean = true;
  public isShowingMore: boolean = false;
  
  constructor(private http: HttpClient, private dataService: DataService) {}
  ngOnInit() {
    this.productInfoSubscription = this.dataService.productInfo$.subscribe(
      (data) => {
        // synchonize productInfo from data.service
        this.productInfo = data;
        // console.log('before getSimilar, =', this.productInfo);
        this.similarInfo = this.getSimilar();
      }
    );
  }


  ngOnDestroy() {
    if (this.productInfoSubscription) {
      this.productInfoSubscription.unsubscribe();
    }
  }

  
  getSimilar(){
    if(this.productInfo != undefined && this.productInfo.Item != undefined && this.productInfo.Item.ItemID != undefined){
      let itemId = this.productInfo.Item.ItemID;
  
      const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
      let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/searchsimilar';
      this.http.post(api, {"itemId":itemId}, httpOptions).subscribe((response)=>{
        console.log('Frontend get the Similar photos from backend:');
        console.log(response);
        this.similarInfo = JSON.parse(JSON.stringify(response));
        this.defaultSimilarInfo = JSON.parse(JSON.stringify(response));
      })
    }else{
      console.log("Product.Item.ItemID does not exist!");
    }
  }

  getDays(s:string){ // P16DT11H22M36S -> 16
    return s.slice(s.indexOf('P') + 1, s.indexOf('D'));
  }
  
  compareTitle(a:any, b:any, ascending:boolean = true) {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    const comparison = titleA.localeCompare(titleB);
    return ascending == true ? comparison : -comparison;
  }

  compareTimeleft(a:any, b:any, ascending:boolean = true) {
    const timeleftA = parseFloat(this.getDays(a.timeLeft));
    const timeleftB = parseFloat(this.getDays(b.timeLeft));
    const comparison = timeleftA - timeleftB;
    return ascending == true ? comparison : -comparison;
  }
  comparePrice(a:any, b:any, ascending:boolean = true) {
    // console.log("inner ascending = ", ascending);
    const priceA = parseFloat(a.buyItNowPrice.__value__);
    const priceB = parseFloat(b.buyItNowPrice.__value__);
    const comparison = priceA - priceB;
    return ascending == true ? comparison : -comparison;
  }
  compareShippingCost(a:any, b:any, ascending:boolean = true) {
    const shippingCostA = parseFloat(a.shippingCost.__value__);
    const shippingCostB = parseFloat(b.shippingCost.__value__);
    const comparison = shippingCostA - shippingCostB;
    return ascending == true ? comparison : -comparison;
  }

  sortByDefault(){
    this.similarInfo = JSON.parse(JSON.stringify(this.defaultSimilarInfo));
    if(this.isAscending == false){
      this.similarInfo.getSimilarItemsResponse.itemRecommendations.item.reverse();
    }
  }
  sortByTitle(){
    this.similarInfo.getSimilarItemsResponse.itemRecommendations.item.sort((a:any, b:any) => this.compareTitle(a, b, this.isAscending));
  }
  sortByTimeleft(){
    this.similarInfo.getSimilarItemsResponse.itemRecommendations.item.sort((a:any, b:any) => this.compareTimeleft(a, b, this.isAscending));
  }
  sortByPrice(){
    // console.log("isAscending = ", this.isAscending);
    this.similarInfo.getSimilarItemsResponse.itemRecommendations.item.sort((a:any, b:any) => this.comparePrice(a, b, this.isAscending));
  }
  sortByShippingCost(){
    this.similarInfo.getSimilarItemsResponse.itemRecommendations.item.sort((a:any, b:any) => this.compareShippingCost(a, b, this.isAscending));
  }

  doSort(){
    switch (this.sortStatus) {
      case "0":
        this.sortByDefault();
        break;
      case '1':
        this.sortByTitle();
        break;
      case '2':
        this.sortByPrice();
        break;
      case '3':
        this.sortByShippingCost();
        break;
      case '4':
        this.sortByTimeleft();
        break;
      default:
        break;
    }
  }

  showMoreAndLess(){
    this.isShowingMore = !this.isShowingMore;
  }
}
