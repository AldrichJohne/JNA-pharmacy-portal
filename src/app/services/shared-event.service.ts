import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {
  private uiVersion = '1.2.0';
  private pharmacyProductMsApiUrl = 'http://localhost:8081/product-ms';
  private pharmacistGlobal = new BehaviorSubject<string>('');
  private cartItemsGlobal = new BehaviorSubject<any>('');
  cartItems: any[] = [];
  cartItemsGlobal$ = this.cartItemsGlobal.asObservable();
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
  }

  getCartItems() {
    return this.cartItems;
  }

  triggerRefreshTable = new Subject<any>();

  batchAddButtonTrigger = new Subject<any>();

  addNewItemToCart = new Subject<any>();
}
