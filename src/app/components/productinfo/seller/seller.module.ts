// seller.module.ts (Create a new module specifically for your seller component)

import { NgModule } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { SellerComponent } from './seller.component';

@NgModule({
  imports: [RoundProgressModule],
//   declarations: [SellerComponent], // Declare your component here
})
export class SellerModule {}
