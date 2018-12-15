import { Component, OnInit } from '@angular/core';
import { ModuleStorageService } from '../_services/module-storage/module-storage.service';
import { Module } from '../_services/module-storage/module';
import * as anime from 'animejs';

@Component({
  selector: 'app-module-handler',
  templateUrl: './module-handler.component.html',
  styleUrls: ['./module-handler.component.scss']
})

export class ModuleHandlerComponent implements OnInit {
  settingsVisible = false;
  animationRunning = false;
  showBackButton = false;
  selectedModule = new Module;
  moduleList = [];
  linkedModules = [
    'weather',
    'spotify'
  ];

  constructor(public _moduleStorage: ModuleStorageService) { }

  ngOnInit() {
    this.loadStorage();
    this.initModules(this.moduleList);
  }

  loadStorage() {
    const storageHolder = this._moduleStorage.getModules();

    if (!storageHolder) { // Cache not found
      this._moduleStorage.setupStorage(this.linkedModules);
      this.moduleList = this._moduleStorage.getModules();
    } else { // Cache found
      this.moduleList = storageHolder;
    }
  }

  /**
   * Initializes the loaded modules
   * @param modules list of modules
   */
  initModules(modules) {
    modules.forEach(moduleItem => {
      this.updateModuleUI(moduleItem);
    });
  }

  /**
   * Fires when the properties of a module changes
   */
  onModuleChange() {
    this._moduleStorage.updateModule(this.selectedModule);
    this.updateModuleUI(this.selectedModule);
  }

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
   * Displays the properties of the selected module
   * @param moduleData data of selected module
   */
  selectModule(moduleData) {
    this.selectedModule = moduleData;
    this.openModuleSettings();
  }

  /**
   * Toggle the settings panel visiblity
   */
  togglePanel() {
    if (this.animationRunning) { return; }
    this.showBackButton = false;
    if (this.settingsVisible) { // Close menu
      this.closeModuleList().then(() => {
        this.settingsVisible = false;
      });
    } else { // Open menu
      this.openModuleList().then(() => {
        this.settingsVisible = true;
      });
    }
  }

  /*
  * Open the module list
  * @return {Promise} that resolves when animation completes
  */
  openModuleList() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    return anime.timeline().add({
      targets: '.controller',
      easing: 'easeOutExpo',
      duration: 250,
      width: '300px',
      height: 45 * (this.moduleList.length + 1) + 17.5,
      opacity: 1,
    }).add({
      targets: '.moduleList',
      easing: 'easeOutExpo',
      duration: 250,
      offset: 0,
      height: 45 * this.moduleList.length
    }).add({
      targets: '.gearContainer',
      duration: 250,
      offset: 0,
      rotate: '3turn',
    }).add({
      targets: '.backContainer',
      duration: 50,
      offset: 0,
      opacity: 0
    }).finished.then(() => this.animationRunning = false);
  }

  /*
  * Closes the module list
  * @return {Promise} that resolves when animation completes
  */
  closeModuleList() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    return anime.timeline().add({
      targets: '.controller',
      easing: 'easeOutExpo',
      duration: 200,
      width: '44px',
      height: '44px',
      opacity: 0.4
    }).add({
      targets: '.moduleList, .moduleSettings',
      easing: 'easeOutExpo',
      duration: 0,
      offset: 0,
      height: 0
    }).add({
      targets: '.gearContainer',
      duration: 200,
      offset: 0,
      rotate: '-1turn'
    }).finished.then(() => this.animationRunning = false);
  }

  /*
  * Open the module settings
  * @return {Promise} that resolves when animation completes
  */
  openModuleSettings() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    this.showBackButton = true;
    const settingHeight = 150;
    return anime.timeline().add({
      targets: '.moduleList',
      duration: 0,
      height: 0
    }).add({
      targets: '.moduleSettings',
      easing: 'easeOutExpo',
      duration: 250,
      offset: 0,
      height: settingHeight
    }).add({
      targets: '.controller',
      easing: 'easeOutExpo',
      duration: 250,
      offset: 0,
      height: settingHeight + 62.5
    }).add({
      targets: '.backContainer',
      easing: 'easeOutExpo',
      duration: 150,
      offset: 0,
      opacity: 1
    }).add({
      targets: '.gearContainer',
      duration: 250,
      easing: 'easeOutExpo',
      offset: 0,
      translateX: 255,
      rotate: '3turn'
    }).finished.then(() => this.animationRunning = false);
  }

  /*
  * Go back from module settings to module list
  * @return {Promise} that resolves when animation completes
  */
  goBack() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    this.showBackButton = false;
    return anime.timeline().add({
      targets: '.moduleSettings',
      easing: 'easeOutExpo',
      duration: 50,
      height: 0
    }).add({
      targets: '.gearContainer',
      duration: 50,
      offset: 0,
      translateX: -255,
    }).finished.then(() => {
      this.animationRunning = false;
      this.openModuleList();
    });
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
