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
import { data } from './data';

interface TemperatureReading {
  date: Date;
  temperature: number;
}

@Component({
  selector: 'app-temperature-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div class="grid grid-cols-1 gap-4">
    <div #plotContainer></div>
    <div>
      @if (selectedReading(); as reading) {
        <p><strong>Day:</strong> {{ reading.date.toLocaleDateString() }}</p>
        <p><strong>Temperature:</strong> {{ reading.temperature }}°C</p>
      } @else {
        <span>Click a data point to see details</span>
      }
    </div>
    <div class="grid-cols-2 flex gap-4">
      <button class="border rounded-sm px-2 py-1" (click)="addOne()">
        Add One
      </button>
      <button class="border rounded-sm px-2 py-1" (click)="removeLast()">
        Remove Last
      </button>
    </div>
  </div>`,

  styles: `
    :host {
      display: block;
      padding: 1rem;
    }
  `,
})
export class TemperaturePage {
  private readonly renderer = inject(Renderer2);

  readonly plotContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('plotContainer');

  readonly selectedReading = signal<TemperatureReading | null>(null);

  readonly temperatureData = signal<TemperatureReading[]>(data);

  addOne() {
    const lastDate = this.temperatureData().slice(-1)[0].date;
    const newDate = new Date(lastDate);
    newDate.setDate(lastDate.getDate() + 1);
    const newTemp = Math.round(Math.random() * 10) + 3;
    this.temperatureData.update((data) => [
      ...data,
      { date: newDate, temperature: newTemp },
    ]);
  }

  removeLast() {
    this.temperatureData.update((data) =>
      data.length - 1 ? data.slice(0, -1) : data,
    );
  }

  constructor() {
    afterRenderEffect((onCleanup) => {
      const container = this.plotContainer().nativeElement;
      const data = this.temperatureData();

      const plot = Plot.plot({
        title: 'Daily Temperature',
        x: { label: 'Day', type: 'time' },
        y: { label: 'Temperature (°C)', grid: true },
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(data, {
            x: 'date',
            y: 'temperature',
            stroke: 'steelblue',
            strokeWidth: 2,
          }),
          Plot.dot(data, Plot.pointer({
            x: 'date',
            y: 'temperature',
            fill: 'steelblue',
            r: 8,
          })),
          Plot.dot(data, {
            x: 'date',
            y: 'temperature',
            fill: 'steelblue',
            r: 4,
          }),
          Plot.tip(data, Plot.pointer({
            x: 'date',
            y: 'temperature',
          })),
        ],
      });

      if (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }
      this.renderer.appendChild(container, plot);

      // Use Plot's official "input" event — emitted by the pointer transform
      // when the focused point changes. plot.value holds the focused datum.
      // Click-to-stick is built-in: clicking locks the selection.
      const unlisten = this.renderer.listen(
        plot,
        'input',
        () => {
          const datum = (plot as unknown as { value: TemperatureReading | null }).value;
          this.selectedReading.set(datum ?? null);
        },
      );

      onCleanup(() => unlisten());
    });
  }
}
