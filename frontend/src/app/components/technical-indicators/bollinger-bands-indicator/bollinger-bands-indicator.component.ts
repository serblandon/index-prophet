import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { SplitButtonModule } from 'primeng/splitbutton';
import { switchMap } from 'rxjs';
import { IBollingerBandsData } from 'src/app/models/IBollingerBandsData';
import { CsvExportService } from 'src/app/services/csv-export/csv-export.service';
import { TechnicalIndicatorService } from 'src/app/services/technical-indicator/technical-indicator.service';
import { DatePickerComponent } from '../../date-picker/date-picker.component';

@Component({
  selector: 'app-bollinger-bands-indicator',
  standalone: true,
  imports: [CommonModule, ChartModule, SplitButtonModule, DatePickerComponent],
  templateUrl: './bollinger-bands-indicator.component.html',
  styleUrl: './bollinger-bands-indicator.component.scss'
})
export class BollingerBandsIndicatorComponent implements OnInit{

  @ViewChild('chart') chartElement!: ElementRef;

  ticker = '';
  technicalIndicator = 'Bollinger Bands';
  indicatorData: IBollingerBandsData[] = [];
  totalDataChart: any;
  chartOptions: any;

  filteredAssetData: IBollingerBandsData[] = [];
  filteredAssetDataChart: any;

  exportItems: MenuItem[];

  constructor(private route: ActivatedRoute,
    private technicalIndicatorService: TechnicalIndicatorService,
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
            return this.technicalIndicatorService.getBollingerBandsValues(this.ticker);
          })
        )
        .subscribe({
          next: (data: IBollingerBandsData[]) => {
            this.indicatorData = data;
            this.filteredAssetData = data;
            this.prepareChartData(this.indicatorData);
          },
          error: (error) => {
            console.error('Failed to get asset data:', error);
          }
        });
      }

  exportDataAsCSV() {
    this.csvExportService.downloadFile(this.totalDataChart, `${this.ticker.toUpperCase()}-historical`);

    this.toastr.success(`${this.ticker.toUpperCase()}-CSV-Bollinger has been successfully downloaded.`, 'Success');
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
        pdf.save(`${this.ticker.toUpperCase()}-chart-Bollinger.pdf`);

        this.toastr.success(`${this.ticker.toUpperCase()}-Bollinger has been successfully exported as PDF.`, 'Success');
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
      this.filteredAssetData = this.indicatorData.filter((data) => {
        const date = new Date(data.date);
        return date >= startDate && date <= endDate;
      });
      this.prepareChartData(this.filteredAssetData);
    } else {
      this.filteredAssetData = this.indicatorData;
      this.prepareChartData(this.indicatorData);
    }
  }

  prepareChartData(data: IBollingerBandsData[] = this.indicatorData) {
    this.filteredAssetDataChart = {
      labels: data.map((entity) => entity.date.toString()),
      datasets: [
        {
          label: 'Upper Band',
          type: 'line',
          data: data.map((entity) => entity.bollingerUpper),
          fill: false,
          pointStyle: false,
          borderColor: 'rgba(255, 0, 0, 1)',
          tension: 0.1
        },
        {
          label: 'Lower Band',
          type: 'line',
          data: data.map((entity) => entity.bollingerLower),
          fill: false,
          pointStyle: false,
          borderColor: 'rgba(0, 0, 255, 1)',
          tension: 0.1
        },
        {
          label: 'SMA',
          type: 'line',
          data: data.map((entity) => entity.sma),
          fill: false,
          pointStyle: false,
          borderColor: 'rgba(0, 255, 0, 1)',
          tension: 0.1
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          label: 'Value',
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0.8)',
          bodyColor: '#ffffff',
          bodyFont: {
            size: 14
          },
          borderColor: '#42A5F5',
          borderWidth: 0.4,
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
