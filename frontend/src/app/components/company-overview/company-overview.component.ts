import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { LiveApiService } from 'src/app/services/live-api/live-api.service';

@Component({
  selector: 'app-company-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-overview.component.html',
  styleUrl: './company-overview.component.scss'
})
export class CompanyOverviewComponent implements OnInit {
  @Input() ticker: string = '';
  overviewData: any = {};

  constructor(private liveApiService: LiveApiService) {}

  ngOnInit(): void {
    this.fetchCompanyOverview();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticker'] && !changes['ticker'].isFirstChange()) {
      this.fetchCompanyOverview();
    }
  }

  private fetchCompanyOverview(): void {
    if (this.ticker) {
      this.liveApiService.getCompanyOverview(this.ticker).subscribe({
        next: (data: any) => {
          this.overviewData = data;
        },
        error: (error: any) => {
          console.error('Failed to get company overview data from API', error);
        }
      });
    }
  }
}
