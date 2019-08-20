import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Module } from '../../_services/module-storage/module';

@Component({
  selector: 'app-select-setting',
  templateUrl: './select-setting.component.html',
  styleUrls: ['./select-setting.component.scss']
})
export class SelectSettingComponent {
  @Input() moduleList: [];
  @Output() moduleSelected = new EventEmitter<Module>();

  constructor() { }

  /**
   * Emits a signal to parent indicating that a module has been selected
   * @param module the module selected
   */
  selectModule(module: Module) {
    this.moduleSelected.emit(module);
  }
}
