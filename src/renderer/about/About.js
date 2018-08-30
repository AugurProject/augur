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
          <div className={Styles.about_img}>
            <img src={augurPng} alt="augur logo" height="150" width="150" />
          </div>
          <div className={Styles.about_versions}>
            <div className={Styles.about_title}>Augur App</div>
            <div className={Styles.about_version}>
              Version {version}
            </div>

            <div>
              <a href="https://github.com/AugurProject/augur-app" target="blank">Source</a>
            </div>
            <div className={Styles.about_license}>
              <span className={Styles.about_license_label}>License</span> MIT
            </div>
            
            
            <div className={Styles.about_geth}>
              Shipped with Go Ethereum
            </div>
            <div className={Styles.about_geth_info}>
              For more information visit their github repository.
            </div>

            <div>
              <a href="https://github.com/ethereum/go-ethereum/releases" target="blank">Releases</a>
            </div>
            <div className={Styles.about_license}>
              <span className={Styles.about_license_label}>License</span> GPLv3
            </div>
          </div>

        </div>
      
      </section>
    )
  }
}
