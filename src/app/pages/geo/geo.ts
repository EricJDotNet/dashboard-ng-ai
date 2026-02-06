import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-geo',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">Geolocation</div>

        <button pButton type="button" label="Get My Location" (click)="getLocation()"></button>

        <div *ngIf="error" class="text-red-600 mt-3">{{ error }}</div>

        <div *ngIf="position" class="mt-4">
            <form class="grid grid-cols-12 gap-3">
                <label class="col-span-3 font-semibold">Timestamp</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ formatTimestamp(position.timestamp) }}</label>
                </div>

                <label class="col-span-3 font-semibold">Latitude</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ position.coords.latitude }}</label>
                </div>

                <label class="col-span-3 font-semibold">Longitude</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ position.coords.longitude }}</label>
                </div>

                <label class="col-span-3 font-semibold">Accuracy (m)</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ position.coords.accuracy }}</label>
                </div>

                <label class="col-span-3 font-semibold">Altitude</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ position.coords.altitude ?? -1 }}</label>
                </div>

                <label class="col-span-3 font-semibold">Altitude Accuracy (m)</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ position.coords.altitudeAccuracy ?? -1 }}</label>
                </div>

                <label class="col-span-3 font-semibold">Heading</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ position.coords.heading ?? -1 }}</label>
                </div>

                <label class="col-span-3 font-semibold">Speed (m/s)</label>
                <div class="col-span-9">
                    <label class="block border p-2 rounded">{{ position.coords.speed ?? 0 }}</label>
                </div>
            </form>
        </div>
    </div>
    `
})
export class Geo {
    position: GeolocationPosition | null = null;
    error: string | null = null;

    getLocation() {
        this.error = null;
        this.position = null;

        if (!('geolocation' in navigator)) {
            this.error = 'No geo data available';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                this.position = pos;
            },
            (err) => {
                this.error = 'No geo data available';
            }
        );
    }

    formatTimestamp(ts: number | undefined) {
        if (!ts) return ' ';
        return new Date(ts).toString();
    }
}
