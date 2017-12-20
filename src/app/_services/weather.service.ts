import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {
    weatherReport: any;
    apiID: string = '084b04a1bd24b3a2834390ec8153f9b1';
    units: string = 'metric';
    initialized: any;

	constructor(private _http: Http) { 
		this.initialized = this.initialize();
	}

    initialize(){
    	return new Promise((resolve, reject) => {
	        this._http.post('https://api.openweathermap.org/data/2.5/forecast', null, {
	            params: {
	                zip: '3149,au',
	                APPID: this.apiID,
	            	units: this.units
	            }
	        }).map(res => res.json()).subscribe((res) => {
	            this.weatherReport = res;
	            console.log(res);
	            this.getDayData();
	            resolve()
	        }, (err) => {
	            console.log(err);
	            reject();
	        });
    	})


    }

    // day starts from 1 - 5
    getDayData(){
		if (!this.weatherReport) throw 'Service not initialized';
		var data = this.weatherReport.list;
		var min = data[0].main.temp_min,
			max = data[0].main.temp_max,
			avg = 0,
			cnt = 0;

		var dateHolder = new Date(data[0].dt_txt)	
		var output = [];
		for(var i = 0; i < data.length; i++){
			if(dateHolder.getDate() < new Date(data[i].dt_txt).getDate()){
				avg = avg/cnt // no longer 8
				output.push({
		    		min: Math.round(min),
		    		max: Math.round(max),
		    		avg: Math.round(avg),
		    		date: dateHolder		
				})
				dateHolder = new Date(data[i].dt_txt);	
				min = data[i].main.temp_min
				max = data[i].main.temp_max
				avg = 0;
				cnt = 0;
			}
			if(data[i].main.temp_min < min) min = data[i].main.temp_min;
			if(data[i].main.temp_max > max) max = data[i].main.temp_max;
			avg += data[i].main.temp;
			cnt += 1;
		}
		console.log(output);	
		return output;
    }

    getCurrentTemp(){
    	if (!this.weatherReport) throw 'Service not initialized';
    	var data = this.weatherReport.list;
    	var currDate = Date.now();

    	for(var i = 0; i < data.length; i++){    		
    		if(data[i].dt * 1000 > currDate){
    			return data[i].main.temp;
    		}
    	}
    	throw "Outdated data";
    	

    }

}
