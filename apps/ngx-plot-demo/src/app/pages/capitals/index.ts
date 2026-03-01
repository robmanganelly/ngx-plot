import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import * as Plot from '@observablehq/plot';
import * as topojson from 'topojson-client';
import type { Topology } from 'topojson-specification';
import { Capital, CAPITALS } from './data';



@Component({
  selector: 'app-plot-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 gap-4">
      <div #plotContainer class="col-span-2"></div>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Details</h3>
        @if (selectedCapital(); as cap) {
          <p><strong>Capital:</strong> {{ cap.capital }}</p>
          <p><strong>Country:</strong> {{ cap.country }}</p>
        } @else {
          <span class="text-gray-500">Hover over a capital to see details. Click to lock selection.</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
    }
  `,
})
export class PlotPage {
  private readonly renderer = inject(Renderer2);

  readonly plotContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('plotContainer');

  readonly selectedCapital = signal<Capital | null>(null);
  readonly land = signal<GeoJSON.FeatureCollection | null>(null);

  constructor() {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then((res) => res.json())
      .then((topology: Topology) => {
        const geojson = topojson.feature(
          topology,
          topology.objects['land'],
        ) as unknown as GeoJSON.FeatureCollection;
        this.land.set(geojson);
      });

    afterRenderEffect((onCleanup) => {
      const landData = this.land();
      if (!landData) return;

      const container = this.plotContainer().nativeElement;

      const plot = Plot.plot({
        projection: 'equirectangular',
        width: 900,
        height: 500,
        marks: [
          Plot.graticule({ strokeOpacity: 0.15 }),
          Plot.geo(landData, {
            fill: '#e0e0e0',
            stroke: '#999',
            strokeWidth: 0.5,
          }),
          Plot.sphere({ stroke: '#333' }),
          Plot.dot(CAPITALS, {
            x: 'longitude',
            y: 'latitude',
            fill: 'crimson',
            stroke: 'white',
            strokeWidth: 0.5,
            r: 3,
          }),
          Plot.dot(
            CAPITALS,
            Plot.pointer({
              x: 'longitude',
              y: 'latitude',
              fill: 'gold',
              stroke: 'crimson',
              strokeWidth: 1.5,
              r: 7,
            }),
          ),
          Plot.tip(
            CAPITALS,
            Plot.pointer({
              x: 'longitude',
              y: 'latitude',
              channels: { Capital: 'capital', Country: 'country' },
              format: {
                Capital: true,
                Country: true,
                x: false,
                y: false,
              },
            }),
          ),
        ],
      });

      if (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }
      this.renderer.appendChild(container, plot);

      const unlisten = this.renderer.listen(plot, 'input', () => {
        const datum = (plot as unknown as { value: Capital | null }).value;
        this.selectedCapital.set(datum ?? null);
      });

      onCleanup(() => unlisten());
    });
  }
}
