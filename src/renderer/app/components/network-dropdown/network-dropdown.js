import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from './network-dropdown.styles.less'
import Dropdown from "../../../common/components/dropdown/dropdown";
import ChevronFlip from "../../../common/components/chevron-flip/chevron-flip";

export class NetworkDropdown extends Component {
	static propTypes = {
	    connections: PropTypes.object.isRequired,
	};

	constructor(props) {
	    super(props);

	    this.state = {
	      menuIsOpen: false, 
	      selectedNetwork: props.connections['mainnet'], // need connectionInfo state object, and constants for network names, need to do a hunt here (or in container) for selected
	    };

	    this.setMenuIsOpen = this.setMenuIsOpen.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.connections !== this.props.connections) {
			this.setState({selectedNetwork: this.props.connections['mainnet']})
		}
	}

	selectNetwork(networkId) { // networkId is network name 
		console.log(networkId)
		const { connections } = this.props;
		this.setState({selectedNetwork: connections[networkId]})
	}

	setMenuIsOpen(value) {
		this.setState({menuIsOpen: value})
	}


  	render() {
	  	const { connections } = this.props;
	  	let options = []

	  	for (let key in connections) {
	  		let connected = (key === this.state.selectedNetwork)
	  		options.push({
	  			onClick: this.selectNetwork.bind(this, key),
	  			label: [
	  				<div key="0">
	  					{connections[key].name}
	  				</div>
	  			]
	  		})
	  	}

	  	console.log(this.state.menuIsOpen)


	  	return (
	  		<section className={Styles.NetworkDropdown}>
		        <Dropdown options={options} setMenuIsOpen={this.setMenuIsOpen}>
		        	<div className={classNames(Styles.NetworkDropdown__label, {
               				[Styles['NetworkDropdown__label-open']]: this.state.menuIsOpen
           				})}>
		        		<div className={Styles.NetworkDropdown__labelText}>
		        			{this.state.selectedNetwork && this.state.selectedNetwork.name}
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