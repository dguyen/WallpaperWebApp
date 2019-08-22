import { Injectable, ElementRef } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { BehaviorSubject } from 'rxjs';

export enum BackgroundType {
  'FILE',
  'URL',
  'HEX'
}

export class BackgroundData {
  constructor(public type: BackgroundType, public data: string) {}
}

export class ApplicationSettings {
  iconOpacity: number;
  background: BackgroundData;
}

const DEFAULT_SETTINGS = {
  iconOpacity: 0.4,
  background: new BackgroundData(BackgroundType.FILE, './assets/img/backgrounds/default_background.jpg')
};

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private appSettings: ApplicationSettings;
  private storageRef = 'appSettings';
  private backgroundQuery = '.wholePage';
  private elementRef: ElementRef;
  private isReady = false;
  opacityUpdate = new BehaviorSubject<number>(null);

  constructor(private _storageService: StorageService) {}

  /**
   * Initiate the application settings
   */
  init(elementRef: ElementRef) {
    if (this.isReady) {
      return;
    }
    this.isReady = true;
    this.elementRef = elementRef;
    this.loadStorage();
    this.updateAppSettings(this.appSettings);
  }

  /**
   * Returns the application settings
   */
  getAppSettings() {
    return this.appSettings;
  }

  /**
   * Get the current minimum icon opacity
   */
  getIconOpacity() {
    return this.appSettings.iconOpacity;
  }

  /**
   * Returns a subject that updates every time minimum opacity is changed
   */
  getOpacitySubject() {
    return this.opacityUpdate;
  }

  /**
   * Loads application settings from storage, if doesn't exist, create default settings
   */
  private loadStorage() {
    this.appSettings = this._storageService.getStorageJSON(this.storageRef);
    if (!this.appSettings) {
      this._storageService.setStorage(this.storageRef, DEFAULT_SETTINGS);
      this.loadStorage();
    }
    this.opacityUpdate.next(this.appSettings.iconOpacity);
    this.setBackground(this.appSettings.background);
  }

  /**
   * Update the application settings
   * @param newSettings the new settings
   */
  updateAppSettings(newSettings: ApplicationSettings) {
    this._storageService.setStorage(this.storageRef, newSettings);
  }

  /**
   * Update the minimised icon opacity
   * @param opacity the new opacity between 0 - 1
   */
  updateIcon(opacity: number) {
    this.appSettings.iconOpacity = opacity;
    this.opacityUpdate.next(opacity);
    this.updateAppSettings(this.appSettings);
  }

  /**
   * Reset the whole application
   */
  resetApplication() {
    const answer = confirm('Are you sure?');
    if (answer) {
      localStorage.clear();
      location.reload();
    }
  }

  /**
   * Set the background of the application
   * @param bgData the new background data
   */
  setBackground(bgData: BackgroundData) {
    const bgRefStyle = this.elementRef.nativeElement.ownerDocument.querySelector(this.backgroundQuery).style;
    bgRefStyle.backgroundRepeat = 'no-repeat';
    bgRefStyle.backgroundSize = 'cover';

    switch (bgData.type) {
      case BackgroundType.HEX:
        bgRefStyle.backgroundImage = null;
        bgRefStyle.backgroundColor = bgData.data;
        break;
      case BackgroundType.URL:
      case BackgroundType.FILE:
        bgRefStyle.backgroundImage = 'url(' +  bgData.data + ')';
        break;
      default:
        throw new Error('Invalid application settings');
    }
    this.appSettings.background = bgData;

    try {
      this.updateAppSettings(this.appSettings);
    } catch (e) {
      if (bgData.type === BackgroundType.FILE) {
        console.log('Todo: Split file into smaller sections and store');
        // Most likely a file too large error
        // Break up file into smaller sections
      } else {
        throw e;
      }
    }
  }
}
