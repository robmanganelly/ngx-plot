import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  Renderer2,
  viewChild,
} from '@angular/core';
import type { Plot } from '@observablehq/plot';

@Component({
  selector: 'ngx-plot-frame',
  imports: [],
  host: {
    class: 'contents',
  },
  template: ` <div #plotframe></div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxPlotFrame<T = unknown> {
  private readonly r2 = inject(Renderer2);
  private readonly plotframe =
    viewChild.required<ElementRef<HTMLDivElement>>('plotframe');
  private readonly container = computed(() => this.plotframe().nativeElement);

  public readonly data = input.required<
    ((SVGSVGElement | HTMLElement) & Plot) | null
  >();

  public readonly transform = input<((value: unknown)=>T)>(e=>e as T)

  public readonly output = output<T>();

  readonly _render = afterRenderEffect((onCleanup) => {
    const plot = this.data();
    if (!plot) return;
    const container = this.container();
    const transform = this.transform();

    if (container.firstChild) {
      this.r2.removeChild(container, container.firstChild);
    }
    this.r2.appendChild(container, plot);

    const unlisten = this.r2.listen(plot, 'input', (event) => {
      console.log({ event, plot});
      this.output.emit(transform(plot.value));
    });

    onCleanup(() => unlisten());
  });
}
