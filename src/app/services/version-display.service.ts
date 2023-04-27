import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VersionDisplayService {

  private baseUrl = 'http://localhost:9091/health';

  constructor(private http : HttpClient) { }

  healthCheck() {
    return this.http.get<any>(this.baseUrl + '/check');
  }
}
