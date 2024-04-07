import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { ICsvData } from '../../models/ICsvData';

@Injectable({
  providedIn: 'root'
})
export class TickerService {

  data: string[] = [];

  constructor(private http: HttpClient) { }

  getTickers() {
    this.data = [];
    return new Promise((resolve, reject) => {
      this.http.get('./assets/data/sp500_tickers.csv', {responseType: 'text'})
        .subscribe(data => {
          Papa.parse(data, {
            header: true,
            step: (row) => {
              const record = row.data as ICsvData;
              this.data.push(record.Symbol);
            },
            complete: () => resolve(this.data),
            error: (error: Error) => reject(error)
          });
        });
    });
  }
}
