import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPlotFrame } from './ngx-plot-frame';

describe('NgxPlot', () => {
  let component: NgxPlotFrame;
  let fixture: ComponentFixture<NgxPlotFrame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxPlotFrame],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxPlotFrame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
