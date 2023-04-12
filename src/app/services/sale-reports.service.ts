import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SaleReportsService {
  private baseUrl = 'http://localhost:8081/report';

  constructor(private http : HttpClient) { }

  getReportByDateRange(startDate: string, endDate: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = { startDate, endDate };
    return this.http.get<any>(this.baseUrl + '/range', { headers, params });
  }
}
