import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { ILivePrice } from 'src/app/models/ILivePrice';

@Injectable({
  providedIn: 'root'
})
export class LiveApiService{
  protected apiUrl = 'https://www.alphavantage.co/query';
  protected apiKey = '2E4P60FNR7VET9BF';
  private cacheTTL = 60 * 10000; // 10 min cache

  constructor(protected httpClient: HttpClient, private cacheService: CacheService) {}

  public getTopGainersAndLosers(): Observable<any> {
    const cacheKey = 'topGainersAndLosers';
    const cachedData = this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    return this.httpClient.get<ILivePrice[]>(`${this.apiUrl}?function=TOP_GAINERS_LOSERS&apikey=${this.apiKey}`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, this.cacheTTL)),
      catchError(this.handleError<any>('getTopGainersAndLosers', []))
    );
  }

  public getCompanyOverview(symbol: string): Observable<any> {
    const cacheKey = `overview-${symbol}`;
    const cachedData = this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    return this.httpClient.get<any>(`${this.apiUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`).pipe(
      tap(data => this.cacheService.set(cacheKey, data, this.cacheTTL)),
      catchError(this.handleError<any>('getCompanyOverview', {}))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
