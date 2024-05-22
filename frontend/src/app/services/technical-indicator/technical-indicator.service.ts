import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRsiData } from 'src/app/models/IRsiData';

@Injectable({
  providedIn: 'root'
})
export class TechnicalIndicatorService {

  constructor(private httpClient: HttpClient) {}

  getRsiValues(ticker: string): Observable<IRsiData[]> {
    return this.httpClient.get<IRsiData[]>(`/api/TechnicalIndicators/GetRsiValuesAscending/rsi/${ticker}`);
  }
}
