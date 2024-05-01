import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { switchMap } from 'rxjs';
import { IAssetPredictedData } from 'src/app/models/IAssetPredictedData';
import { IndividualAssetPredictedService } from 'src/app/services/individual-asset-predicted/individual-asset-predicted.service';

@Component({
  selector: 'app-lstm-prediction',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './lstm-prediction.component.html',
  styleUrl: './lstm-prediction.component.scss'
})
export class LstmPredictionComponent implements OnInit, OnChanges{

  @Input() assetData: any;

  ticker = '';
  predictionMethod = 'LSTM';
  predictedData: IAssetPredictedData[] = [];
  totalDataChart: any;
  chartOptions: any;

  constructor(private route: ActivatedRoute,
    private individualAssetPredictedService: IndividualAssetPredictedService) { }

    ngOnInit() {
      this.route.paramMap
        .pipe(
          switchMap((params: ParamMap) => {
            this.ticker = params.get('ticker')!;
            return this.individualAssetPredictedService.getByTickerAndPredictionMethod(this.ticker, this.predictionMethod);
          })
        )
        .subscribe({
          next: (data: IAssetPredictedData[]) => {
            this.predictedData = data;
            
            const assetDataValues = this.assetData.map((entity: any) => entity.adjClosePrice);
            const lstmDataValues = this.predictedData.map((entity) => entity.adjClosePrice);
            const assetDataLength = assetDataValues.length;
            const lstmDataAdjusted = Array(assetDataLength).fill(null).concat(lstmDataValues);

            // Prepare chart data
            this.totalDataChart = {
              labels: this.assetData.concat(this.predictedData).map((entity: any) => entity.date),
              datasets: [
                {
                  type:'line',
                  label: 'LSTM Prediction',
                  data: lstmDataAdjusted,
                  fill: false,
                  pointStyle: false,
                  pointRadius: 3,
                  tension: 0.1,
                  borderColor: 'red'
                },
                {
                  type:'line',
                  label: 'Historical Prices',
                  data: this.assetData.map((entity: any) => entity.adjClosePrice),
                  fill: false,
                  pointStyle: false,
                  pointRadius: 3,
                  tension: 0.1,
                  borderColor: '#5da0e3'
                }
              ]
            };
  
            // Set chart options
            this.chartOptions = {
              plugins: {
                legend: {
                  display: true,
                },
                tooltip: {
                  label: 'Price',
                  enabled: true// <-- this option disables tooltips
                }
                },
              scales: {
                y: {
                  beginAtZero: true // Start the y-axis from zero
                }
              },
              responsive: true, // Make the chart responsive
              animation: {
                duration: 1600, // general animation time
                easing: 'easeInOutQuad'
              }
            };
  
          },
          error: (error) => {
            console.error('Failed to get asset data:', error);
          },
      });
    }

    ngOnChanges(changes: SimpleChanges): void {
      // This will run whenever any input properties change
    }
}
