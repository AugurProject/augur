import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Dropdown from "../../../common/components/dropdown/dropdown";
import ChevronFlip from "../../../common/components/chevron-flip/chevron-flip";
import DropdownStyles from "../../../common/components/dropdown/dropdown.styles.less";
import Styles from './network-dropdown.styles.less'

export class NetworkDropdown extends Component {
	static propTypes = {
	    connections: PropTypes.array.isRequired,
	    updateModal: PropTypes.func.isRequired,
	};

	constructor(props) {
	    super(props);

	    this.state = {
	      menuIsOpen: false, 
	      selectedNetwork: 0, // need to make mainnet default selected one
	    };

	    this.addNew = this.addNew.bind(this);
	    this.setMenuIsOpen = this.setMenuIsOpen.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.connections !== this.props.connections) {
			this.setState({selectedNetwork: 0})
		}
	}

	selectNetwork(networkId) {
		this.setState({menuIsOpen: false})
		this.setState({selectedNetwork: networkId})
	}

	setMenuIsOpen(value) {
		this.setState({menuIsOpen: value})
	}

	addNew(e) {
		this.props.updateModal();
		e.stopPropagation();
	}
  	render() {
  		const { connections } = this.props
	  	let options = []
	  	let breakAdded = false

	  	for (let i = 0; i < connections.length; i++) {
	  		let connected = (i === this.state.selectedNetwork)
	  		if (connections[i].userCreated && !breakAdded) {
	  			breakAdded = true
	  			options.push(
	  				<div key='break' className={Styles.NetworkDropdown__break}/>
	  			)
	  		}
	  		options.push(
	  			<div
	              key={i}
	              className={classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem)}
	              onClick={this.selectNetwork.bind(this, i)}
	            >	
	              <div className={classNames(Styles.NetworkDropdown__circle, Styles['NetworkDropdown__circle-big'])} />
	              <div className={Styles.NetworkDropdown__name}>{connections[i].name}</div>
	            </div>
	  		)
	  	}

	  	if (!breakAdded) {
			options.push(
	  			<div key='break' className={Styles.NetworkDropdown__break}/>
	  		)
	  	}

	  	return (
	  		<section className={Styles.NetworkDropdown}>
		        <Dropdown big setMenuIsOpen={this.setMenuIsOpen}
		        	button={
			        	[
			        		<div key="0" className={classNames(Styles.NetworkDropdown__label, {
		               				[Styles['NetworkDropdown__label-open']]: this.state.menuIsOpen
		           				})}>
				        		<div className={Styles.NetworkDropdown__circle} />
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
		          	<div 
		          		onClick={this.addNew}
		          		className={classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem, Styles.NetworkDropdown__addNewButton)}
					>
						Add New
					</div>
		        </Dropdown>
			</section>
	  	)
	}
}