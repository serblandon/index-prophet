import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { switchMap } from 'rxjs';
import { IAssetData } from 'src/app/models/IAssetData';
import { IndividualAssetService } from 'src/app/services/individual-asset/individual-asset.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { ChartModule } from 'primeng/chart';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-individual-asset',
  standalone: true,
  imports: [AutoCompleteModule, CommonModule, SearchBarComponent, ChartModule],
  templateUrl: './individual-asset.component.html',
  styleUrl: './individual-asset.component.scss'
})
export class IndividualAssetComponent implements OnInit {

  ticker = '';
  assetData: IAssetData = {};
  assetDataKeys: string[] = [];
  assetDataChart: any;
  chartOptions: any;
  
  constructor(private route: ActivatedRoute,
              private individualAssetService: IndividualAssetService,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.ticker = params.get('ticker')!;
          return this.individualAssetService.getAssetPrices(this.ticker);
        })
      )
      .subscribe(
        (data: IAssetData) => {
          this.assetData = data;
          this.assetDataKeys = Object.keys(this.assetData);

          // Prepare chart data
          this.assetDataChart = {
            labels: this.assetDataKeys.map((key) => key.substring(0, 10)), // Extracting the year from the date string
            datasets: [
              {
                type:'line',
                data: this.assetDataKeys.map((key) => this.assetData[key]),
                fill: false,
                pointStyle:false
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
        (error) => {
          console.error('Failed to get asset data:', error);
        }
      );
  }

  goToHomePage() {
    this.router.navigate(['/']); // Navigate to the homepage without reloading the application
  }

}
