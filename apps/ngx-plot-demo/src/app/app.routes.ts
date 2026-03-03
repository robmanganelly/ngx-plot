import { Route } from '@angular/router';
import { fetchResolver } from '@robmanganelly/ngx-plot';
import { Capital } from './pages/capitals/data';
import type { FeatureCollection } from 'geojson';
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'temperature',
  },
  {
    path: 'temperature',
    loadComponent: () =>
      import('./pages/temperature').then((m) => m.TemperaturePage),
  },
  {
    path: 'capitals',
    resolve: {
      countries: fetchResolver<FeatureCollection>(
        './geo/geo.countries.50.json',
      ),
      capitals: fetchResolver<Capital>('./geo/capitals.json'),
    },
    loadComponent: () => import('./pages/capitals').then((m) => m.PlotPage),
  },
];
