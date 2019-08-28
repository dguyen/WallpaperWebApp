import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appClock]'
})
export class ClockDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
