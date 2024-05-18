import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { ChartModule } from 'primeng/chart';
import { switchMap } from 'rxjs';
import { IAssetPredictedData } from 'src/app/models/IAssetPredictedData';
import { CsvExportService } from 'src/app/services/csv-export/csv-export.service';
import { IndividualAssetPredictedService } from 'src/app/services/individual-asset-predicted/individual-asset-predicted.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-lstm-prediction',
  standalone: true,
  imports: [CommonModule, ChartModule, SplitButtonModule],
  templateUrl: './lstm-prediction.component.html',
  styleUrl: './lstm-prediction.component.scss'
})
export class LstmPredictionComponent implements OnInit, OnChanges{

  @Input() assetData: any;
  @ViewChild('chart') chartElement!: ElementRef;

  ticker = '';
  predictionMethod = 'LSTM';
  predictedData: IAssetPredictedData[] = [];
  totalDataChart: any;
  chartOptions: any;

  exportItems: MenuItem[];

  constructor(private route: ActivatedRoute,
    private individualAssetPredictedService: IndividualAssetPredictedService,
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

    exportDataAsCSV() {
      this.csvExportService.downloadFile(this.predictedData, `${this.ticker}-LSTM`);
      
      this.toastr.success(`${this.ticker.toUpperCase()}-CSV-LSTM has been successfully downloaded.`, 'Success');
    }

    exportChartAsPDF() {
      if (this.chartElement) {
        const chartElement = this.chartElement.nativeElement;
        html2canvas(chartElement).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape');
          const imgWidth = 280; // Adjust the width as needed
          const imgHeight = canvas.height * imgWidth / canvas.width;
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`${this.ticker}-chart-LSTM.pdf`);
  
          this.toastr.success(`${this.ticker.toUpperCase()}-LSTM has been successfully exported as PDF.`, 'Success');
        }).catch(error => {
          this.toastr.error('Failed to export chart as PDF.', 'Error');
        });
      } else {
        this.toastr.error('Chart element is not available.', 'Error');
      }
    }
}
