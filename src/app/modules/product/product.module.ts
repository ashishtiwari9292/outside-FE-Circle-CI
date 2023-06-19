import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ProductSliderComponent } from './product-slider/product-slider.component';
import { StarRatingModule } from 'angular-star-rating';
import { ProductService } from './product.service';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
  },
];

@NgModule({
  declarations: [
    ProductComponent,
    ProductSliderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StarRatingModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [
    ProductService
  ]
})
export class ProductModule { }
