import { Type } from '@angular/core';

// Clock components
import { ClockOneComponent } from './clock-module/clocks/clock-one/clock-one.component';
import { ClockTwoComponent } from './clock-module/clocks/clock-two/clock-two.component';

export class ClockItem {
  constructor(public component: Type<any>, public data: any) {}
}

/**
 * Add any new clock components here
 */
export const AvaliableClocks = <ClockItem[]>[
  new ClockItem(ClockOneComponent, { name: 'ClockOne' }),
  new ClockItem(ClockTwoComponent, { name: 'ClockTwo' }),
];
