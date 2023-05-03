import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SharedEventService} from "./shared-event.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  pharmacyProductMsApiUrl = '';
  classification = '';

  public setCategory(category: string) {
    this.classification = category;
  }

  constructor(private http : HttpClient,
              public shareEventService: SharedEventService) {
    this.pharmacyProductMsApiUrl = this.shareEventService.getPharmacyProductUrl();
  }

  addProduct(data : any) {
    return this.http.post(this.pharmacyProductMsApiUrl + '/inventory/' + this.classification + '/products', data)
  }

  addBatchProduct(data :any) {
    return this.http.post(this.pharmacyProductMsApiUrl + '/v2/products/batch', data)
  }

  getCategory() {
    return this.http.get<any>(this.pharmacyProductMsApiUrl + '/inventory/classifications')
  }

  getProductList() {
    return this.http.get<any>(this.pharmacyProductMsApiUrl + '/inventory/products')
  }

  updateProduct(data : any, id : number) {
    return this.http.put<any>(this.pharmacyProductMsApiUrl + '/inventory/products/' + id, data)
  }

  deleteProduct(id : number) {
    return this.http.delete<any>(this.pharmacyProductMsApiUrl + '/inventory/products/' + id)
  }

}
