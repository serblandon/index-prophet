import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAssetData } from 'src/app/models/IAssetData';

@Injectable({
  providedIn: 'root'
})
export class IndividualAssetService {

  constructor(private httpClient: HttpClient) { }

  getAssetPrices(ticker: string): Observable<IAssetData> {
    return this.httpClient.get<IAssetData>(`./src/assets/mock-data/${ticker}.json`);
  }
}
