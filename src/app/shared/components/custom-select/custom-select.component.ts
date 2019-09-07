import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent {
  @Input() itemList: [];
  @Input() formatItem: Function;
  @Input() selectedItem: any;
  @Output() itemSelected = new EventEmitter();
  isOpen = false;

  constructor() {
    if (!this.selectedItem) {
      this.selectedItem = 'Select item';
    }
  }

  /**
   * Set the selected item and emit it to parent
   * @param item item to be selected
   */
  selectItem(item: string) {
    this.selectedItem = item;
    this.itemSelected.emit(this.selectedItem);
  }

  /**
   * Toggle the drop downbox
   */
  toggleSelect() {
    this.isOpen = !this.isOpen;
    const docRef = document.getElementById('selectedItem');
    if (this.isOpen) {
      docRef.style.borderBottomLeftRadius = '0px';
      docRef.style.borderBottomRightRadius = '0px';

      // Callback for clicking outside custom select box
      const clickCallback = (e: Event) => {
        const element = document.getElementById('selectLocation');
        const elementTwo = document.getElementById('dropContainer');
        if (!element.contains(e.target as Node) && (elementTwo && !elementTwo.contains(e.target as Node))) {
          document.removeEventListener('click', clickCallback);
          this.toggleSelect();
        }
      };
      document.addEventListener('click', clickCallback);
    } else {
      docRef.style.borderBottomLeftRadius = '10px';
      docRef.style.borderBottomRightRadius = '10px';
    }
  }

  /**
   * Format the given item if required
   * @param item the item to be formatted
   */
  format(item: any) {
    if (this.formatItem) {
      const newItem = this.formatItem(item);
      return newItem ? newItem : item;
    }
    return item;
  }
}
