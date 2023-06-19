import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/product/get/${productId}`
    );
  }
  // Get seller details by product
  //TBD
}
