import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Dropdown from "../../../common/components/dropdown/dropdown";
import ChevronFlip from "../../../common/components/chevron-flip/chevron-flip";
import DropdownStyles from "../../../common/components/dropdown/dropdown.styles.less";
import Styles from './network-dropdown.styles.less'

export class NetworkDropdown extends Component {
	static propTypes = {
	    connections: PropTypes.object.isRequired,
	    updateModal: PropTypes.func.isRequired,
	    updateSelectedConnection: PropTypes.func.isRequired,
	    isConnectedPressed: PropTypes.bool,
	    openBrowserEnabled: PropTypes.bool,
	    stopAugurNode: PropTypes.func.isRequired,
	};

	constructor(props) {
	    super(props);

	    let selectedKey = this.findSelectedKey(props.connections)
	    this.state = {
	      menuIsOpen: false,
	      selectedNetwork: selectedKey,
	    };

	    this.addNew = this.addNew.bind(this);
	    this.setMenuIsOpen = this.setMenuIsOpen.bind(this);
	    this.renderCircle = this.renderCircle.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.connections !== this.props.connections) {
			const key = this.findSelectedKey(this.props.connections)
			this.setState({selectedNetwork: key})
		}
	}

	findSelectedKey(connections) {
		let selectedKey = null
	    for (let key in connections) {
	    	if (connections[key].selected) {
	    		selectedKey = key;
	    		break;
	    	}
	    }
	    return selectedKey
	}

	selectNetwork(networkId) {
    if (this.state.selectedNetwork !== networkId) {
      this.props.updateSelectedConnection(networkId)
      this.setState({menuIsOpen: false})
      this.setState({selectedNetwork: networkId})

      if (this.props.isConnectedPressed) {
        this.props.stopAugurNode();
      }
    }
	}

	setMenuIsOpen(value) {
		this.setState({menuIsOpen: value})
	}

	addNew(e) {
		this.props.updateModal();
		e.stopPropagation();
	}

	editConnection(connection, key, e) {
		connection.key = key
		this.props.updateModal({initialConnection: connection})
		e.stopPropagation();
	}

	renderCircle(isSelected) {
		const {
  			isConnectedPressed,
  			openBrowserEnabled,
  		} = this.props

		return (
			<div
        		className={classNames(Styles.NetworkDropdown__circle, Styles['NetworkDropdown__circle-big'], {
        			[Styles['NetworkDropdown__circle-blue']]: isSelected && isConnectedPressed && !openBrowserEnabled,
       				[Styles['NetworkDropdown__circle-green']]: isSelected && isConnectedPressed && openBrowserEnabled
   				})}
    		/>
		)
	}

  	render() {
  		const {
  			connections,
  			isConnectedPressed,
  			openBrowserEnabled,
  		} = this.props

	  	let options = []
	  	let userCreatedOptions = []

	  	for (let key in connections) {
	  		const isSelected = (key === this.state.selectedNetwork)
	  		if (connections[key].userCreated) {
	  			userCreatedOptions.push(
		  			<div
		              key={key}
		              className={classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem)}
		              onClick={this.selectNetwork.bind(this, key)}
		            >
		              {this.renderCircle(isSelected)}
		              <div className={Styles.NetworkDropdown__name}>{connections[key].name}</div>
	              	  <div onClick={this.editConnection.bind(this, connections[key], key)} className={Styles.NetworkDropdown__editButton} />
		            </div>
	  			)
	  		} else {
		  		options.push(
		  			<div
		              key={key}
		              className={classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem)}
		              onClick={this.selectNetwork.bind(this, key)}
		            >
		              {this.renderCircle(isSelected)}
		              <div className={Styles.NetworkDropdown__name}>{connections[key].name}</div>
		            </div>
		  		)
		  	}
	  	}

	  	return (
	  		<section className={Styles.NetworkDropdown}>
		        <Dropdown big setMenuIsOpen={this.setMenuIsOpen}
		        	button={
			        	[
			        		<div key="0" className={classNames(Styles.NetworkDropdown__label, {
		               				[Styles['NetworkDropdown__label-open']]: this.state.menuIsOpen
		           				})}>
				        		<div
					        		className={classNames(Styles.NetworkDropdown__circle, {
					        			[Styles['NetworkDropdown__circle-blue']]: isConnectedPressed && !openBrowserEnabled,
			               				[Styles['NetworkDropdown__circle-green']]: isConnectedPressed && openBrowserEnabled
			           				})}
				        		/>
				        		<div className={Styles.NetworkDropdown__labelText}>
				        			{connections[this.state.selectedNetwork] && connections[this.state.selectedNetwork].name}
				        		</div>
				        		<div className={Styles.NetworkDropdown__svg}>
				        			<ChevronFlip  pointDown={this.state.menuIsOpen} />
				        		</div>
				        	</div>
			        	]
		        	}
		        >
		        	<div className={Styles.NetworkDropdown__dropdownLabel}>Networks</div>
		        	{options}
		        	<div key='break' className={Styles.NetworkDropdown__break}/>
		        	{userCreatedOptions}
		          	<div
		          		onClick={this.addNew}
		          		className={classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem, Styles.NetworkDropdown__addNewButton)}
					>
						Add New
						<div className={Styles.NetworkDropdown__addNewSvg}/>
					</div>
		        </Dropdown>
			</section>
	  	)
	}
}
