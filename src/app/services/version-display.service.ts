import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SharedEventService} from "./shared-event.service";

@Injectable({
  providedIn: 'root'
})
export class VersionDisplayService {
  pharmacyProductMsApiUrl = '';

  constructor(private http : HttpClient,
              public shareEventService: SharedEventService) {
    this.pharmacyProductMsApiUrl = this.shareEventService.getPharmacyProductUrl();
  }

  healthCheck() {
    return this.http.get<any>(this.pharmacyProductMsApiUrl + '/health/check');
  }
}
