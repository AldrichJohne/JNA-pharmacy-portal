import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {
  private uiVersion = '1.2.0';
  private pharmacyProductMsApiUrl = 'http://localhost:8081/product-ms';
  private pharmacistGlobal = new BehaviorSubject<string>('');
  discountRate = .8;
  cartItems: any[] = [];
  cartTotalSrp = 0;
  pharmacistGlobal$ = this.pharmacistGlobal.asObservable();

  updatePharmacist(newPharmacistValue : string) {
    this.pharmacistGlobal.next(newPharmacistValue);
  }

  getPharmacyProductUrl() {
    return this.pharmacyProductMsApiUrl;
  }

  getUiVersion() {
    return this.uiVersion;
  }

  addItemToCart(item : any) {
    this.cartItems.push(item);
    this.computeTotalSrp();
  }

  removeItemsFromCart() {
    this.cartItems.splice(0, this.cartItems.length);
    this.computeTotalSrp();
  }

  removeItemFromCart(row : any) {
    const index = this.cartItems.indexOf(row);
    this.cartItems.splice(index, 1);
    this.computeTotalSrp();
  }

  private computeTotalSrp() {
    let totalSrp = 0;
    for (const element of this.cartItems) {
      if (element.isDiscounted === false) {
        totalSrp = totalSrp + (element.srp * element.soldQuantity);
      }
      else {
        totalSrp = totalSrp + ((element.srp * element.soldQuantity) * this.discountRate)
      }
    }
    this.cartTotalSrp = totalSrp;
  }

  getCartItems() {
    return this.cartItems;
  }

  refreshProductTab = new Subject<any>();

  batchAddButtonTrigger = new Subject<any>();

}
