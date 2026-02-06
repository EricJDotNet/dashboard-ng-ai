import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { StockTickerService } from '../../services/stockticker.service';

@Component({
    selector: 'app-stock-ticker',
    standalone: true,
    imports: [CommonModule, FormsModule, ChartModule, HttpClientModule, InputTextModule, ButtonModule],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Stock Ticker</div>
            <div class="flex gap-2 items-center mb-4">
                <input pInputText type="text" placeholder="Enter symbol (e.g. AAPL)" [(ngModel)]="symbol" (input)="validateSymbol()" class="p-inputtext p-component" />
                <button pButton type="button" label="View" [disabled]="!validSymbol || loading" (click)="view()"></button>
            </div>
            <div *ngIf="error" class="text-red-600 mb-4">{{ error }}</div>
            <div *ngIf="loading" class="mb-4">Loading...</div>
            <div *ngIf="chartData">
                <p-chart type="line" [data]="chartData" [options]="chartOptions" style="height:320px"></p-chart>
            </div>
        </div>
    `
})
export class StockTicker {
    symbol = '';
    validSymbol = false;
    loading = false;
    error: string | null = null;
    chartData: any | null = null;
    chartOptions: any;

    constructor(private stockService: StockTickerService) {}

    ngOnInit() {
        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 2
        };
    }

    validateSymbol() {
        const s = (this.symbol || '').trim().toUpperCase();
        if (s.length < 3) {
            this.validSymbol = false;
        } else {
            // Delegate to service validator (currently a shell that returns true).
            this.validSymbol = this.stockService.validateSymbol(s);
        }
    }

    async view() {
        if (!this.validSymbol) return;
        this.loading = true;
        this.error = null;
        this.chartData = null;

        const sym = this.symbol.trim().toUpperCase();
        try {
            const data = await this.stockService.fetchIntraday(sym);
            if (!data || !data.labels.length || !data.closes.length) {
                this.error = 'Insufficient intraday data for today.';
                return;
            }

            this.chartData = {
                labels: data.labels,
                datasets: [
                    {
                        label: sym,
                        data: data.closes,
                        fill: false,
                        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--p-primary-500') || '#0d6efd'
                    }
                ]
            };
        } catch (e: any) {
            this.error = e?.message || 'Failed to fetch data. Try another symbol.';
        } finally {
            this.loading = false;
        }
    }
}
