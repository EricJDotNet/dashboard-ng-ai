import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { WeatherService } from '../../services/weather.service';
import { CurrentWeather } from '../../models/current-weather';
import { MapboxResponse, Feature } from '../../models/reverse-geocoding';

@Component({
    selector: 'app-weather',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule, ButtonModule],
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">Weather</div>

        <div class="flex items-center gap-2 mb-4">
            <input pInputText type="text" placeholder="Enter location" [(ngModel)]="locationText" />
            <p-button type="button" label="Go" (click)="go()" [loading]="isLoading"></p-button>
        </div>

        <div *ngIf="currentWeather" class="card mt-4">
            <div class="font-semibold mb-2">Current Weather</div>
            <hr/>
            <form class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm">Timestamp (dt)
                        <input pInputText type="number" [(ngModel)]="currentWeather.dt" name="cw_dt" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm">Sunrise
                        <input pInputText type="number" [(ngModel)]="currentWeather.sunrise" name="cw_sunrise" />
                    </label>
                </div>

                <div>
                    <label class="block text-sm">Sunset
                        <input pInputText type="number" [(ngModel)]="currentWeather.sunset" name="cw_sunset" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm">Temperature (temp)
                        <input pInputText type="number" step="any" [(ngModel)]="currentWeather.temp" name="cw_temp" />
                    </label>
                </div>

                <div>
                    <label class="block text-sm">Feels Like
                        <input pInputText type="number" step="any" [(ngModel)]="currentWeather.feelsLike" name="cw_feelsLike" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm">Pressure
                        <input pInputText type="number" [(ngModel)]="currentWeather.pressure" name="cw_pressure" />
                    </label>
                </div>

                <div>
                    <label class="block text-sm">Humidity
                        <input pInputText type="number" [(ngModel)]="currentWeather.humidity" name="cw_humidity" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm">Dew Point
                        <input pInputText type="number" step="any" [(ngModel)]="currentWeather.dewPoint" name="cw_dewPoint" />
                    </label>
                </div>

                <div>
                    <label class="block text-sm">UV Index (uvi)
                        <input pInputText type="number" step="any" [(ngModel)]="currentWeather.uvi" name="cw_uvi" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm">Clouds
                        <input pInputText type="number" [(ngModel)]="currentWeather.clouds" name="cw_clouds" />
                    </label>
                </div>

                <div>
                    <label class="block text-sm">Visibility
                        <input pInputText type="number" [(ngModel)]="currentWeather.visibility" name="cw_visibility" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm">Wind Speed
                        <input pInputText type="number" step="any" [(ngModel)]="currentWeather.windSpeed" name="cw_windSpeed" />
                    </label>
                </div>

                <div>
                    <label class="block text-sm">Wind Degree
                        <input pInputText type="number" [(ngModel)]="currentWeather.windDeg" name="cw_windDeg" />
                    </label>
                </div>
                <div>
                    <label class="block text-sm">Wind Gust
                        <input pInputText type="number" step="any" [(ngModel)]="currentWeather.windGust" name="cw_windGust" />
                    </label>
                </div>

                <div class="col-span-2">
                    <label class="block text-sm">Weather (JSON)
                        <textarea rows="4" class="w-full p-2 border rounded" [value]="currentWeather.weather | json" disabled></textarea>
                    </label>
                </div>
                <div *ngIf="error" class="text-red-600 mt-3">{{ error }}</div>
            </form>
        </div>
    </div>
    `
})
export class Weather {
    locationText: string = '';
    isLoading: boolean = false;

    // lat/lon from browser or geocoding
    lat: number | null = null;
    lon: number | null = null;

    // map center and zoom
    mapLat = 39.8283; // center USA
    mapLon = -98.5795;
    mapZoom = 4; // default zoom for whole USA

    error: string | null = null;

    currentWeather: CurrentWeather | null = null;

    constructor(private weatherService: WeatherService) {}

    get mapUrl() {
        // Use RainViewer map which supports loc=lat,lon,zoom
        const src = `https://www.rainviewer.com/map.html?loc=${this.mapLat},${this.mapLon},${this.mapZoom}&hideRadarBg=0&rainmap=1`;
        return src;
    }

    async useBrowserLocation() {
        this.error = null;
        this.isLoading = true;
        if (!('geolocation' in navigator)) {
            this.error = 'Geolocation is not available';
            this.isLoading = false;
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                this.lat = pos.coords.latitude;
                this.lon = pos.coords.longitude;
                console.log(`Got browser location: `, JSON.stringify(pos));
                try {
                    const geo = await this.reverseGeocode(this.lat, this.lon);
                    console.log('Reverse geocode result: ', geo?.location.features);
                    this.currentWeather = await this.weatherService.getCurrentWeather(this.lat, this.lon);
                    this.locationText = geo.location.features.length > 0
                        ? geo.location.features.find((feature: Feature) => feature.id.startsWith('place')).place_name
                        : `Lat: ${this.lat}, Lon: ${this.lon}`;
                    this.isLoading = false;
                } catch (e) {
                    this.error = 'Failed to reverse geocode location';
                    this.isLoading = false;
                }
            },
            (err) => {
                this.error = 'Unable to get browser location';
                this.isLoading = false;
            }
        );
    }

    async reverseGeocode(lat: number, lon: number) {
        return await this.weatherService.reverseGeocode(lat, lon);
    }

    async geocode(query: string) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Geocode failed');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name };
        }
        return null;
    }

    async go() {
        this.error = null;
        this.currentWeather = null;
        try {
            await this.useBrowserLocation();
        } catch (e) {
            this.error = 'Failed to get map for location';
        }
    }
}
