import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../_services/weather.service';

import anime from 'animejs';
import $ from 'jquery';

@Component({
    selector: 'app-weather-module',
    templateUrl: './weather-module.component.html',
    styleUrls: ['./weather-module.component.css',
        '../../../src/assets/weather_icon/css/weather-icons.css'
    ]
})


export class WeatherModuleComponent{ 
    currTemp: number = null;
    currDate: string = '';
    currDay: number = -1;
    weatherData: any = [];
    minTemp: number = 0;
    maxTemp: number = 0;
    animStatus: boolean = false;


    constructor(private _weatherService: WeatherService) { 
        _weatherService.initialized.then(() => {
            this.updateUI();
            setInterval(() => this.refreshData(), 1800000);
        })
    }

    /*
    * Updates the UI with data stored inside weather service
    * NOTE: Make sure data inside weather service is updated before calling or else nothing will update
    * @param {}
    * @return {} 
    */ 
    private updateUI(){
        this.currDay = -1;
        this.weatherData = this._weatherService.getDayData();
        this.currDate = this.parseDate(this.weatherData[0].date);
        this.currTemp = Math.round(this._weatherService.getCurrentTemp());
        this.minTemp = this.weatherData[0].min;
        this.maxTemp = this.weatherData[0].max;
        this.changeDay(0);
    }

    /*
    * Obtains new data from the weather service then updates the UI 
    * @param {}
    * @return {} 
    */ 
    refreshData(){
        this._weatherService.initialize().then(() => {
            this.updateUI();
            console.log("Refreshing UI");
        });
    }

    /*
    * Changes the selected 'day' on the UI
    * @param {number} a number presenting the day from now i.e. today will be day=0, tomorrow day=1
    * @return {} 
    */ 
    changeDay(day){
        if(this.currDay == day || this.animStatus) return;

        this.animStatus = true;
        this.currDay = day;
        anime({
            targets: '.weatherInfo',
            opacity: 0,
            translateY: 100,
            easing: 'easeOutExpo',
            duration: 150            
        }).finished.then(() => {
            this.currTemp = this.weatherData[day].avg;
            this.minTemp = this.weatherData[day].min;
            this.maxTemp = this.weatherData[day].max;
            this.currDate = this.parseDate(this.weatherData[day].date);            
            anime({
                targets: '.weatherInfo',
                opacity: 1,
                translateY: 0,
                easing: 'easeOutExpo',
                duration: 200
            }).finished.then(() => { this.animStatus = false; });
        })
    }


    /*
    * Parses an input date into a string format 'Dayname, DD of Monthname YYYY'
    * @param {date} a date object representing the time you want to format
    * @return {string} a parsed string of the date object
    */    
    parseDate(date){
        var monthNames = [
            "January", "February", "March", "April", "May", 
            "June", "July", "August", "September", "October", 
            "November", "December"
        ];
        var dayNames = [
            "Sunday", "Monday", "Tuesday", "Wednesday", 
            "Thursday", "Friday", "Saturday"
        ];
        var n = date.getDate();
        var postDate;
        
        switch (n % 10) {
            case 1:  postDate = "st"; break;
            case 2:  postDate = "nd"; break;
            case 3:  postDate = "rd"; break;
            default: postDate = "th"; 
        }
        if (n >= 11 && n <= 13) postDate = "th";

        return dayNames[date.getDay()] + ', ' + date.getDate() + postDate + ' of ' + 
        monthNames[date.getMonth()] + ' ' + date.getFullYear();       
    }

    /*
    * Parses an input date into a string format 'DD/MM'
    * @param {date} a date object representing the time you want to format
    * @return {string} a parsed string of the date object 'DD/MM'
    */    
    parseShortDate(date){
        return date.getDate() + '/' + (date.getMonth() + 1);
    }
}