import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TickerService } from '../../services/ticker/ticker.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule, ButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  ticker = '';
  suggestions: string[] = [];

  constructor(private router: Router, private tickerService: TickerService) { }

  ngOnInit() {
    this.tickerService.getTickers().then((tickers: unknown) => {
      this.suggestions = tickers as string[];
    }).catch((error: any) => {
      console.error('Failed to get tickers:', error);
    });
  }


  searchStock() {
    if (this.ticker && this.ticker.length > 0) {
      this.router.navigate(['/ticker', this.ticker])
        .then(() => {
          console.log('Navigation to stock detail successful!');
        })
        .catch(err => {
          console.error(`Navigation to stock detail failed: ${err}`);
        });
    }
  }

  suggest(event: any) {
    const query = event.query;
    this.suggestions = Array.from(new Set(
      this.tickerService.data.filter(ticker => ticker.toLowerCase().startsWith(query.toLowerCase()))
    ));
  }

}
