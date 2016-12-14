import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Input from 'modules/common/components/input';

export default class InputList extends Component {
	// TODO -- Prop Validations
	static propTypes = {
		// className: PropTypes.string,
		list: PropTypes.array,
		// errors: PropTypes.array,
		listMinElements: PropTypes.number,
		// listMaxElements: PropTypes.number,
		// itemMaxLength: PropTypes.number,
		onChange: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.fillMinElements = this.fillMinElements.bind(this);
		this.state = {
			list: this.fillMinElements(this.props.list, this.props.listMinElements),
			timeoutID: ''
		};
	}

	handleChange = (i, val) => {
		const newList = (this.state.list || []).slice();
		if ((!val || !val.length) && (!this.props.listMinElements || (i >= this.props.listMinElements))) {
			newList.splice(i, 1);
		} else {
			newList[i] = val;
		}

		if (this.state.timeoutID) {
			clearTimeout(this.state.timeoutID);
		}
		this.setState({ timeoutID: setTimeout(() => this.props.onChange(newList), 750), list: newList });
	};

	fillMinElements = (list = [], minElements) => {
		let len;
		let i;
		let newList = list;
		if (minElements && list.length < minElements) {
			newList = newList.slice();
			len = minElements - newList.length;
			for (i = 0; i < len; i++) {
				newList.push('');
			}
		}
		return newList;
	};

	render() {
		const p = this.props;
		const s = this.state;
		let list = s.list;

		if (!p.listMaxElements || list.length < p.listMaxElements) {
			list = list.slice();
			list.push('');
		}

		return (
			<div className={classnames('input-list', p.className)}>
				{list.map((item, i) => (
					<div key={i} className={classnames('item', { 'new-item': i === list.length - 1 && (!item || !item.length) })}>
						<Input
							type="text"
							maxLength={p.itemMaxLength}
							value={item}
							onChange={newValue => this.handleChange(i, newValue)}
						/>
						{p.errors && p.errors[i] && p.errors[i].length &&
							<span className="error-message">{p.errors[i]}</span>
						}
					</div>
				))}
			</div>
		);
	}
}
