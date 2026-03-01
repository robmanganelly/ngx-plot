import { Route } from '@angular/router';

export const appRoutes: Route[] = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'temperature'
},{
    path: 'temperature',
    loadComponent: () => import('./pages/temperature/temperature').then(m => m.TemperaturePage)
}, {
    path: 'capitals',
    loadComponent: () => import('./pages/capitals/plots').then(m => m.PlotPage)
}];
