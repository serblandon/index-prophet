import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class GenericRestApi<T> {
    protected url = '';

    constructor(protected httpClient: HttpClient, private controller: string = '') {
        this.url = `/${this.controller}`;
    }
  
    public getByTicker(ticker: string): Observable<T[]> {
      return this.httpClient.get<T[]>(`${this.url}/${ticker}`);
    }

    public getByTickerAndPredictionMethod(ticker: string, predictionMethod: string): Observable<T[]> {
      return this.httpClient.get<T[]>(`${this.url}/${ticker}/${predictionMethod}`);
    }
}