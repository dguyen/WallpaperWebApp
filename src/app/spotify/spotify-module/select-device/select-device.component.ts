import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../../_services/spotify.service';

@Component({
  selector: 'app-select-device',
  templateUrl: './select-device.component.html',
  styleUrls: ['./select-device.component.scss']
})
export class SelectDeviceComponent implements OnInit {
  @Output() deviceSelected = new EventEmitter();
  devices: Array<any>;
  refreshing: Boolean = false;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
    this.refreshDeviceList();
  }

  /**
   * Refresh device list
   */
  refreshDeviceList() {
    if (this.refreshing) { return; }

    this.refreshing = true;
    this._spotifyService.spotifyReady.subscribe((isReady) => {
      if (!isReady) { return; }
      this._spotifyService.getDevices().then((devices) => {
        this.devices = devices;
        this.refreshing = false;
      }).catch((err) => {
        this.refreshing = false;
        throw new Error(err);
      });
    });
  }

  /**
   * Set a device to playback on
   * @param deviceId the new device to stream audio to
   */
  selectDevice(device: any) {
    this._spotifyService.setDevice(device.id).then(() => {
      this.deviceSelected.emit();
      this.devices.forEach((x) => {
        x.is_active = x.id === device.id ? true : false;
      });
    }).catch((err) => {
      if (err.status === 404) {
        this.refreshing = false;
        this.refreshDeviceList();
      } else {
        throw new Error(err);
      }
    });
  }
}
