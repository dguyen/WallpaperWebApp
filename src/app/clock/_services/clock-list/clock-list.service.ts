import { Injectable } from '@angular/core';
import { AvaliableClocks, ClockItem } from '../../clock-list';

@Injectable({
  providedIn: 'root'
})
export class ClockListService {
  /**
   * Returns the avaliable clocks
   */
  getClocks(): ClockItem[] {
    return AvaliableClocks;
  }

  /**
   * Get the ClockItem based on the given clock name
   * @param clockName name of clock to find
   */
  getClock(clockName: string): ClockItem {
    return AvaliableClocks.find((aClock) => aClock.data.name === clockName);
  }
}
