import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {
  private uiVersion = '1.0.2';
  private pharmacyProductMsApiUrl = 'http://localhost:9091';
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
}
