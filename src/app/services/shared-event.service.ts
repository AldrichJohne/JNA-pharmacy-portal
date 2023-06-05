import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {
  private uiVersion = '1.2.0';
  private pharmacyProductMsApiUrl = 'http://localhost:8081/product-ms';
  private pharmacistGlobal = new BehaviorSubject<string>('');
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

  triggerRefreshTable = new Subject<any>();

  batchAddButtonTrigger = new Subject<any>();

  addNewItemToCart = new Subject<any>();
}
