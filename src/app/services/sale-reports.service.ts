import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SharedEventService} from "./shared-event.service";

@Injectable({
  providedIn: 'root'
})
export class SaleReportsService {
  pharmacyProductMsApiUrl = '';

  constructor(private http : HttpClient,
              public shareEventService: SharedEventService) {
    this.pharmacyProductMsApiUrl = this.shareEventService.getPharmacyProductUrl();
  }

  getReportByDateRange(startDate: string, endDate: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = { startDate, endDate };
    return this.http.get<any>(this.pharmacyProductMsApiUrl + '/report/range', { headers, params });
  }
}
