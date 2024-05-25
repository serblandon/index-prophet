import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ILivePrice } from 'src/app/models/ILivePrice';
import { LivePriceService } from 'src/app/services/live-price/live-price.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SearchBarComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit{
  livePrices: ILivePrice[] = [];

  constructor(private livePriceService: LivePriceService) {}

  ngOnInit(): void {
    this.fetchLivePrices();
  }

  fetchLivePrices() {
    this.livePriceService.getLivePrices().subscribe(prices => {
      this.livePrices = prices;
    });
  }
}
