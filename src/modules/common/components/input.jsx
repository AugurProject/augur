import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import BigNumber from 'bignumber.js';

import shouldComponentUpdatePure from 'utils/should-component-update-pure';

export default class Input extends Component {
	// TODO -- Prop Validations
	static propTypes = {
		// type: PropTypes.string,
		// className: PropTypes.string,
		value: PropTypes.any,
		// isMultiline: PropTypes.bool,
		isClearable: PropTypes.bool,
		debounceMS: PropTypes.number,
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		isIncrementable: PropTypes.bool,
		incrementAmount: PropTypes.number,
		updateValue: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.finalDebounceMS = this.props.debounceMS > 0 || this.props.debounceMS === 0 ? this.props.debounceMS : 500;
		this.state = {
			value: this.props.value || '',
			timeoutID: ''
		};
		this.shouldComponentUpdate = shouldComponentUpdatePure;
		this.componentWillReceiveProps = (nextProps) => {
			if ((nextProps.value || nextProps.value === 0) && nextProps.value !== this.state.value && nextProps.value !== this.props.value) {
				this.setState({ value: nextProps.value });
			}
		};
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleOnBlur = this.handleOnBlur.bind(this);
		this.handleClear = this.handleClear.bind(this);
	}

	handleOnChange = (e) => {
		const newValue = e.target.value;
		if (this.finalDebounceMS) {
			clearTimeout(this.state.timeoutID);
			if (newValue !== this.props.value) {
				this.setState({ timeoutID: setTimeout(() => this.props.onChange(newValue), this.finalDebounceMS) });
			}
		} else if (newValue !== this.props.value) {
			this.props.onChange(newValue);
		}
		this.setState({ value: newValue });
	};

	handleOnBlur = () => {
		if (this.finalDebounceMS) {
			clearTimeout(this.state.timeoutID);
			if (this.state.value !== this.props.value) {
				this.props.onChange(this.state.value);
			}
		}
		this.props.onBlur && this.props.onBlur();
	};

	handleClear = () => {
		this.setState({ value: '' });
		this.props.onChange('');
	};

	render() {
		const { isClearable, isIncrementable, incrementAmount, updateValue, ...p } = this.props;
		const s = this.state;

		return (
			<div className={classNames('input', p.className, { 'is-incrementable': isIncrementable })} >
				{!p.isMultiline &&
					<input
						{...p}
						className="box"
						value={s.value}
						onChange={this.handleOnChange}
						onBlur={this.handleOnBlur}
					/>
				}

				{p.isMultiline &&
					<textarea
						{...p}
						className="box"
						value={s.value}
						onChange={this.handleOnChange}
						onBlur={this.handleOnBlur}
					/>
				}

				{isClearable && !p.isMultiline && !!s.value &&
					<button type="button" className="button-text-only" onClick={this.handleClear}>
						<i></i>
					</button>
				}

				{isIncrementable &&
					<div className="value-incrementers">
						<button
							className="increment-value unstyled"
							onClick={() => {
								let newValue = new BigNumber(s.value || 0);

								if (newValue > p.max) {
									newValue = new BigNumber(p.max);
								} else if (newValue < p.min) {
									newValue = new BigNumber(p.min).plus(new BigNumber(incrementAmount)).toString();
								} else {
									newValue = newValue.plus(new BigNumber(incrementAmount)).toString();
									if (newValue > p.max) {
										newValue = new BigNumber(p.max);
									}
								}

								updateValue(newValue);
							}}
						>
							<i></i>
						</button>
						<button
							className="decrement-value unstyled"
							onClick={() => {
								let newValue = new BigNumber(s.value || 0);

								if (newValue > p.max) {
									newValue = new BigNumber(p.max).minus(new BigNumber(incrementAmount));
								} else if (newValue < p.min) {
									newValue = new BigNumber(p.min);
								} else {
									newValue = newValue.minus(new BigNumber(incrementAmount));
									if (newValue < p.min) {
										newValue = new BigNumber(p.min);
									}
								}

								updateValue(newValue);
							}}
						>
							<i></i>
						</button>
					</div>
				}
			</div>
		);
	}
}
