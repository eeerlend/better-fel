# Better FEL

## Build status

[![CircleCI](https://circleci.com/gh/eeerlend/better-fel/tree/master.svg?style=svg)](https://circleci.com/gh/eeerlend/better-fel/tree/master)

## Getting started

Project requires [node](https://nodejs.org/en/) and [webpack](https://webpack.github.io/)

### Clone the repo
```sh
git clone https://github.com/eeerlend/better-fel.git
cd better-fel
npm install
```

### Developing
To start developing simply run `gulp` in the terminal.

The website uses React to populate templates with data from the api. For that reason we can't listen on `$(document).ready()` when developing. Instead use `$(document).on('fplReady')` to know when the page is ready to be modified.
