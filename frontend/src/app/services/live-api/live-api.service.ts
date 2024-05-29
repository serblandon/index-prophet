import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveApiService{
  private backendUrl = '/api/liveapi';

  constructor(private httpClient: HttpClient) {}

  public getTopGainersAndLosers(): Observable<any> {
    return this.httpClient.get<any>(`${this.backendUrl}/topGainersAndLosers`).pipe(
      catchError(this.handleError<any>('getTopGainersAndLosers', { topGainers: [], topLosers: [] }))
    );
  }

  public getCompanyOverview(symbol: string): Observable<any> {
    return this.httpClient.get<any>(`${this.backendUrl}/overview/${symbol}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
