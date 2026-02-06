import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { WeatherService } from '../../services/weather.service';
import { CurrentWeather } from '../../models/current-weather';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';

@Component({
    selector: 'app-weather',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.css']
})
export class Weather implements OnInit {
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
    searchControl = new FormControl('');
    results: any[] = [];
    coords: number[] | null = null;

    constructor(private weatherService: WeatherService) { }

    ngOnInit() {
        this.isLoading = true;
        this.searchControl.valueChanges.pipe(
            filter(query => !!query && query.length > 2), // Only search if > 2 characters
            debounceTime(400),                            // Wait for 400ms pause
            distinctUntilChanged(),                       // Only if the value changed
            switchMap(query => this.searchAddress(query!)) // Switch to new search, cancel old
        ).subscribe(data => {
            console.log('Search results: ', data);
            this.results = data.features;
            this.isLoading = false;
        });
    }

    selectAddress(loc: any) {
        this.isLoading = true;
        this.searchControl.setValue(loc.properties.full_address, { emitEvent: false });
        this.results = [];
        this.coords = loc.geometry.coordinates;
        console.log('Selected Coordinates:', loc.geometry.coordinates); // [longitude, latitude]
        this.isLoading = false;
    }

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
                    /*this.locationText = geo.location.features.length > 0
                        ? geo.location.features.find((feature: Feature) => feature.id.startsWith('place')).place_name
                        : `Lat: ${this.lat}, Lon: ${this.lon}`;*/
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

    async searchAddress(query: string) {
        return await this.weatherService.searchAddress(query);
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
            //await this.useBrowserLocation();
            if (this.coords) {
                this.currentWeather = await this.weatherService.getCurrentWeather(this.coords[1], this.coords[0]);
            }
        } catch (e) {
            this.error = 'Failed to get map for location';
        }
    }
}
