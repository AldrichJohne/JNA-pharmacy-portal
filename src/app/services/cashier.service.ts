import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SharedEventService} from "./shared-event.service";

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  pharmacyProductMsApiUrl = '';

  constructor(private http : HttpClient,
              public shareEventService: SharedEventService) {
    this.pharmacyProductMsApiUrl = this.shareEventService.getPharmacyProductUrl();
  }

  productSale(data : any, id : number, discountSwitch: any) {
    const params = { discountSwitch };
    return this.http.post(this.pharmacyProductMsApiUrl + '/cashier/product/sell/' + id, data, {params})
  }

  batchProductSale(data : any) {
    return this.http.post(this.pharmacyProductMsApiUrl + '/cashier/v2/product/batch/sell', data)
  }

  getProductSales() {
    return this.http.get<any>(this.pharmacyProductMsApiUrl + '/cashier/products/sell')
  }

  deleteProductSoldRecord(id : number) {
    return this.http.delete<any>(this.pharmacyProductMsApiUrl + '/cashier/product/sell/' + id)
  }
}
