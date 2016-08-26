const $ = require('jquery')

let live = {

  playerDidNotPlay: function(id) {

  },

  getLiveData: function() {
    return Promise.resolve( $.ajax('https://fantasy.premierleague.com/drf/bootstrap-dynamic') )
      .then((data) => {
        let currentEvent = data['current-event']

        return Promise.resolve( $.ajax('https://fantasy.premierleague.com/drf/event/' + currentEvent + '/live') )
      })
      .catch((err) => { throw err })
  },

}

module.exports = live