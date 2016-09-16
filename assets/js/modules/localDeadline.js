// Remove the original deadline time and gives a local time instead

'use strict'

const $ = require('jquery')
const dateformat = require('dateformat')
const settings = require('../core/settings.js')

const localDeadline = {

  // Cache
  cache: function() {
    this.element = $('.ism-deadline-bar__deadline')
    this.deadlineString = this.element.text()
  },

  // Listen for changes to user settings
  listenOnSettings: function() {
    settings.watch('convertDeadline', (newValue) => newValue === true ? this.convertTime() : this.reset())
  },

  // Replace deadline
  convertTime: function() {
    if (settings.get('convertDeadline') === false)
      return

    let datetime = this.deadlineString + ' GMT+0100'
    let date = new Date(datetime)
    let newDateString = dateformat(date, 'dd mmm HH:MM Z')

    this.element.text(newDateString)
  },

  // Reset to default
  reset: function() {
    if (settings.get('convertDeadline') === true)
      return

    this.element.text(this.deadlineString)
  },

  // Init
  init: function() {
    this.cache()
    this.listenOnSettings()
    this.convertTime()
  }

}

$(document).on('fplReady', () => localDeadline.init())