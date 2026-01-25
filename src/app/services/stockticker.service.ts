import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StockTickerService {
    constructor(private http: HttpClient) {}

    // Placeholder validator: intentionally simple shell that always returns true.
    validateSymbol(_symbol: string): boolean {
        return true;
    }

    // Fetch intraday 1-minute resolution data for today using finnhub.io
    async fetchIntraday(symbol: string): Promise<{ labels: string[]; closes: number[] }> {
        const token = (environment as any).finnhubApiKey;
        if (!token) {
            throw new Error('Finnhub API key not configured in environment.finnhubApiKey');
        }

        const now = Math.floor(Date.now() / 1000);
        const d = new Date();
        const startOfDayUtc = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);

        const url = `/finnhub/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=1&from=${startOfDayUtc}&to=${now}`;
        const res: any = await this.http.get(url, { headers: { 'X-Finnhub-Token': token } }).toPromise();
        console.log('Finnhub response:', res);
        if (!res || res.s !== 'ok') {
            throw new Error('No intraday data available');
        }

        const timestamps: number[] = res.t || [];
        const closes: number[] = res.c || [];

        const labels = timestamps.map((t: number) => {
            const dt = new Date(t * 1000);
            return `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`;
        });

        return { labels, closes };
    }
}
