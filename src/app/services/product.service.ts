import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:9091/inventory';
  classification = '';

  public setCategory(category: string) {
    this.classification = category;
  }

  constructor(private http : HttpClient) { }

  addProduct(data : any) {
    return this.http.post(this.baseUrl + '/' + this.classification + '/products', data)
  }

  getCategory() {
    return this.http.get<any>(this.baseUrl + '/classifications')
  }

  getProductList() {
    return this.http.get<any>(this.baseUrl + '/products')
  }

  updateProduct(data : any, id : number) {
    return this.http.put<any>(this.baseUrl + '/products/' + id, data)
  }

  deleteProduct(id : number) {
    return this.http.delete<any>(this.baseUrl + '/products/' + id)
  }

}
