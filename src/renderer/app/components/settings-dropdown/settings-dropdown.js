import React, { Component } from "react";
import PropTypes from "prop-types";
import Styles from './settings-dropdown.styles.less'
import Dropdown from "../../../common/components/dropdown/dropdown";

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
  	  { onClick: this.toggleLedger, label: [<div key="0">{this.state.ledgerEnabled ? "Disable SSL for Ledger" : "Enable SSL for Ledger"}</div>] },
  	  { onClick: this.resetDatabase, label: [<div key="0">Reset Database</div>] },
  	];

  	return (
  		<section className={Styles.SettingsDropdown}>
        <Dropdown options={options}>
          SettingsDropdown
        </Dropdown>
		  </section>
  	)
  }
}