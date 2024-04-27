import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssetData } from 'src/app/models/IAssetData';
import { GenericRestApi } from 'src/app/shared/generic-rest-api';

@Injectable({
  providedIn: 'root'
})
export class IndividualAssetHistoricalService extends GenericRestApi<IAssetData>{

  constructor(protected override httpClient: HttpClient) {
    super(httpClient, "api/HistoricalPrices/GetHistoricalAssetPricesAscending");
   }

}
