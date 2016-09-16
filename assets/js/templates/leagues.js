const $ = require('jquery')
const settings = require('../core/settings.js')

let leagues = {

  // Cache
  cache: function() {
    this.rowTemplate = $('#ismt-leagues-standings-classic-table-item')
    this.headTemplate = $('#ismt-leagues-standings-classic-table')
  },

  getSetting: function(done) {
    chrome.storage.sync.get((settings) => done(settings.expandLeagueStandings))
  },

  listenOnSettings: function() {
    settings.watch('expandLeagueStandings', (newValue) => newValue === true ? this.render() : false)
  },

  alterHeadTemplate: function() {
    let content = this.headTemplate.text()
    content = content.replace('<th><abbr title="Total points">TOT</abbr></th>',
      '<th><abbr title="Total points">TOT</abbr></th>' + 
      '<th><abbr title="Gameweek points (Live)">GW (L)</abbr></th>' + 
      '<th><abbr title="Total points (Live)">TOT (L)</abbr></th>' + 
      '<th><abbr title="Points benched">PB</abbr></th>' + 
      '<th><abbr title="Team value">TV</abbr></th>' + 
      '<th><abbr title="In the bank">ITB</abbr></th>' + 
      '<th><abbr title="Total budget">TB</abbr></th>' + 
      '<th><abbr title="Gameweek transfers">GWT</abbr></th>' + 
      '<th><abbr title="Transfer cost">TC</abbr></th>' + 
      '<th><abbr title="Total transfers">TT</abbr></th>' + 
      '<th><abbr title="Captain">CPT</abbr></th>' + 
      '<th><abbr title="Chip">Chip</abbr></th>'
      )

    this.headTemplate.text(content)
  },

  alterRowTemplate: function() {
    let content = this.rowTemplate.text()
    content = content.replace('<td>', '<td data-entry-id="<%- obj.entry %>">')
    
    this.rowTemplate.text(content)
  },

  render: function() {
    this.alterHeadTemplate()
  },

  init: function() {
    this.cache()
    this.alterRowTemplate()
    this.listenOnSettings()

    this.getSetting((value) => {
      // if (value === true)
        // this.render()
    })
  }

}

leagues.init()