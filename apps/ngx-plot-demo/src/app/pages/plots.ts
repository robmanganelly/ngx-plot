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

interface TemperatureReading {
  date: Date;
  temperature: number;
}

@Component({
  selector: 'app-plot-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div class="grid grid-cols-2 gap-4">
    <div #plotContainer></div>
    <div>
      <span> this is the details view</span>
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
export class PlotPage {
  private readonly renderer = inject(Renderer2);

  readonly plotContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('plotContainer');

  readonly temperatureData = signal<TemperatureReading[]>([
    { date: new Date('2026-02-01'), temperature: 3 },
    { date: new Date('2026-02-02'), temperature: 5 },
    { date: new Date('2026-02-03'), temperature: 2 },
    { date: new Date('2026-02-04'), temperature: 7 },
    { date: new Date('2026-02-05'), temperature: 8 },
    { date: new Date('2026-02-06'), temperature: 6 },
    { date: new Date('2026-02-07'), temperature: 4 },
    { date: new Date('2026-02-08'), temperature: 9 },
    { date: new Date('2026-02-09'), temperature: 11 },
    { date: new Date('2026-02-10'), temperature: 10 },
    { date: new Date('2026-02-11'), temperature: 8 },
    { date: new Date('2026-02-12'), temperature: 6 },
    { date: new Date('2026-02-13'), temperature: 5 },
    { date: new Date('2026-02-14'), temperature: 7 },
  ]);

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
    afterRenderEffect(() => {
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
          Plot.dot(data, {
            x: 'date',
            y: 'temperature',
            fill: 'steelblue',
            r: 3,
          }),
        ],
      });

      if (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }
      this.renderer.appendChild(container, plot);
    });
  }
}
