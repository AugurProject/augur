const {app} = require('electron').remote

function AboutRenderer() {

  document.getElementById('version').innerHTML = app.getVersion()
}

module.exports = AboutRenderer
