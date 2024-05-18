import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { switchMap } from 'rxjs';
import { IAssetHistoricalData } from 'src/app/models/IAssetHistoricalData';
import { IndividualAssetHistoricalService } from 'src/app/services/individual-asset-historical/individual-asset-historical.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { ChartModule } from 'primeng/chart';
import 'chartjs-adapter-moment';
import { MenuItem, SelectItem } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProphetPredictionComponent } from '../../prediction-methods/prophet-prediction/prophet-prediction.component';
import { LstmPredictionComponent } from '../../prediction-methods/lstm-prediction/lstm-prediction/lstm-prediction.component';
import { GruPredictionComponent } from '../../prediction-methods/gru-prediction/gru-prediction/gru-prediction.component';
import { CsvExportService } from 'src/app/services/csv-export/csv-export.service';
import { ToastrService } from 'ngx-toastr';
import { SplitButtonModule } from 'primeng/splitbutton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-individual-asset',
  standalone: true,
  imports: [AutoCompleteModule, CommonModule, SearchBarComponent, ChartModule, ProphetPredictionComponent, LstmPredictionComponent, GruPredictionComponent, TabViewModule, DropdownModule, FormsModule, SplitButtonModule],
  templateUrl: './individual-asset.component.html',
  styleUrl: './individual-asset.component.scss'
})
export class IndividualAssetComponent implements OnInit {

  @ViewChild('chart') chartElement!: ElementRef;

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

  exportItems: MenuItem[];
  
  constructor(private route: ActivatedRoute,
              private individualAssetHistoricalService: IndividualAssetHistoricalService,
              private router: Router,
              private csvExportService: CsvExportService,
              private toastr: ToastrService) { 
                this.exportItems = [
                  { label: 'Export as CSV', icon: 'pi pi-file', command: () => this.exportDataAsCSV() },
                  { label: 'Export as PDF', icon: 'pi pi-file-pdf', command: () => this.exportChartAsPDF() }
                ];
              }

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
  
    this.toastr.success('You have successfully navigated to the Home Page.', 'Success');
  }

  exportDataAsCSV() {
    this.csvExportService.downloadFile(this.assetData, `${this.ticker.toUpperCase()}-historical`);

    this.toastr.success(`${this.ticker.toUpperCase()}-CSV-Historical has been successfully downloaded.`, 'Success');
  }

  exportChartAsPDF() {
    if (this.chartElement) {
      const chartElement = this.chartElement.nativeElement;
      html2canvas(chartElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');
        const imgWidth = 280;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`${this.ticker.toUpperCase()}-chart-historical.pdf`);

        this.toastr.success(`${this.ticker.toUpperCase()}-Historical has been successfully exported as PDF.`, 'Success');
      }).catch(error => {
        this.toastr.error('Failed to export chart as PDF.', 'Error');
      });
    } else {
      this.toastr.error('Chart element is not available.', 'Error');
    }
  }

}
