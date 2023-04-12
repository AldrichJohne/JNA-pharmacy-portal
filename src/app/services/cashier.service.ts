import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private baseUrl = 'http://localhost:8081/cashier';

  constructor(private http : HttpClient) { }

  productSale(data : any, id : number) {
    return this.http.post(this.baseUrl + '/product/sell/' + id, data)
  }

  getProductSales() {
    return this.http.get<any>(this.baseUrl + '/products/sell')
  }
}
