import React from "react";
import { Component } from 'react'
import PropTypes from "prop-types";
import Styles from './settings-dropdown.styles.less'

// dropdown should be made into a shared component so network dropdown can use

export class SettingsDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ledgerEnabled: false,
      showSettings: false,
    };

    this.toggleLedger = this.toggleLedger.bind(this);
    this.toggleShowSettings = this.toggleShowSettings.bind(this);
  }

  toggleShowSettings() {
  	this.setState({showSettings: !this.state.showSettings})
  }

  toggleLedger() {
  	console.log('enable/disable ledger clicked')
  	this.setState({ledgerEnabled: !this.state.ledgerEnabled})
  }

  resetDatabase() {
  	console.log('reset db clicked')
  }

  render() {
  	const options = [
	  { onClick: this.toggleLedger, label: (this.state.ledgerEnabled ? "Disable SSL for Ledger" : "Enable SSL for Ledger") },
	  { onClick: this.resetDatabase, label: "Reset Database" },
	];
  	return (
  		<section className={Styles.SettingsDropdown}>
		    <div style={{cursor: 'pointer'}} onClick={this.toggleShowSettings}>SettingsDropdown</div>
		    { this.state.showSettings &&
		    	<div className={Styles.SettingsDropdown__menu}>
		    		{options.map((option, index) => (
	                  <div key={index} className={Styles['SettingsDropdown__menu-item']} onClick={option.onClick}>{option.label}</div>
	                ))}
		    	</div>
		    }
		</section>
  	)
  }
}