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

    const datetime = new Date(this.element.attr('datetime'))
    const localDatetime = dateformat(datetime, 'dd mmm HH:MM Z')

    this.element.text(localDatetime)
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