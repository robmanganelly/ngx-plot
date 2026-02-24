/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { DOCUMENT, inject, Injectable } from "@angular/core";
import { plot as ɵplot } from '@observablehq/plot';
/**
 * Creates a wrapper aroud the native plot instance, 
 * providing document, and other global dependencies as needed
 * 
 * Names are shadowed for simplicity. 
 * The plot instance is not exposed by this service
 */
@Injectable({
    providedIn: 'root'
})
export class PlotBuilder{

    private readonly document = inject(DOCUMENT);

    createPlot(){}

   render(){} 

   // TODO


}