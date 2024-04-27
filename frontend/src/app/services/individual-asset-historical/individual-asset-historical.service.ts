import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssetHistoricalData } from 'src/app/models/IAssetHistoricalData';
import { GenericRestApi } from 'src/app/shared/generic-rest-api';

@Injectable({
  providedIn: 'root'
})
export class IndividualAssetHistoricalService extends GenericRestApi<IAssetHistoricalData>{

  constructor(protected override httpClient: HttpClient) {
    super(httpClient, "api/HistoricalPrices/GetHistoricalAssetPricesAscending");
   }

}
