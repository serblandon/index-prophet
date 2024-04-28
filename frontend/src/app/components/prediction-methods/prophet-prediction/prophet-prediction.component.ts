import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import 'chartjs-adapter-moment';
import { IAssetPredictedData } from 'src/app/models/IAssetPredictedData';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IndividualAssetPredictedService } from 'src/app/services/individual-asset-predicted/individual-asset-predicted.service';
import { switchMap } from 'rxjs';
import { IndividualAssetHistoricalService } from 'src/app/services/individual-asset-historical/individual-asset-historical.service';
import { IAssetHistoricalData } from 'src/app/models/IAssetHistoricalData';

@Component({
  selector: 'app-prophet-prediction',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './prophet-prediction.component.html',
  styleUrl: './prophet-prediction.component.scss'
})
export class ProphetPredictionComponent implements OnInit {

  @Input() assetData: any;

  ticker = '';
  predictionMethod = 'Prophet';
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
  
            // Prepare chart data
            this.totalDataChart = {
              labels: this.predictedData.map((entity) => entity.date.toString()),
              datasets: [
                {
                  type:'line',
                  label: 'Prophet Prediction',
                  data: this.predictedData.map((entity) => entity.adjClosePrice),
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
              responsive: true // Make the chart responsive
            };
  
          },
          error: (error) => {
            console.error('Failed to get asset data:', error);
          },
      });
    }
}
