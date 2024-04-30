import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TickerService } from '../../services/ticker/ticker.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [AutoCompleteModule, FormsModule, ButtonModule, ToastrModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  ticker = '';
  suggestions: string[] = [];

  constructor(private router: Router,
              private tickerService: TickerService,
              private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.tickerService.getTickers().then((tickers: unknown) => {
      this.suggestions = tickers as string[];
    }).catch((error: any) => {
      console.error('Failed to get tickers:', error);
    });
  }


  searchStock() {
    if (this.isInSp500(this.ticker)) {
      if (this.isTickerValid(this.ticker)) {
        this.router.navigate(['/ticker', this.ticker])
          .then(() => {
            this.toastr.success(`Navigation to '${this.ticker.toUpperCase()}' was successful!`, 'Success')
          })
          .catch(err => {
            this.toastr.error(`Navigation to '${this.ticker.toUpperCase()}: ${err}' failed!`, 'Error');
          });
      }
    }
    else {
      this.toastr.error(`Ticker '${this.ticker}' is not part of S&P 500`, 'Error');
    }
  }

  suggest(event: any) {
    const query = event.query;
    this.suggestions = Array.from(new Set(
      this.tickerService.data.filter(ticker => ticker.toLowerCase().startsWith(query.toLowerCase()))
    ));
  }

  private isInSp500(ticker: string) {
    if (this.suggestions.includes(ticker.toUpperCase())) {
      return true;
    }
    return false;
  }

  private isTickerValid(ticker: string) {
    if (ticker && ticker.length > 0) {
      return true;
    }
    return false;
  }
}
