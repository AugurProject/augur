import React, { Component } from "react";
import PropTypes from "prop-types";
// import Styles from './settings-dropdown.styles.less'
import Dropdown from "../../../common/components/dropdown/dropdown";
import settingsPng from '../../../../assets/images/settings.png'
import DropdownStyles from "../../../common/components/dropdown/dropdown.styles.less";
import { resetDatabase } from '../../actions/local-server-cmds'
import { GEN_INFO } from '../../../../utils/constants'

export class SettingsDropdown extends Component {
  constructor(props) {
    super(props);

    this.toggleLedger = this.toggleLedger.bind(this);
  }

  toggleLedger() {
    this.props.updateConfig({ sslEnabled: !this.props.sslEnabled })
    setTimeout(() => {
      this.props.addInfoNotification({
        messageType: GEN_INFO,
        message: 'SSL for Ledger ' + (!this.props.sslEnabled ? 'disabled' : 'enabled')
      })
    }, 500)
  }

  reset() {
    resetDatabase()
  }

  render() {
  	const options = [
  	  { onClick: this.toggleLedger, label: [<div key="0">{this.props.sslEnabled ? "Disable SSL for Ledger" : "Enable SSL for Ledger"}</div>] },
  	  { onClick: this.reset, label: [<div key="0">Reset Database</div>] },
  	];

  	return (
  		<section>
        <Dropdown button={[<img key="0" src={settingsPng} alt="Settings" width="17" style={{marginBottom: '5px'}} />]}>
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


SettingsDropdown.propTypes = {
  sslEnabled: PropTypes.bool,
  updateConfig: PropTypes.func,
  addInfoNotification: PropTypes.func,
};
