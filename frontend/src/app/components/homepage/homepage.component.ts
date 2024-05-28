import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { LiveApiService } from 'src/app/services/live-api/live-api.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SearchBarComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit{
  topGainers: any[] = [];
  topLosers: any[] = [];

  constructor(private liveApiService: LiveApiService) {}

  ngOnInit() {
    this.fetchTopGainersAndLosers();
  }

  fetchTopGainersAndLosers() {
    this.liveApiService.getTopGainersAndLosers().subscribe(data => {
      if (data.top_gainers) {
        this.topGainers = data.top_gainers.slice(0, 3);
      }
      if (data.top_losers) {
        this.topLosers = data.top_losers.slice(0, 3);
      }
    });
  }
}
