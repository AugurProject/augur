/*
const {app} = require('electron').remote

function AboutRenderer() {

  document.getElementById('version').innerHTML = app.getVersion()
}

module.exports = AboutRenderer
*/



import { Component } from 'react'
import logo from './alert-icon.svg'
import './App.css'
import Styles from 'about/about.styles'

class About extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default About
