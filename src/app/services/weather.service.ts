import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { CurrentWeather } from '../models/current-weather';
import { MapboxResponse } from '../models/reverse-geocoding';

export interface ReverseGeocodeResult {
    displayName?: string;
    [key: string]: any;
}

export interface DailyWeatherStats {
    date: string;
    tempMax?: number;
    tempMin?: number;
    precipitation?: number;
    [key: string]: any;
}


@Injectable({ providedIn: 'root' })
export class WeatherService {
    constructor(private http: HttpClient) {}

    /**
     * Calls the backend .NET API to reverse geocode lat/lon and return a human-friendly name.
     * Expected backend endpoint: GET {weatherApiBaseUrl}/api/weather/reverse-geocode?lat={lat}&lon={lon}
     */
    reverseGeocode(lat: number, lon: number): Promise<any> {
        const base = environment.weatherApiBaseUrl.replace(/\/+$/, '');
        const url = `/api/weather/reverse?lat=${lat}&lon=${lon}`;
        return firstValueFrom(this.http.get<any>(url));
    }

    /**
     * Calls the backend .NET API to get daily weather statistics for the given coordinates.
     * Expected backend endpoint: GET {weatherApiBaseUrl}/api/weather/daily?lat={lat}&lon={lon}&days={days}
     */
    getDailyStats(lat: number, lon: number, days: number = 7): Promise<DailyWeatherStats[]> {
        const base = environment.weatherApiBaseUrl.replace(/\/+$/, '');
        const url = `/api/weather/daily?lat=${lat}&lon=${lon}&days=${days}`;
        return firstValueFrom(this.http.get<DailyWeatherStats[]>(url));
    }

    /**
     * Calls the backend .NET API to get current weather for the given coordinates.
     * Expected backend endpoint: GET {weatherApiBaseUrl}/api/weather/current?lat={lat}&lon={lon}
     */
    getCurrentWeather(lat: number | null, lon: number | null): Promise<CurrentWeather> {
        const base = environment.weatherApiBaseUrl.replace(/\/+$/, '');
        const url = `/api/weather/current?lat=${lat}&lon=${lon}`;
        return firstValueFrom(this.http.get<CurrentWeather>(url));
    }
}
