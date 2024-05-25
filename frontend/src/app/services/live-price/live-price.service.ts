import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILivePrice } from 'src/app/models/ILivePrice';
import { GenericRestApi } from 'src/app/shared/generic-rest-api';

@Injectable({
  providedIn: 'root'
})
export class LivePriceService extends GenericRestApi<ILivePrice>{

  constructor(protected override httpClient: HttpClient) {
    super(httpClient, "api/liveprice/latestPrice");
   }
}
