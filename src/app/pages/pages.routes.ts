import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { StockTicker } from './stockticker/stockticker';
import { Geo } from './geo/geo';
import { Weather } from './weather/weather';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'stockticker', component: StockTicker },
    { path: 'geo', component: Geo },
    { path: 'weather', component: Weather },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
