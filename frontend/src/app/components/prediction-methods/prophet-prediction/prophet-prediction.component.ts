import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import 'chartjs-adapter-moment';
import { IAssetPredictedData } from 'src/app/models/IAssetPredictedData';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IndividualAssetPredictedService } from 'src/app/services/individual-asset-predicted/individual-asset-predicted.service';
import { switchMap } from 'rxjs';
import { CsvExportService } from 'src/app/services/csv-export/csv-export.service';
import { ToastrService } from 'ngx-toastr';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-prophet-prediction',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './prophet-prediction.component.html',
  styleUrl: './prophet-prediction.component.scss'
})
export class ProphetPredictionComponent implements OnInit {

  @Input() assetData: any;
  @ViewChild('chart') chartElement!: ElementRef;

  ticker = '';
  predictionMethod = 'Prophet';
  predictedData: IAssetPredictedData[] = [];
  totalDataChart: any;
  chartOptions: any;

  constructor(private route: ActivatedRoute,
    private individualAssetPredictedService: IndividualAssetPredictedService,
    private csvExportService: CsvExportService,
    private toastr: ToastrService) { }

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

    exportDataAsCSV() {
      this.csvExportService.downloadFile(this.predictedData, `${this.ticker}-Prophet`);

      this.toastr.success(`${this.ticker.toUpperCase()}-CSV-Prophet has been successfully downloaded.`, 'Success');
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
          pdf.save(`${this.ticker}-chart-Prophet.pdf`);
  
          this.toastr.success(`${this.ticker.toUpperCase()}-Prophet has been successfully exported as PDF.`, 'Success');
        }).catch(error => {
          this.toastr.error('Failed to export chart as PDF.', 'Error');
        });
      } else {
        this.toastr.error('Chart element is not available.', 'Error');
      }
    }
}
