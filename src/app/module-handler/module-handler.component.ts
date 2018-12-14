import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import anime from 'animejs';
import $ from 'jquery';

@Component({
  selector: 'app-module-handler',
  templateUrl: './module-handler.component.html',
  styleUrls: ['./module-handler.component.scss']
})

export class ModuleHandlerComponent implements OnInit {
  settingsVisible = false;
  panelAnimation = false;
  currentView = 'minimizedView';
  moduleList = [];
  linkedModules = [
    'weather',
    'spotify'
  ];

  constructor(private _localStorage: StorageService) { }

  ngOnInit() {
    this.loadStorage();
    this.initModules(this.moduleList);
  }

  loadStorage() {
    if (typeof (Storage) !== 'undefined') {
      const storageHolder = this._localStorage.getStorageJSON('moduleList');
      console.log(storageHolder);

      if (!storageHolder) { // Cache not found
        console.log('Cache not found');
        const holder = this.generateModuleTemplates(this.linkedModules);
        this.moduleList = holder.moduleList;
        this._localStorage.setStorage('moduleList', holder);
      } else { // Cache found
        console.log('Cache found');
        this.moduleList = storageHolder['moduleList'];
      }
    } else { // use default values
      console.log('no storage found');
    }
  }

  initModules(modules) {
    modules.forEach(moduleItem => {
      const moduleRef = $('#' + moduleItem.id);

      moduleRef.css({ 'top': moduleItem.yPos });
      moduleRef.css({ 'left': moduleItem.xPos });
      if (moduleItem.enabled) {
        moduleRef.css({ 'display': 'inline-block' });
      } else {
        moduleRef.style.display = 'none';
      }
    });
  }

  generateModuleTemplates(listOfModules) {
    listOfModules.forEach(i => {
      const holder = {
        name: listOfModules[i],
        id: listOfModules[i] + 'Module',
        xPos: 300,
        yPos: 300,
        enabled: false
      };
      this.moduleList.push(holder);
    });
    return { moduleList: this.moduleList };
  }

  loadSettings(moduleData) {
    const moduleRef = $('#' + moduleData.id);
    $('.moduleSettings').children('.range-slider').each(function () {
      const id = $(this).attr('id');
      const range = $(this).children('.range-slider__range');
      const value = $(this).children('.range-slider__value');
      let max = 0;
      let currValue = 0;
      let marginType = '';

      if (id === 'xController') {
        max = $(window).width();
        currValue = moduleData.xPos;
        marginType = 'left';
      } else if (id === 'yController') {
        max = $(window).height();
        currValue = moduleData.yPos;
        marginType = 'top';
      }

      // Change default values of slider
      range.attr('max', max);
      range.attr('value', currValue);
      value.html(currValue);

      // Remove and previous listeners and add the necessary one
      range.off('input');
      range.on('input', function () {
        $(this).next(value).html(this.value);
        const cssSetting = {};
        cssSetting[marginType] = this.value + 'px';
        $(moduleRef).css(cssSetting);

        if (id === 'xController') {
          moduleData.xPos = this.value;
        } else {
          moduleData.yPos = this.value;
        }
        // ---------- update storage and moduleDate
      });
    });

    if (moduleData.enabled) {
      $('.enableCheckbox').attr('checked', true);
    } else {
      $('.enableCheckbox').attr('checked', false);
    }

    // Remove and previous listeners and add the necessary one
    $('input:checkbox').off('change');
    $('input:checkbox').change(function () {
      if ($(this).is(':checked')) {
        $(moduleRef).css({ display: 'inline-block' });
        moduleData.enabled = true;
      } else {
        moduleRef.css({ 'display': 'none' });
        moduleData.enabled = false;
      }
    });
  }

  selectModule(moduleObject) {
    this.loadSettings(moduleObject);
    this.openModuleSettings();
  }

  togglePanel() {
    if (this.panelAnimation) { return; }
    this.panelAnimation = true;

    if (this.settingsVisible) { // Close menu
      this.closeModuleList().then(() => {
        this.settingsVisible = false;
        this.panelAnimation = false;
      });
    } else { // Open menu
      this.openModuleList().then(() => {
        this.settingsVisible = true;
        this.panelAnimation = false;
      });
    }
  }

  /*
  * Open the module list
  * @return {Promise} that resolves when animation completes
  */
  openModuleList() {
    return anime.timeline().add({
      targets: '.controller',
      easing: 'easeOutExpo',
      duration: '250',
      width: '300px',
      height: 45 * (this.moduleList.length + 1) + 17.5,
      opacity: 1,
    }).add({
      targets: '.moduleList',
      easing: 'easeOutExpo',
      duration: '250',
      offset: 0,
      height: 45 * this.moduleList.length
    }).add({
      targets: '.gearContainer',
      duration: '250',
      offset: '0',
      rotate: '3turn'
    }).finished;
  }

  /*
  * Closes the module list
  * @return {Promise} that resolves when animation completes
  */
  closeModuleList() {
    return anime.timeline().add({
      targets: '.controller',
      easing: 'easeOutExpo',
      duration: '200',
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
      duration: '200',
      offset: '0',
      rotate: '-3turn'
    }).finished;
  }

  /*
  * Open the module settings
  * @return {Promise} that resolves when animation completes
  */
  openModuleSettings() {
    const settingHeight = 200;
    return anime.timeline().add({
      targets: '.moduleList',
      duration: 0,
      height: 0
    }).add({
      targets: '.moduleSettings',
      easing: 'easeOutExpo',
      duration: '250',
      offset: 0,
      height: settingHeight
    }).add({
      targets: '.controller',
      easing: 'easeOutExpo',
      duration: '250',
      offset: 0,
      height: settingHeight + 62.5
    }).finished;
  }
}
