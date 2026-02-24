import { Route } from '@angular/router';

export const appRoutes: Route[] = [{
    path: '',
    loadComponent: () => import('./pages/plots').then(m => m.PlotPage)
}];
