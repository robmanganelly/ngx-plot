import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
  viewChild,
} from '@angular/core';

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
export class NgxPlot {
  private readonly r2 = inject(Renderer2);

  private readonly plotframe =
    viewChild.required<ElementRef<HTMLDivElement>>('plotframe');
}
