const { app } = require('electron').remote

import * as React from 'react'
import { Component } from 'react'
import Styles from './about.styles.less'
import augurPng from '../../assets/images/augur.png'

export class About extends Component {
  render() {
    const version = app.getVersion()
    return (
      <section className={Styles.main_section}>
        <div className={Styles.about_top_section}>
          <div>
            <img src={augurPng} alt="augur logo" height="100" width="100" />
          </div>
          <div className={Styles.about_versions}>
            <div>Augur App</div>
            <div>
              version: {version}
            </div>
            <div>
              repository: <a href="https://github.com/AugurProject/augur-app" target="blank">github source</a>
            </div>
            <div>
              license: MIT
            </div>
          </div>

        </div>
        <div className={Styles.about_bottom_section}>
          Augur App ships with a version of geth, go to their github repository to get more information.
          <div className={Styles.about_bottom_padding}>
            Go Ethereum (geth)
            <div>
              Release: <a href="https://github.com/ethereum/go-ethereum/releases" target="blank">github releases</a>
            </div>
            <div>
              license: GPLv3
            </div>
          </div>
        </div>
      </section>
    )
  }
}
