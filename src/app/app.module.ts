import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsComponent } from './components/news/news.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';

// add FormsModule to do data binding
import { FormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { SearchComponent } from './components/search/search.component';
import { TodolistComponent } from './components/todolist/todolist.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './components/productinfo/product/product.component';
import { GettestComponent } from './components/gettest/gettest.component';

//add http module
import { HttpClientModule} from '@angular/common/http';
import { ResultsComponent } from './components/results/results.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { ProductinfoComponent } from './components/productinfo/productinfo.component';
import { PhotosComponent } from './components/productinfo/photos/photos.component';
import { ShippingComponent } from './components/productinfo/shipping/shipping.component';
import { SellerComponent } from './components/productinfo/seller/seller.component';
// import { SellerModule } from './components/productinfo/seller/seller.module';
import { SimilarproductComponent } from './components/productinfo/similarproduct/similarproduct.component';

// import {RoundProgressModule} from 'angular-svg-round-progressbar';
// import { SellerModule } from './components/productinfo/seller/seller.module';

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    HomeComponent,
    HeaderComponent,
    FormComponent,
    SearchComponent,
    TodolistComponent,
    FooterComponent,
    ProductComponent,
    GettestComponent,
    ResultsComponent,
    WatchlistComponent,
    ProductinfoComponent,
    PhotosComponent,
    ShippingComponent,
    SellerComponent,
    SimilarproductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    // RoundProgressModule,
    // SellerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
