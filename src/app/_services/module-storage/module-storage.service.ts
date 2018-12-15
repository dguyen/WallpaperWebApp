import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Module } from './module';

@Injectable({
  providedIn: 'root'
})
export class ModuleStorageService {
  moduleList: Array<any>;

  constructor(public storageService: StorageService) {
    this.moduleList = this.getModules();
  }

  /**
   * Return modules stored in storage
   */
  getModules() {
    const tmp = this.storageService.getStorageJSON('moduleList');
    return tmp ? tmp['moduleList'] : null;
  }

  /**
   * Update module values in storage
   * @param moduleId id of module
   * @param newValues updated values to be stored
   */
  updateModule(newModule: Module) {
    const tmp = this.moduleList.findIndex(x => x.id === newModule.id);
    this.moduleList[tmp] = newModule;
    this.storageService.setStorage('moduleList', {
      moduleList: this.moduleList
    });
  }

  /**
   * Setup storage if no values currently reside in storage
   * @param listOfModules a list of modules to have values generated for
   */
  setupStorage(listOfModules: Array<string>) {
    const moduleList = [];
    listOfModules.forEach(moduleName => {
      moduleList.push({
        name: moduleName,
        id: moduleName + 'Module',
        xPos: 300,
        yPos: 300,
        enabled: true
      });
    });
    this.storageService.setStorage('moduleList', {
      moduleList: moduleList
    });
  }
}
