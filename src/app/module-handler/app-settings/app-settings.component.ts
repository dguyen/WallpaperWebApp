import { Component, ElementRef } from '@angular/core';
import { AppSettingsService, BackgroundType, BackgroundData } from 'src/app/_services/app-settings/app-settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent {
  iconOpacity = 0;

  constructor(public elementRef: ElementRef, private _appSettingsService: AppSettingsService) {
    this._appSettingsService.init(elementRef);
    this.iconOpacity = this._appSettingsService.getIconOpacity() * 100;
  }

  /**
   * Updates the setting icon opacity when minimised
   */
  updateIcon() {
    this._appSettingsService.updateIcon(this.iconOpacity / 100);
  }

  /**
   * Reset the whole application
   */
  resetApplication() {
    this._appSettingsService.resetApplication();
  }

  /**
   * Set the input file into localstorage and as the background
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
      this._appSettingsService.setBackground(new BackgroundData(BackgroundType.FILE, e.target['result']));
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
      this._appSettingsService.setBackground(new BackgroundData(BackgroundType.URL, urlPrompt));
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
      this._appSettingsService.setBackground(new BackgroundData(BackgroundType.HEX, hexColor));
    } else {
      alert('Hex color is invalid. For more information visit https://www.w3schools.com/colors/colors_picker.asp');
    }
  }
}
