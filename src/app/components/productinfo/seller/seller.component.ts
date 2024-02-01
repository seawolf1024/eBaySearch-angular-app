import { Component } from '@angular/core';
import { DataService } from "../../../service/data.service";
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {NgModule} from '@angular/core';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

// src/app/your-module.ts



@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css'],
})



export class SellerComponent {
  public productInfo: any = {};
  private productInfoSubscription: Subscription | undefined;
  
  constructor(private http: HttpClient, private dataService: DataService) {}
  ngOnInit() {
    this.productInfoSubscription = this.dataService.productInfo$.subscribe(
      (data) => {
        // synchonize productInfo from data.service
        this.productInfo = data;
      }
    );
  }


  ngOnDestroy() {
    if (this.productInfoSubscription) {
      this.productInfoSubscription.unsubscribe();
    }
  }
}
