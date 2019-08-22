import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ModuleDirective } from './module.directive';
import { Module } from '../_services/module-storage/module';
import * as anime from 'animejs';

// Services
import { ModulesListService } from '../modules-list.service';
import { ModuleStorageService } from '../_services/module-storage/module-storage.service';
import { AppSettingsService } from '../_services/app-settings/app-settings.service';

const animationStates = {
  minimisedView: 'minimisedView',
  moduleListView: 'moduleListView',
  moduleSettingView: 'moduleSettingView',
  appSettingView: 'appSettingView',
};

@Component({
  selector: 'app-module-handler',
  templateUrl: './module-handler.component.html',
  styleUrls: ['./module-handler.component.scss']
})
export class ModuleHandlerComponent implements OnInit {
  @ViewChild(ModuleDirective) appModule: ModuleDirective;
  currentViewState = animationStates.minimisedView;
  minimisedOpacity: number;
  animationRunning = false;
  showBackButton = false;
  selectedModule = new Module;
  moduleList = [];

  constructor(
    public _moduleStorage: ModuleStorageService,
    private _moduleListService: ModulesListService,
    private _appSetting: AppSettingsService,
    private compFactoryResolver: ComponentFactoryResolver) {}


  ngOnInit() {
    this.setupOpacityListener();
    this.loadStorage();
    this.loadModules();
    this.updateModulesUI(this.moduleList);
  }

  /**
   * Load data from storage into application
   */
  loadStorage() {
    const storageHolder = this._moduleStorage.getModules();

    if (!storageHolder) { // Cache not found
      this._moduleStorage.setupStorage(this._moduleListService.getModules());
      this.moduleList = this._moduleStorage.getModules();
    } else { // Cache found
      this.moduleList = storageHolder;
    }
  }

  /**
   * Setup a listener for opacity changes
   */
  setupOpacityListener() {
    this._appSetting.opacityUpdate.subscribe((data: number) => {
      if (data != null) {
        this.updateIconOpacity(data);
      }
    });
  }

  /**
   * Initializes the loaded modules
   * @param modules list of modules
   */
  updateModulesUI(modules: Module[]) {
    modules.forEach(moduleItem => {
      this.updateModuleUI(moduleItem);
    });
  }

  /**
   * Loads all the modules linked in modules-list
   */
  loadModules() {
    this.appModule.viewContainerRef.clear();
    const listOfAppModules = this._moduleListService.getModules();

    listOfAppModules.forEach(aModule => {
      const compFactory = this.compFactoryResolver.resolveComponentFactory(aModule.component);
      const viewContainerRef = this.appModule.viewContainerRef;
      viewContainerRef.createComponent(compFactory);
    });
  }

  /**
   * Update the properties of the selected module
   * @param newValue new module values
   */
  updateModuleUI(newValue: Module) {
    const moduleRef = <HTMLElement>document.querySelector(newValue.selector);
    moduleRef.style.display = newValue.enabled ? 'inline-block' : 'none';
    moduleRef.style.position = 'absolute';
    moduleRef.style.top = newValue.yPos + 'px';
    moduleRef.style.left = newValue.xPos + 'px';
  }

  /**
   * Displays the properties of the selected module
   * @param moduleData data of selected module
   */
  selectModule(moduleData: Module) {
    this.selectedModule = moduleData;
    this.openModuleSettings();
  }

  /**
   * Toggle the settings panel visiblity
   */
  togglePanel() {
    if (this.animationRunning) { return; }
    this.showBackButton = false;
    if (this.currentViewState === animationStates.minimisedView) { // Open menu list
      this.openModuleList();
    } else { // Close currently open view
      this.minimiseView();
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
      targets: '#controller',
      easing: 'easeOutExpo',
      duration: 250,
      width: '300px',
      height: 45 * (this.moduleList.length + 2) + 17.5,
      opacity: 1,
    }).add({
      targets: '.moduleList',
      easing: 'easeOutExpo',
      duration: 250,
      offset: 0,
      height: 45 * (this.moduleList.length + 1)
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
    }).finished.then(() => {
      this.animationRunning = false;
      this.currentViewState = animationStates.moduleListView;
    });
  }

  /*
  * Closes the module list, returning to minimised view
  * @return {Promise} that resolves when animation completes
  */
  minimiseView() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    const currentViewSelector = this.getTarget(this.currentViewState);
    if (!currentViewSelector) {
      return;
    }
    return anime.timeline().add({
      targets: '#controller',
      easing: 'easeOutExpo',
      duration: 200,
      width: '44px',
      height: '44px',
      opacity: this.minimisedOpacity
    }).add({
      targets: currentViewSelector,
      easing: 'easeOutExpo',
      duration: 0,
      offset: 0,
      height: 0
    }).add({
      targets: '.gearContainer',
      duration: 200,
      offset: 0,
      rotate: '-1turn'
    }).finished.then(() => {
      this.animationRunning = false;
      this.currentViewState = animationStates.minimisedView;
    });
  }

  /*
  * Open the module settings
  * @return {Promise} that resolves when animation completes
  */
  openModuleSettings() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    this.showBackButton = true;
    const settingHeight = 205;
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
      targets: '#controller',
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
    }).finished.then(() => {
      this.animationRunning = false;
      this.currentViewState = animationStates.moduleSettingView;
    });
  }

  /**
   * Open application settings page
   */
  openAppSetting() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    this.showBackButton = true;
    const settingHeight = 180;
    return anime.timeline().add({
      targets: '.moduleList',
      duration: 0,
      height: 0
    }).add({
      targets: '.appSettings',
      easing: 'easeOutExpo',
      duration: 250,
      offset: 0,
      height: settingHeight
    }).add({
      targets: '#controller',
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
    }).finished.then(() => {
      this.animationRunning = false;
      this.currentViewState = animationStates.appSettingView;
    });
  }


  /*
  * Go back from module settings to module list
  * @return {Promise} that resolves when animation completes
  */
  goBack() {
    if (this.animationRunning) { return; }
    this.animationRunning = true;
    this.showBackButton = false;
    const selector = this.getTarget(this.currentViewState);
    if (!selector) {
      return;
    }
    return anime.timeline().add({
      targets: selector,
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
   * Returns the relevant selector for an animation state
   * @param view an animation state
   */
  getTarget(view: string) {
    switch (view) {
      case animationStates.moduleListView:
        return '.moduleList';
      case animationStates.moduleSettingView:
        return '.moduleSettings';
      case animationStates.appSettingView:
        return '.appSettings';
      default: return null;
    }
  }

  /**
   * Update the icon opacity when setting is minimised
   * @param opacity number between 0 - 1
   */
  updateIconOpacity(opacity: number) {
    if (this.currentViewState === animationStates.minimisedView) {
      document.getElementById('controller').style.opacity = opacity.toString();
    }
    this.minimisedOpacity = opacity;
  }
}
