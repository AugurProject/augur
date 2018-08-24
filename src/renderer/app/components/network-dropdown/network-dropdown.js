import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from './network-dropdown.styles.less'
import Dropdown from "../../../common/components/dropdown/dropdown";
import ChevronFlip from "../../../common/components/chevron-flip/chevron-flip";

export class NetworkDropdown extends Component {
	static propTypes = {
	    connections: PropTypes.array.isRequired,
	};

	constructor(props) {
	    super(props);

	    this.state = {
	      menuIsOpen: false, 
	      selectedNetwork: 0, // need connectionInfo state object, and constants for network names, need to do a hunt here (or in container) for selected
	    };

	    this.setMenuIsOpen = this.setMenuIsOpen.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.connections !== this.props.connections) {
			this.setState({selectedNetwork: 0})
		}
	}

	selectNetwork(networkId) { // networkId is network name 
		this.setState({selectedNetwork: networkId})
	}

	setMenuIsOpen(value) {
		this.setState({menuIsOpen: value})
	}


  	render() {
	  	const { connections } = this.props;
	  	console.log(connections)
	  	let options = []

	  	for (let i = 0; i < connections.length; i++) {
	  		let connected = (i === this.state.selectedNetwork)
	  		options.push({
	  			onClick: this.selectNetwork.bind(this, i),
	  			label: [
	  				<div key="0">
	  					{connections[i].name}
	  				</div>
	  			]
	  		})
	  	}

	  	return (
	  		<section className={Styles.NetworkDropdown}>
		        <Dropdown options={options} setMenuIsOpen={this.setMenuIsOpen}>
		        	<div className={classNames(Styles.NetworkDropdown__label, {
               				[Styles['NetworkDropdown__label-open']]: this.state.menuIsOpen
           				})}>
		        		<div className={Styles.NetworkDropdown__labelText}>
		        			{connections[this.state.selectedNetwork] && connections[this.state.selectedNetwork].name}
		        		</div>
		        		<div className={Styles.NetworkDropdown__svg}>
		        			<ChevronFlip  pointDown={this.state.menuIsOpen} />
		        		</div>
		        	</div>
		        </Dropdown>
			</section>
	  	)
	}
}