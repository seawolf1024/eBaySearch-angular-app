import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewsComponent } from './components/news/news.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/productinfo/product/product.component';
import { ResultsComponent } from './components/results/results.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { ProductinfoComponent } from './components/productinfo/productinfo.component';
import { PhotosComponent } from './components/productinfo/photos/photos.component';
import { ShippingComponent } from './components/productinfo/shipping/shipping.component';
import { SellerComponent } from './components/productinfo/seller/seller.component';
import { SimilarproductComponent } from './components/productinfo/similarproduct/similarproduct.component';

const routes: Routes = [{
  path:'results', component:ResultsComponent
},{
  path:'watchlist', component:WatchlistComponent
},{
  path:'productinfo/:itemId', component:ProductinfoComponent,
  children:[
    {path:'',redirectTo: 'product',pathMatch: 'full'},
    
    {path:'product', component:ProductComponent},
    {path:'photos', component:PhotosComponent},
    {path:'shipping', component:ShippingComponent},
    {path:'seller', component:SellerComponent},
    {path:'similarproduct', component:SimilarproductComponent}
  ]
},{
  path:'**', redirectTo: 'results'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
