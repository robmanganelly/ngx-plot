import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Renderer2,
  signal,
} from '@angular/core';
import * as Plot from '@observablehq/plot';
import { Capital } from './data';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgxPlotFrame } from '@robmanganelly/ngx-plot';
import { JsonPipe } from '@angular/common';
import type { FeatureCollection } from 'geojson';

@Component({
  imports: [NgxPlotFrame, JsonPipe],
  selector: 'app-plot-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 gap-4">
      <ngx-plot-frame
        [transform]="capitalTransform"
        (output)="selectedCapital.set($event)"
        [data]="plot()"
      ></ngx-plot-frame>
      <!-- <div #plotContainer class="col-span-2"></div> -->
      <div class="p-4">
        <div class="flex gap-4 items-center">
          <h3 class="text-lg font-semibold mb-2 ">Details</h3>
          <button class="border px-4" (click)="clearCapitals()">clear</button>
          <span>total: {{ capitaList().length }}</span>
        </div>

        @if (selectedCapital(); as cap) {
          <p><strong>Capital:</strong> {{ cap.capital }}</p>
          <p><strong>Country:</strong> {{ cap.country }}</p>
        } @else {
          <span class="text-gray-500"
            >Hover over a capital to see details. Click to lock selection.</span
          >
        }
      </div>
      <pre>
        {{ capitaList() | json }}
      </pre
      >
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
  private readonly route = inject(ActivatedRoute);

  private readonly data = toSignal(this.route.data);

  private readonly capitals = computed(
    () => this.data()?.['capitals'] as Capital[],
  );
  private readonly land = computed(
    () => this.data()?.['countries'] as FeatureCollection | null,
  );

  protected readonly plot = computed(() => {
    const landData = this.land();
    const capitals = this.capitals();

    return !(landData && capitals)
      ? null
      : Plot.plot({
          projection: 'equal-earth',
          width: 5 * 500,
          height: 3 * 500,
          marks: [
            Plot.graticule({ strokeOpacity: 0.15 }),
            Plot.geo(landData, {
              fill: '#e0e0e0',
              stroke: '#999',
              strokeWidth: 0.5,
            }),
            Plot.sphere({ stroke: '#333' }),
            Plot.dot(capitals, {
              x: 'longitude',
              y: 'latitude',
              fill: 'crimson',
              stroke: 'white',
              strokeWidth: 0.5,
              r: 3,
            }),
            Plot.dot(
              capitals,
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
              capitals,
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
  });

  protected readonly capitalTransform = (value: unknown): Capital | null => {
    if (typeof value !== 'object' || value === null) return null;
    const cap = value as Capital;
    return 'capital' in cap && 'country' in cap ? cap : null;
  };

  readonly selectedCapital = signal<Capital | null>(null);

  readonly capitaList = signal<(Capital | null)[]>([]);

  _onCapitalChange = effect(() => {
    const selectedCapital = this.selectedCapital();
    this.capitaList.update((capitals) => [...capitals, selectedCapital]);
  });

  clearCapitals() {
    this.capitaList.set([]);
  }
}
