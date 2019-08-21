import { Component, ElementRef } from '@angular/core';
import { StorageService } from 'src/app/_services/storage/storage.service';

export class ApplicationSettings {
  iconOpacity: number;
  background = {
    type: 'file',
    hex: '#000000',
    file: './assets/img/backgrounds/default_background.jpg',
    url: ''
  };
}

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent {
  private appSettings: ApplicationSettings;
  private storageRef = 'appSettings';
  private backgroundQuery = '.wholePage';
  private iconOpacity = 0;

  constructor(
    private _storageService: StorageService,
    private elementRef: ElementRef
  ) {
    this.loadStorage();
    this.updateAppSettings(this.appSettings);
  }

  /**
   * Loads application settings from storage, if doesn't exist, create default settings
   */
  loadStorage() {
    this.appSettings = this._storageService.getStorageJSON(this.storageRef);
    if (!this.appSettings) {
      this._storageService.setStorage(this.storageRef, new ApplicationSettings);
      this.loadStorage();
    }
    this.iconOpacity = this.appSettings.iconOpacity;
    this.setBackground(this.appSettings);
  }

  /**
   * Update the application settings
   * @param newSettings the new settings
   */
  updateAppSettings(newSettings: ApplicationSettings) {
    this._storageService.setStorage(this.storageRef, newSettings);
  }

  /**
   * Updates the setting icon opacity when minimised
   */
  updateIcon() {
    this.appSettings.iconOpacity = this.iconOpacity / 100;
    this.updateAppSettings(this.appSettings);
    // Todo: Update icon opacity on startup
  }

  /**
   * Reset the whole application
   */
  resetApplication() {
    // Todo: Add reset application button script
    console.log('Todo: Add reset application button script');
  }

  /**
   * Set the input file into local storage and as the background
   */
  configFileBackground(data: any) {
    const newFile = data.target.files[0];
    if (!newFile) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target['result']) {
        throw new Error('Invalid file');
      }
      this.appSettings.background.type = 'file';
      this.appSettings.background.file = e.target['result'];
      this.setBackground(this.appSettings);
    };
    reader.readAsDataURL(newFile);
  }

  /**
   * Prompts the user for a background URL. If valid, continue to use image as background
   */
  configUrlBackground() {
    const urlPrompt = prompt('Enter URL to image here');
    if (!urlPrompt) {
      return;
    }

    const imageRef = document.getElementById('imageTester');
    imageRef['src'] = urlPrompt;
    imageRef.onerror = () => {
      alert('URL entered is invalid. Ensure URL directs to an image.');
      return;
    };
    imageRef.onload = () => {
      this.appSettings.background.type = 'url';
      this.appSettings.background.url = urlPrompt;
      this.setBackground(this.appSettings);
    };
  }

  /**
   * Prompts the user for hex color. If valid, continue to use hex color as background
   */
  configHexBackground() {
    const hexColor = prompt('Enter a Hex color', '#000000');
    if (!hexColor) {
      return;
    }
    const isHexColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexColor);
    if (isHexColor) {
      this.appSettings.background.type = 'hex';
      this.appSettings.background.hex = hexColor;
      this.setBackground(this.appSettings);
    } else {
      alert('Hex color is invalid. For more information visit https://www.w3schools.com/colors/colors_picker.asp');
    }
  }

  /**
   * Set the background of the application
   * @param appSetting the application settings with background details inside
   */
  setBackground(appSetting: ApplicationSettings) {
    const bgDetails = appSetting.background;
    const bgRefStyle = this.elementRef.nativeElement.ownerDocument.querySelector(this.backgroundQuery).style;
    bgRefStyle.backgroundRepeat = 'no-repeat';
    bgRefStyle.backgroundSize = 'cover';

    switch (bgDetails.type) {
      case 'hex':
        bgRefStyle.backgroundImage = null;
        bgRefStyle.backgroundColor = bgDetails.hex;
        break;
      case 'file':
        bgRefStyle.backgroundImage = 'url(' +  bgDetails.file + ')';
        break;
      case 'url':
        bgRefStyle.backgroundImage = 'url(' + bgDetails.url + ')';
        break;
      default:
        throw new Error('Invalid application settings');
    }

    try {
      this.updateAppSettings(this.appSettings);
    } catch (e) {
      if (bgDetails.type === 'file') {
        console.log('Todo: Split file into smaller sections and store');
        // Most likely a file too large error
        // Break up file into smaller sections
      } else {
        throw e;
      }
    }
  }
}
