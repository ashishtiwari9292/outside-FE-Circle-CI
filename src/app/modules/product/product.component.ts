import { Component, OnInit } from '@angular/core';
import { Product } from './models/product';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  seller: any = {};
  product: any = {};
  userIdOfSeller: string;
  currency: string = '$'; //From user location
  /* Need to convert price according to currency*/
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.seller.name = 'Seller';
    this.seller.totalProducts = '99';
    this.seller.image = 'assets/images/dummy-img-thumb.png';

    this.productService.getProductById('8').subscribe(
      (res: Product) => {
        if (res) {
          this.product = { ...res };
          this.userIdOfSeller = res.userId;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  addToCart() {}
  likeProduct() {}
  onReviewClick() {}
}
