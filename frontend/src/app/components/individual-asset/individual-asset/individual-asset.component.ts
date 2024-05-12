import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { switchMap } from 'rxjs';
import { IAssetHistoricalData } from 'src/app/models/IAssetHistoricalData';
import { IndividualAssetHistoricalService } from 'src/app/services/individual-asset-historical/individual-asset-historical.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { ChartModule } from 'primeng/chart';
import 'chartjs-adapter-moment';
import { SelectItem } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProphetPredictionComponent } from '../../prediction-methods/prophet-prediction/prophet-prediction.component';
import { LstmPredictionComponent } from '../../prediction-methods/lstm-prediction/lstm-prediction/lstm-prediction.component';
import { GruPredictionComponent } from '../../prediction-methods/gru-prediction/gru-prediction/gru-prediction.component';
import { CsvExportService } from 'src/app/services/csv-export/csv-export.service';

@Component({
  selector: 'app-individual-asset',
  standalone: true,
  imports: [AutoCompleteModule, CommonModule, SearchBarComponent, ChartModule, ProphetPredictionComponent, LstmPredictionComponent, GruPredictionComponent, TabViewModule, DropdownModule, FormsModule],
  templateUrl: './individual-asset.component.html',
  styleUrl: './individual-asset.component.scss'
})
export class IndividualAssetComponent implements OnInit {

  ticker = '';
  assetData: IAssetHistoricalData[] = [];
  assetDataChart: any;
  chartOptions: any;

  // dropdown predictions
  predictionMethods: SelectItem[] = [
    { label: 'Prophet Prediction', value: 'prophet' },
    { label: 'LSTM Prediction', value: 'LSTM'},
    { label: 'GRU Prediction', value: 'GRU'}
  ];
  selectedPrediction: SelectItem = this.predictionMethods[0];
  
  constructor(private route: ActivatedRoute,
              private individualAssetHistoricalService: IndividualAssetHistoricalService,
              private router: Router,
              private csvExportService: CsvExportService) { }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.ticker = params.get('ticker')!;
          return this.individualAssetHistoricalService.getByTicker(this.ticker);
        })
      )
      .subscribe({
        next: (data: IAssetHistoricalData[]) => {
          this.assetData = data;

          // Prepare chart data
          this.assetDataChart = {
            labels: this.assetData.map((entity) => entity.date.toString()),
            datasets: [
              {
                type:'line',
                data: this.assetData.map((entity) => entity.adjClosePrice),
                fill: false,
                pointStyle:false,
                pointRadius: 3,
                tension: 0.1
              }
            ]
          };

          // Set chart options
          this.chartOptions = {
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                label: 'Price',
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.8)',
                bodyColor: '#ffffff',
                bodyFont: {
                  size: 14
                },
                borderColor: '#42A5F5',
                borderWidth: 1,
                cornerRadius: 3,
                displayColors: false,
                mode: 'index',
                intersect: false
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
        }
    });
  }

  goToHomePage() {
    this.router.navigate(['/']); // Navigate to the homepage without reloading the application
  }

  exportDataAsCSV() {
    this.csvExportService.downloadFile(this.assetData, `${this.ticker}-historical`);
  }

}
