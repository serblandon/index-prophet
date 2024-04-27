import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssetPredictedData } from 'src/app/models/IAssetPredictedData';
import { GenericRestApi } from 'src/app/shared/generic-rest-api';

@Injectable({
  providedIn: 'root'
})
export class IndividualAssetPredictedService extends GenericRestApi<IAssetPredictedData> {

  constructor(protected override httpClient: HttpClient) { 
    super(httpClient, "api/PredictedPrices/GetPredictedAssetPricesAscendingAsync");
  }
}
