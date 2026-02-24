import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPlot } from './ngx-plot';

describe('NgxPlot', () => {
  let component: NgxPlot;
  let fixture: ComponentFixture<NgxPlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxPlot],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxPlot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
