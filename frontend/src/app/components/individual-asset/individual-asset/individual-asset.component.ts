import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { switchMap } from 'rxjs';
import { IAssetData } from 'src/app/models/IAssetData';
import { IndividualAssetHistoricalService } from 'src/app/services/individual-asset/individual-asset-historical.service';
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
  assetData: IAssetData[] = [];
  assetDataChart: any;
  chartOptions: any;
  
  constructor(private route: ActivatedRoute,
              private individualAssetHistoricalService: IndividualAssetHistoricalService,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.ticker = params.get('ticker')!;
          return this.individualAssetHistoricalService.getByTicker(this.ticker);
        })
      )
      .subscribe({
        next: (data: IAssetData[]) => {
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
        }
    });
  }

  goToHomePage() {
    this.router.navigate(['/']); // Navigate to the homepage without reloading the application
  }

}
