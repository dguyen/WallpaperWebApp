import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appModule]'
})
export class ModuleDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
