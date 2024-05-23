import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBollingerBandsData } from 'src/app/models/IBollingerBandsData';
import { IRsiData } from 'src/app/models/IRsiData';
import { ISmaData } from 'src/app/models/ISmaData';

@Injectable({
  providedIn: 'root'
})
export class TechnicalIndicatorService {

  constructor(private httpClient: HttpClient) {}

  getRsiValues(ticker: string): Observable<IRsiData[]> {
    return this.httpClient.get<IRsiData[]>(`/api/TechnicalIndicators/GetRsiValuesAscending/rsi/${ticker}`);
  }

  getSmaValues(ticker: string): Observable<ISmaData[]> {
    return this.httpClient.get<ISmaData[]>(`/api/TechnicalIndicators/GetSmaValuesAscending/sma/${ticker}`);
  }

  getBollingerBandsValues(ticker: string): Observable<IBollingerBandsData[]> {
    return this.httpClient.get<IBollingerBandsData[]>(`/api/TechnicalIndicators/GetBollingerBandsValuesAscending/bollingerbands/${ticker}`);
  }
}
