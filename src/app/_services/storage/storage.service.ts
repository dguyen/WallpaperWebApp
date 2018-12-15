import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
    if (typeof (Storage) === 'undefined') {
      throw new Error('Storage not found');
    }
  }

  /**
   * Retrieve stored data in JSON format
   * @param key key of data to retrieve
   */
  getStorageJSON(key: string) {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value) ? JSON.parse(value) : null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Retrieve stored data in string format
   * @param key key of data to retrieve
   */
  getStorageString(key: string) {
    const value = localStorage.getItem(key);
    return !value ? null : value;
  }

  /**
   * Store data into storage
   * @param key key of data to store
   * @param value data to store
   */
  setStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Delete data related to the key given
   * @param key key of data to delete
   */
  deleteStorage(key) {
    localStorage.removeItem(key);
  }
}
