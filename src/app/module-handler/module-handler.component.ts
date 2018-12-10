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
    $('.settings').children('.range-slider').each(function () {
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
    this.changeView('content', 'settings');
    console.log('changing view');
  }

  changeView(fromView, toView) {
    anime({
      targets: '.' + fromView,
      height: 0,
      easing: 'easeOutExpo',
      duration: 500
    }).finished.then(() => {
      this.currentView = toView;
      anime({
        targets: '.' + toView,
        height: [0, 450],
        easing: 'easeOutExpo',
        duration: 650
      });
    });
  }

  togglePanel() {
    if (this.panelAnimation) {
      return;
    }
    this.panelAnimation = true;

    if (this.settingsVisible) {
      anime.timeline()
        .add({
          targets: '.content',
          height: 0,
          duration: 100,
          easing: 'easeInExpo'
        }).add({
          targets: '.gearSymbol',
          translateX: 0,
          rorate: '2turn',
          duration: 150,
          easing: 'easeOutExpo'
        }).add({
          targets: '.controller',
          width: $('.gearSymbol').width(),
          duration: 150,
          easing: 'easeOutExpo'
        }).finished.then(() => {
          this.settingsVisible = false;
          this.panelAnimation = false;
          this.currentView = 'minimizedView';
        });
    } else {
      anime.timeline().add({
        targets: '.controller',
        opacity: 0.8,
        width: 300,
        easing: 'easeOutExpo',
        duration: 150
      }).add({
        targets: '.gearSymbol',
        translateX: [300 - $('.gearSymbol').width() - 4],
        easing: 'easeOutExpo',
        rotate: '2turn',
        duration: 150,
        offset: -150
      }).add({
        targets: '.content',
        height: [0, 45 * this.moduleList.length],
        easing: 'easeOutExpo'
      }).finished.then(() => {
        this.settingsVisible = true;
        this.panelAnimation = false;
        this.currentView = 'moduleSelectionView';
        this.changeView('.content', '.content');
      });
    }
  }

  initAnimations() {
    // Spinning animation for gear icon
    const spinGear = anime({
      targets: '.gearSymbol',
      rotate: 360,
      duration: 1000,
      easing: 'linear',
      loop: true,
      autoplay: false
    });

    // Play and pause spin animation when hover/unhover
    $('.gearSymbol').hover(() => {
      spinGear.play();
    }, () => {
      spinGear.pause();
      anime({
        targets: '.gearSymbol',
        rotate: '360',
        easing: 'easeOutExpo',
      });
    });
  }
}
