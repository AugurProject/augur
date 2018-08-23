import * as React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'

export class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <h2 className="App-title">Main Page</h2>
            <div>
              Here is some content
              <div><Link to='/about'>About</Link></div>
            </div>
          </header>
        </div>
      </div>
    )
  }
}
