const $ = require('jquery')

let template = {

  cache: function() {
    this.template = $('#ismt-team-history-scoreboard-finished')
  },

  replace: function() {
    let content = this.template.text()
        content = content.replace('<%- points %>', '<%- (console.log(obj)) %>')

    this.template.text(content)
  },

  init: function() {
    this.cache()
    this.replace()
  }

}

template.init()