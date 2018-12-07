import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {


	constructor() { 
        if (typeof(Storage) !== "undefined") {
            console.log('storage found')
        } 
        else console.log('no storage found');
	}


    getStorageJSON(key: string){
        var value = localStorage.getItem(key);
        if(!value) return null;

        try { value = JSON.parse(value); }
        catch(err) { return null; }
        
        return value;
    }

    getStorageString(key: string){
        var value = localStorage.getItem(key);
        if(!value) return null;        
        return value;
    }

    setStorage(key: string, value: any){
        localStorage.setItem(key, JSON.stringify(value));       
    }

    deleteStorage(key){
        localStorage.removeItem(key);
    }


}
