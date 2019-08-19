import { Component, Input } from '@angular/core';
import { ModuleStorageService } from 'src/app/_services/module-storage/module-storage.service';
import { Module } from '../../_services/module-storage/module';

@Component({
  selector: 'app-generic-module-settings',
  templateUrl: './generic-module-settings.component.html',
  styleUrls: ['./generic-module-settings.component.scss']
})
export class GenericModuleSettingsComponent {
  @Input() selectedModule: Module;

  constructor(private _moduleStorage: ModuleStorageService) { }

  /**
   * Update the properties of the selected module
   * @param newValue new module values
   */
  updateModuleUI(newValue: Module) {
    const moduleRef = document.getElementById(newValue.id);
    moduleRef.style.display = newValue.enabled ? 'inline-block' : 'none';
    moduleRef.style.top = newValue.yPos + 'px';
    moduleRef.style.left = newValue.xPos + 'px';
  }

  /**
   * Fires when the properties of a module changes
   */
  onModuleChange() {
    this._moduleStorage.updateModule(this.selectedModule);
    this.updateModuleUI(this.selectedModule);
  }

  /**
   * Toggle whether the module is enabled or disabled
   * @param toggle true to enable or false to disable
   */
  toggleModule(toggle: boolean) {
    this.selectedModule.enabled = toggle;
    this.onModuleChange();
  }

  /**
   * Reset the module
   *  - Wipe module storage
   *  - Reset location and details
   */
  resetModule() {
    // Todo
  }

  /**
   * Returns the screen width in pixels
   */
  getScreenWidth() {
    return screen.width;
  }

  /**
   * Returns the screen height in pixels
   */
  getScreenHeight() {
    return screen.height;
  }
}
