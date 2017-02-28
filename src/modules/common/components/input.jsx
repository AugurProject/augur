import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';

import debounce from 'utils/debounce';

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
    updateValue: PropTypes.func,
    canToggleVisibility: PropTypes.bool,
    shouldMatchValue: PropTypes.bool,
    comparisonValue: PropTypes.string,
    isSearch: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.finalDebounceMS = this.props.debounceMS > 0 || this.props.debounceMS === 0 ? this.props.debounceMS : 500;
    this.state = {
      value: this.props.value || '',
      timeoutID: '',
      isHiddenContentVisible: false
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.timeoutVisibleHiddenContent = debounce(this.timeoutVisibleHiddenContent.bind(this), 1200);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.canToggleVisibility && !nextState.value && nextState.isHiddenContentVisible) {
      this.setState({ isHiddenContentVisible: false });
    }

    if (this.state.isHiddenContentVisible !== nextState.isHiddenContentVisible && nextState.isHiddenContentVisible) {
      this.timeoutVisibleHiddenContent();
    }
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

  handleToggleVisibility = () => {
    this.setState({ isHiddenContentVisible: !this.state.isHiddenContentVisible });
  };

  timeoutVisibleHiddenContent = () => {
    this.setState({ isHiddenContentVisible: false });
  }

  render() {
    const { isClearable, isIncrementable, incrementAmount, updateValue, canToggleVisibility, shouldMatchValue, comparisonValue, isSearch, ...p } = this.props;
    const s = this.state;

    return (
      <div className={classNames('input', p.className, { 'is-incrementable': isIncrementable, 'can-toggle-visibility': canToggleVisibility })} >
        {isSearch &&
          <i className="fa fa-search" />
        }
        {!p.isMultiline &&
          <input
            {...p}
            className={classNames('box', p.className, { 'search-input': p.isSearch })}
            type={p.type === 'password' && s.isHiddenContentVisible ? 'text' : p.type}
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
          <button
            type="button"
            className="button-text-only"
            onClick={this.handleClear}
          >
            <i className="fa fa-close" />
          </button>
        }

        {canToggleVisibility && s.value &&
          <button
            type="button"
            className="button-text-only"
            onClick={this.handleToggleVisibility}
            tabIndex="-1"
          >
            {s.isHiddenContentVisible ?
              <i className="fa fa-eye-slash" /> :
              <i className="fa fa-eye" />
            }
          </button>
        }

        {shouldMatchValue && s.value &&
          <div className="input-value-comparison">
            {s.value === comparisonValue ?
              <i className="fa fa-check-circle input-does-match" /> :
              <i className="fa fa-times-circle input-does-not-match" />
            }
          </div>
        }

        {isIncrementable &&
          <div className="value-incrementers">
            <button
              className="increment-value unstyled"
              onClick={() => {
                if ((!isNaN(parseFloat(s.value)) && isFinite(s.value)) || !s.value) {
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
                }
              }}
            >
              <i className="fa fa-angle-up" />
            </button>
            <button
              className="decrement-value unstyled"
              onClick={() => {
                if ((!isNaN(parseFloat(s.value)) && isFinite(s.value)) || !s.value) {
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
                }
              }}
            >
              <i className="fa fa-angle-down" />
            </button>
          </div>
        }
      </div>
    );
  }
}
