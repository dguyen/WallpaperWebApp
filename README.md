# Interactive Wallpaper Application

Designed to be used in conjunction with the application [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/). Wallpaper Engine allows you to integrate a website into your device's wallpaper. This project assumes you will be using Wallpaper Engine.


## About

This project, developed using [Angular](https://angular.io/), is aimed to integrate interactive modules into your desktop background. To reduce the number of applications and clutter on your computer, Wallpaper Engine allows you to have simplified applications integrated into your background.

For example, instead of having a screen with Spotify open, you could have a simplified widget integrated into your background enabling you to perform the same functions but without the application.

## Project Status

The application currently features:
 - Weather Module
 - Spotify Module

More modules are being developed!

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [AngularCLI](https://cli.angular.io/)

## Getting Started

There are two ways you can integrate this project with **Wallpaper Engine**.

 - ~~Subscribe to this project on Wallpaper Engine's workshop (recommended)~~
 - Build locally and create a new project on Wallpaper Engine

### Steam Workshop Method (Recommended)

This application will be added to the steam workshop at a later date.

### Build Locally 

Run `npm install` to install packages

Run `ng build --prod`

Move the folder inside the \dist directory to a suitable location

Launch `Wallpaper Engine`
 1. Select ***Wallpaper Editor***
 2. Select ***Create Wallpaper*** and navigate to WallpaperWebApp folder
 3. Select ***index.html***
 4. Click ***OK***
 5. Select ***File->Apply Wallpaper***

## Development server

Run `ng start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Using different Spotify API

If you would like to develop using your own Spotify API follow these steps.

**Configuring keys**

 1. Create a Spotify Application [here](https://developer.spotify.com/dashboard/applications)
 2. Set the redirect uri of your Spotify Application as `http://localhost:3000/api/callback`
 3. Note the Client ID and Client Secret of your Spotify Application
 4. Inside server\routes\api.js input your Client ID and Client Secret
 5. Inside ***src\environment.ts*** and ***src\environment.prod.ts*** replace apiServer with `http://127.0.0.1:3000/`

**Running development server**

 1. Run `node server/server.js`
 2. Run `npm start` to start dev server
 3. Navigate to `http://localhost:4200/`
