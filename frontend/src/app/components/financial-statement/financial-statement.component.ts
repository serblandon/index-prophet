import { CommonModule, KeyValuePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { LiveApiService } from 'src/app/services/live-api/live-api.service';

@Component({
  selector: 'app-financial-statement',
  standalone: true,
  imports: [CommonModule, TabViewModule, DropdownModule, FormsModule, KeyValuePipe],
  templateUrl: './financial-statement.component.html',
  styleUrl: './financial-statement.component.scss'
})
export class FinancialStatementComponent {
  @Input() ticker: string = '';
  balanceSheet: any = {};
  incomeStatement: any = {};
  cashFlow: any = {};

  financialStatements: SelectItem[] = [
    { label: 'Income Statement', value: 'Income' },
    { label: 'Balance Sheet', value: 'Balance'},
    { label: 'Cash Flow Statement', value: 'Cash'}
  ];
  selectedFinancialStatement: SelectItem = this.financialStatements[0];
  
  constructor(private liveApiService: LiveApiService) {}

  ngOnInit(): void {
    if (this.ticker) {
      this.loadFinancialStatement('BALANCE_SHEET', 'balanceSheet');
      this.loadFinancialStatement('INCOME_STATEMENT', 'incomeStatement');
      this.loadFinancialStatement('CASH_FLOW', 'cashFlow');
    }
  }

  loadFinancialStatement(statementType: string, property: string): void {
    this.liveApiService.getFinancialStatement(this.ticker, statementType).subscribe({
      next: (data: any) => {
      (this as any)[property] = Object.entries(data);
    }, error: (err) => {
      console.error(`Failed to load ${statementType} for ${this.ticker}`, err);
      }
    });
  }

  formatValue(value: any): string {
    if (this.isNumeric(value)) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value));
    }
    return value;
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  asKeyValue(value: any): { [key: string]: any } {
    return typeof value === 'object' && value !== null ? value : {};
  }
}
