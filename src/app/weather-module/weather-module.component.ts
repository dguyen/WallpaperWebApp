import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

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


export class WeatherModuleComponent implements OnInit {
    currTemp: number = null;
    currDate: string = '';
    currDay: number = -1;
    weatherData: any = [];
    minTemp: number = 0;
    maxTemp: number = 0;
    animStatus: boolean = false;

    constructor(private _weatherService: WeatherService) { 
        _weatherService.initialized.then(() => {
            this.weatherData = _weatherService.getDayData();
            this.currDate = this.parseDate(this.weatherData[0].date);
            this.currTemp = Math.round(_weatherService.getCurrentTemp());
            this.minTemp = this.weatherData[0].min;
            this.maxTemp = this.weatherData[0].max;
            this.changeDay(null, 0);
        })
    }

    ngOnInit() {
    }

    changeDay(evt, day){
        if(this.currDay == day || this.animStatus) return;
        if (evt) this.highlightIcon(evt);

        this.animStatus = true;
        
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
            this.currDay = day;
            
            anime({
                targets: '.weatherInfo',
                opacity: 1,
                translateY: 0,
                easing: 'easeOutExpo',
                duration: 200
            }).finished.then(() => { this.animStatus = false; });
        })
    }

    // todo
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
            case 1:  postDate = "st";
            case 2:  postDate = "nd";
            case 3:  postDate = "rd";
            default: postDate = "th";
        }
        if (n >= 11 && n <= 13) postDate = "th";

        return dayNames[date.getDay()] + ', ' + date.getDate() + postDate + ' of ' + 
        monthNames[date.getMonth()] + ' ' + date.getFullYear();       
    }

    parseShortDate(date){
        return date.getDate() + '/' + date.getMonth();
    }


    // https://openweathermap.org/weather-conditions
    getWeatherIcon(iconId){
        var imgClass = null;
        switch (iconId) {
            // Day
            case '01d': imgClass = 'wi-day-sunny';
            case '02d': imgClass = 'wi-day-cloudy';
            case '03d': imgClass = 'wi-cloud';
            case '04d': imgClass = 'wi-cloudy'; // broken clouds
            case '09d': imgClass = 'wi-day-showers';
            case '10d': imgClass = 'wi-day-showers';
            case '11d': imgClass = 'wi-day-sleet-storm';
            case '13d': imgClass = 'wi-day-snow';
            case '50d': imgClass = 'wi-windy';
            // Night
            case '01n': imgClass = 'wi-night-sunny';
            case '02n': imgClass = 'wi-night-cloudy';
            case '03n': imgClass = 'wi-cloud';
            case '04n': imgClass = 'wi-cloudy'; // broken clouds
            case '09n': imgClass = 'wi-night-showers';
            case '10n': imgClass = 'wi-night-showers';
            case '11n': imgClass = 'wi-night-sleet-storm';
            case '13n': imgClass = 'wi-night-snow';
            case '50n': imgClass = 'wi-windy';
        }
        return imgClass;
    }

    highlightIcon(evt){
        $('.weatherNavigation').children().each(function(i) {
            $(this).removeClass('selectedWeatherIcon');
        })
        $(evt.target).closest('.weatherIcon').addClass('selectedWeatherIcon');
    }
}

