import React, { Component } from "react";
import PropTypes from "prop-types";
// import Styles from './settings-dropdown.styles.less'
import Dropdown from "../../../common/components/dropdown/dropdown";
import settingsPng from '../../../../assets/images/settings.png'
import DropdownStyles from "../../../common/components/dropdown/dropdown.styles.less";

export class SettingsDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ledgerEnabled: false,
    };

    this.toggleLedger = this.toggleLedger.bind(this);
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
  		<section>
        <Dropdown button={[<img key="0" src={settingsPng} alt="Settings" width="19" style={{marginBottom: '5px'}} />]}>
          {options.map((option, index) => (
            <div
              key={index}
              className={DropdownStyles.Dropdown__menuItem}
              onClick={option.onClick}
            >
              {option.label}
            </div>
          ))}
        </Dropdown>
		  </section>
  	)
  }
}