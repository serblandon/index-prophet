import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { switchMap } from 'rxjs';
import { IAssetHistoricalData } from 'src/app/models/IAssetHistoricalData';
import { IndividualAssetHistoricalService } from 'src/app/services/individual-asset-historical/individual-asset-historical.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ChartModule } from 'primeng/chart';
import 'chartjs-adapter-moment';
import { MenuItem, SelectItem } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProphetPredictionComponent } from '../prediction-methods/prophet-prediction/prophet-prediction.component';
import { LstmPredictionComponent } from '../prediction-methods/lstm-prediction/lstm-prediction.component';
import { GruPredictionComponent } from '../prediction-methods/gru-prediction/gru-prediction.component';
import { CsvExportService } from 'src/app/services/csv-export/csv-export.service';
import { ToastrService } from 'ngx-toastr';
import { SplitButtonModule } from 'primeng/splitbutton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { RsiIndicatorComponent } from '../technical-indicators/rsi-indicator/rsi-indicator.component';
import { SmaIndicatorComponent } from '../technical-indicators/sma-indicator/sma-indicator.component';
import { BollingerBandsIndicatorComponent } from '../technical-indicators/bollinger-bands-indicator/bollinger-bands-indicator.component';
import { CompanyOverviewComponent } from '../company-overview/company-overview.component';

@Component({
  selector: 'app-individual-asset',
  standalone: true,
  imports: [AutoCompleteModule, CommonModule, SearchBarComponent, ChartModule,
            ProphetPredictionComponent, LstmPredictionComponent, GruPredictionComponent,
            TabViewModule, DropdownModule, FormsModule, SplitButtonModule, DatePickerComponent,
            RsiIndicatorComponent, SmaIndicatorComponent, BollingerBandsIndicatorComponent, CompanyOverviewComponent ],
  templateUrl: './individual-asset.component.html',
  styleUrl: './individual-asset.component.scss'
})
export class IndividualAssetComponent implements OnInit {

  @ViewChild('chart') chartElement!: ElementRef;

  ticker = '';
  assetData: IAssetHistoricalData[] = [];
  assetDataChart: any;
  chartOptions: any;

  filteredAssetData: IAssetHistoricalData[] = [];
  filteredAssetDataChart: any;

  predictionMethods: SelectItem[] = [
    { label: 'Prophet Prediction', value: 'prophet' },
    { label: 'LSTM Prediction', value: 'LSTM'},
    { label: 'GRU Prediction', value: 'GRU'}
  ];
  selectedPrediction: SelectItem = this.predictionMethods[0];

  technicalIndicators: SelectItem[] = [
    { label: 'Relative Strength Index (RSI)', value: 'RSI' },
    { label: 'Simple Moving Average (SMA)', value: 'SMA'},
    { label: 'Bollinger Bands', value: 'Bollinger Bands'}
  ];
  selectedIndicator: SelectItem = this.technicalIndicators[0];

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
          this.filteredAssetData = data;
          this.prepareChartData(this.assetData);
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
    this.csvExportService.downloadFile(this.filteredAssetData, `${this.ticker.toUpperCase()}-historical`);

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

  applyDateRange(dateRange: { startDate: Date | null, endDate: Date | null }) {
    const { startDate, endDate } = dateRange;
    if (startDate && endDate) {
      this.filteredAssetData = this.assetData.filter((data) => {
        const date = new Date(data.date);
        return date >= startDate && date <= endDate;
      });
      this.prepareChartData(this.filteredAssetData);
    } else {
      this.filteredAssetData = this.assetData;
      this.prepareChartData(this.assetData);
    }
  }

  prepareChartData(data: IAssetHistoricalData[] = this.assetData) {
    this.filteredAssetDataChart = {
      labels: data.map((entity) => entity.date.toString()),
      datasets: [
        {
          type: 'line',
          data: data.map((entity) => entity.adjClosePrice),
          fill: false,
          pointStyle: false,
          pointRadius: 3,
          tension: 0.1
        }
      ]
    };

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
          beginAtZero: true
        }
      },
      responsive: true,
      animation: {
        duration: 1600,
        easing: 'easeInOutQuad'
      }
    };
  }

}
