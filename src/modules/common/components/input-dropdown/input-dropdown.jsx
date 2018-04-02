import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/common/components/input-dropdown/input-dropdown.styles'

class InputDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      label: props.default || props.label,
      value: props.default || '',
      showList: false,
      selected: !!props.default,
    }

    this.dropdownSelect = this.dropdownSelect.bind(this)
    this.toggleList = this.toggleList.bind(this)
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowOnClick)

    if (this.props.isMobileSmall && this.state.value === '') {
      this.dropdownSelect(this.props.options[0])
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowOnClick)
  }

  dropdownSelect(value) {
    if (value !== this.state.value) {
      this.setState({
        label: value,
        value,
        selected: true,
      })
      this.props.onChange(value)
      this.toggleList()
    }
  }

  toggleList() {
    this.setState({ showList: !this.state.showList })
  }

  handleWindowOnClick(event) {
    if (this.refInputDropdown && !this.refInputDropdown.contains(event.target)) {
      this.setState({ showList: false })
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <div
        ref={(InputDropdown) => { this.refInputDropdown = InputDropdown }}
        className={classNames(Styles.InputDropdown, (p.className || ''))}
        onClick={this.toggleList}
        role="listbox"
        tabIndex="-1"
      >
        <span
          key={p.label}
          className={classNames(Styles.InputDropdown__label, { [`${Styles.selected}`]: s.selected })}
        >
          {this.state.label}
        </span>
        <div className={classNames(Styles.InputDropdown__list, { [`${Styles.active}`]: this.state.showList })}>
          {p.options.map(option => (
            <button
              className={classNames({ [`${Styles.active}`]: option === this.state.value })}
              key={option + p.label}
              value={option}
              onClick={() => this.dropdownSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <select
          className={classNames(Styles.InputDropdown__select, { [`${Styles.selected}`]: s.selected })}
          onChange={(e) => { this.dropdownSelect(e.target.value) }}
          value={this.state.value}
        >
          {p.options.map(option => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
        <i className={classNames(Styles.InputDropdown__icon, 'fa', { 'fa-angle-down': !this.state.showList, 'fa-angle-up': this.state.showList })} />
      </div>
    )
  }
}

InputDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  default: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isMobileSmall: PropTypes.bool.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
}

export default InputDropdown
