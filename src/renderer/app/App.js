import * as React from 'react'
import { Component } from 'react'
// import Styles from './app.styles.less'
import { Logo } from "./components/logo/logo";
import { NetworkDropdown } from "./components/network-dropdown/network-dropdown";
import { ProcessingView } from "./components/processing-view/processing-view";
import { ConnectingView } from "./components/connecting-view/connecting-view";
import './app.styles.css';
import { Link } from 'react-router-dom'

export class App extends Component {
  render() {
    return (
      <div className='App'>
        <div className='App__row'>
          <Logo />
        </div>
        <div>
          <NetworkDropdown />
          <ConnectingView connected={true}/>
          <ProcessingView />
          <div><Link to='/about'>About</Link></div>
        </div>
      </div>
    )
  }
}
