import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:9090/inventory';
  private baseUrlNew = 'http://localhost:9090';
  classification = '';

  public setCategory(category: string) {
    this.classification = category;
  }

  constructor(private http : HttpClient) { }

  postProduct(data : any) {
    return this.http.post(this.baseUrl + '/' + this.classification + '/products', data)
  }

  getCategory() {
    return this.http.get<any>(this.baseUrl + '/classifications')
  }

  getBranded() {
    return this.http.get<any>(this.baseUrlNew + '/tables/class/1')
  }
  getGeneric() {
    return this.http.get<any>(this.baseUrlNew + '/tables/class/2')
  }
  getGalenical() {
    return this.http.get<any>(this.baseUrlNew + '/tables/class/3')
  }
  getIceCream() {
    return this.http.get<any>(this.baseUrlNew + '/tables/class/4')
  }
  getOthers() {
    return this.http.get<any>(this.baseUrlNew + '/tables/class/5')
  }

  putProduct(data : any, id : number) {
    return this.http.put<any>(this.baseUrl + '/products/' + id, data)
  }

  deleteProduct(id : number) {
    return this.http.delete<any>(this.baseUrl + '/products/' + id)
  }

}
