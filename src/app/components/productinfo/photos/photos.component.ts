import { Component } from '@angular/core';
import { DataService } from "../../../service/data.service";
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent {
  public productInfo: any = {};
  private productInfoSubscription: Subscription | undefined;
  public photosInfo:any = {};
  
  constructor(private http: HttpClient, private dataService: DataService) {}
  ngOnInit() {
    this.productInfoSubscription = this.dataService.productInfo$.subscribe(
      (data) => {
        // synchonize productInfo from data.service
        this.productInfo = data;
        console.log('before call the backend /searchphotos api');
        console.log(this.productInfo);
        let photosResponse = this.getGooglePhotos();
      }
    );
  }

  getGooglePhotos(){
    if(this.productInfo != undefined && this.productInfo.Item != undefined && this.productInfo.Item.Title != undefined){
      let title = this.productInfo.Item.Title;
      console.log('title = ', title);
  
      const httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'})};
      let api='http://nodejs-app-thread-3-env.eba-a6kex7qp.us-east-2.elasticbeanstalk.com/searchphotos';
      this.http.post(api, {"title":title}, httpOptions).subscribe((response)=>{
        console.log('Frontend get the Googles photos from backend:');
        console.log(response);
        this.photosInfo = response;
      })
    }else{
      console.log("Product.Item.Title does not exist!");
    }
  }

  ngOnDestroy() {
    if (this.productInfoSubscription) {
      this.productInfoSubscription.unsubscribe();
    }
  }
}
