/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed for mobile safari

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import Styles from "modules/common/components/input-dropdown/input-dropdown.styles";

class InputDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: props.default || props.label,
      value: props.default,
      showList: false,
      selected: !!props.default
    };

    this.dropdownSelect = this.dropdownSelect.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    const { isMobileSmall, options } = this.props;
    window.addEventListener("click", this.handleWindowOnClick);

    if (isMobileSmall && this.state.value === "") {
      this.dropdownSelect(options[0]);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  onKeyPress(value) {
    const { onKeyPress } = this.props;
    if (onKeyPress) {
      onKeyPress(value);
    }
  }

  dropdownSelect(value) {
    const { onChange } = this.props;
    if (value !== this.state.value) {
      this.setState({
        label: value,
        value,
        selected: true
      });
      onChange(value);
      this.toggleList();
    }
  }

  toggleList() {
    this.setState({ showList: !this.state.showList });
  }

  handleWindowOnClick(event) {
    if (
      this.refInputDropdown &&
      !this.refInputDropdown.contains(event.target)
    ) {
      this.setState({ showList: false });
    } else {
      this.refInputDropdown.focus();
    }
  }

  render() {
    const { className, label, options } = this.props;
    const s = this.state;

    return (
      <div
        ref={InputDropdown => {
          this.refInputDropdown = InputDropdown;
        }}
        className={classNames(Styles.InputDropdown, className)}
        onClick={this.toggleList}
        onKeyPress={value => this.onKeyPress(value)}
      >
        <span
          key={label}
          className={classNames(Styles.InputDropdown__label, {
            [`${Styles.selected}`]: s.selected
          })}
        >
          {s.label}
        </span>
        <div
          className={classNames(Styles.InputDropdown__list, {
            [`${Styles.active}`]: this.state.showList
          })}
        >
          {options.map(option => (
            <button
              className={classNames({
                [`${Styles.active}`]: option === this.state.value
              })}
              key={option + label}
              value={option}
              onClick={() => this.dropdownSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <select
          className={classNames(Styles.InputDropdown__select, {
            [`${Styles.selected}`]: s.selected
          })}
          onChange={e => {
            this.dropdownSelect(e.target.value);
          }}
          value={this.state.value}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className={Styles.InputDropdown__icon}>
          <ChevronFlip pointDown={!this.state.showList} stroke="white" />
        </span>
      </div>
    );
  }
}

InputDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  default: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isMobileSmall: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onKeyPress: PropTypes.func
};

InputDropdown.defaultProps = {
  onKeyPress: null,
  className: null
};

export default InputDropdown;
