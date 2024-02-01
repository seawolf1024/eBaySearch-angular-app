import { Component } from '@angular/core';
import { DataService } from "../../../service/data.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  public productInfo: any = {};
  private productInfoSubscription: Subscription | undefined;

  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.productInfoSubscription = this.dataService.productInfo$.subscribe(
      (data) => {
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
