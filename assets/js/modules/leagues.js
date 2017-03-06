/*
 * Expands the league view and updates league positions in points view live
 */

const $ = require('jquery')
const players = require('../core/players.js')
const live = require('../core/live.js')
const settings = require('../core/settings.js')
const event = require('../core/readyEvent.js')

let leagues = {

  headers: [
    { name: 'Gameweek points (Live)', abbr: 'GW (L)'},
    { name: 'Total points (Live)', abbr: 'TOT (L)'},
    { name: 'Points benched', abbr: 'PB'},
    { name: 'Team value', abbr: 'TV'},
    { name: 'In the bank', abbr: 'ITB'},
    { name: 'Total budget', abbr: 'TB'},
    { name: 'Gameweek transfers', abbr: 'GWT'},
    { name: 'Transfer cost', abbr: 'TC'},
    { name: 'Total transfers', abbr: 'TT'},
    { name: 'Captain', abbr: 'CPT'},
    { name: 'Chip', abbr: 'Chip'}
  ],

  // Cache
  cache: function() {
    this.table = $('#ismr-classic-standings')
    this.headRow = this.table.find('thead tr')
    this.rows = this.table.find('tbody tr')
    this.select = $('#ismjs-phase')
  },

  listenOnSettings: function() {
    settings.watch('expandLeagueStandings', (newValue) => newValue === true ? this.render() : this.destroy())
  },

  getLive: function() {
    return Promise.resolve( $.ajax('https://fantasy.premierleague.com/drf/event/' + this.event + '/live') )
  },

  getEvent: function() {
    return Promise.resolve( $.ajax('https://fantasy.premierleague.com/drf/bootstrap-dynamic') )
  },

  getEntry: function(id) {
    return Promise.all([
      $.ajax('https://fantasy.premierleague.com/drf/entry/' + id),
      $.ajax('https://fantasy.premierleague.com/drf/entry/' + id + '/event/' + this.event + '/picks'),
    ])
  },

  insertNewHeaders: function() {
    let elements = $()

    this.headers.forEach((header) => {
      elements = elements.add('<th><abbr title="' + header.name + '">' + header.abbr + '</abbr></th>')
    })

    this.headRow.append(elements)
  },

  insertNewColumns: function() {
    this.rows.each((i, el) => {
      el = $(el)

      for (let i = 0; i < 11; i++) {
        el.append( $('<td />') )
      }
    })
  },

  addData: function() {
    this.rows.each((i, el) => {
      el = $(el)
      let entry = el.find('[data-entry-id]').attr('data-entry-id')
      let columns = el.find('td:gt(3)')

      this.getEntry(entry)
        .then((data) => {
          let notBenchBoost = data[1].active_chip !== 'bboost'
          let entry = data[0].entry
          let entryHistory = data[1].entry_history
          let picks = data[1].picks
          let chip = data[1].active_chip
          let captainId = picks.find((p) => p.is_captain).element
              captain = this.players.find((p) => p.id === captainId).web_name

          switch (chip) {
            case 'bboost':
              chip = 'BB'
              break
            case '3xc':
              chip = 'TC'
              break
            case 'attack':
              chip = 'AoA'
              break
            case 'wildcard':
              chip = 'WC'
              break
            default:
              chip = '-'
              break
          }

          let points = picks
            .map((p) => {
              // accumPoints evaluates to {} for Blank Gameweeks
              // and sums 'points' and 'value' for multi-gameweeks
              let accumPoints = this.liveData.elements[p.element].explain
                .reduce((a, b) => {
                  for (var key in b[0]) {
                    if (key in a) {
                      a[key].points += b[0][key].points
                      a[key].value += b[0][key].value
                    } else {
                      a[key] = b[0][key]
                    }
                  }
                  return a
                }, { })

              return {
                multiplier: p.multiplier,
                data: accumPoints
              }
            })
            .map((p, i) => {
              if (i > 10 && notBenchBoost)
                return 0

              let points = 0
              for (var key in p.data) {
                points += p.data[key].points
              }

              return points * p.multiplier
            })
            .reduce((a, b) => a + b, 0)

          let totalPoints = entry.summary_overall_points - entryHistory.points + points
          let values = [
            points,
            totalPoints,
            entryHistory.points_on_bench,
            entry.value === 0 ? 0 : (entry.value / 10).toFixed(1),
            entry.bank === 0 ? 0 : (entry.bank / 10).toFixed(1),
            entry.value + entry.bank === 0 ? 0 : ((entry.value + entry.bank) / 10).toFixed(1),
            entryHistory.event_transfers,
            entryHistory.event_transfers_cost,
            entry.total_transfers,
            captain,
            chip
          ]

          columns.each((i, el) => {
            let value = values[i]
            $(el).text(value)
          })
        })
        .catch((err) => console.error(err))
    })
  },

  doItLive: function() {
    setInterval(() => {
      this.getLive()
        .then((data) => {
          this.liveData = data
          this.addData()
        })
        .catch((err) => console.error(err))
    }, 5000)
  },

  render: function() {
    this.insertNewHeaders()
    this.insertNewColumns()
    players.get()
      .then((players) => {
        this.players = players
        return this.getEvent()
      })
      .then((data) => {
        this.event = data['current-event']
        return this.getLive()
      })
      .then((data) => {
        this.liveData = data
        this.addData()
        this.doItLive()
      })
      .catch((err) => console.error(err))
  },

  destroy: function() {
    this.headRow.find('th:gt(3)').remove()
    this.rows.find('td:gt(3)').remove()
  },

  init: function() {
    this.cache()
    this.listenOnSettings()

    if (window.location.href.indexOf('/leagues/standings') < 0 || settings.get('expandLeagueStandings') === false)
      return

    // this.bind()
    this.render()
  }

}

$(document).on('fplReady', () => leagues.init())
