/* eslint react/no-array-index-key: 0 */ // It's OK in this specific instance as potentially two items have itentical values

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Input from 'modules/common/components/input/input'

import debounce from 'utils/debounce'

export default class InputList extends Component {
  static propTypes = {
    className: PropTypes.string,
    errors: PropTypes.object,
    itemMaxLength: PropTypes.number,
    list: PropTypes.array,
    listMaxElements: PropTypes.number,
    listMinElements: PropTypes.number,
    onChange: PropTypes.func,
    warnings: PropTypes.array,
  }

  constructor(props) {
    super(props)

    this.state = {
      list: this.fillMinElements(this.props.list, this.props.listMinElements),
      warnings: [],
    }

    this.clearWarnings = debounce(this.clearWarnings.bind(this), 3000)
    this.handleChange = this.handleChange.bind(this)
    this.fillMinElements = this.fillMinElements.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { warnings } = this.props
    if (nextProps.warnings && warnings !== nextProps.warnings) {
      this.setState({ warnings: nextProps.warnings })
      this.clearWarnings()
    }
    if (nextProps.list !== this.state.list) {
      this.setState({ list: this.fillMinElements(nextProps.list, nextProps.listMinElements) })
    }
  }

  clearWarnings() {
    this.setState({ warnings: [] })
  }

  handleChange = (i, val) => {
    const newList = (this.state.list || []).slice()

    if ((!val || !val.length) && (!this.props.listMinElements || (i >= this.props.listMinElements - 1))) {
      newList.splice(i, 1)
    } else {
      newList[i] = val
    }

    this.props.onChange(newList)

    this.setState({ list: newList })
  };

  fillMinElements = (list = [], minElements) => {
    let len
    let i
    let newList = list
    if (minElements && list.length < minElements) {
      newList = newList.slice()
      len = minElements - newList.length - 1
      for (i = 0; i < len; i++) {
        newList.push('')
      }
    }
    return newList
  };

  render() {
    const {
      className,
      errors,
      itemMaxLength,
      listMaxElements,
      warnings,
    } = this.props
    const s = this.state
    let { list } = s

    if (!listMaxElements || list.length < listMaxElements) {
      list = list.slice()
      list.push('')
    }

    return (
      <div className={classNames('input-list', className)}>
        {list.map((item, i) => (
          <div
            key={i}
            className={classNames('item', {
              'new-item': i === list.length - 1 && (!item || !item.length),
            })}
          >
            <Input
              type="text"
              maxLength={itemMaxLength}
              value={item}
              onChange={newValue => this.handleChange(i, newValue)}
            />
            <span
              className={classNames({
                'has-errors': errors && errors[i] && errors[i].length,
                'has-warnings': s.warnings && s.warnings[i] && s.warnings[i].length,
              })}
            >
              {errors && errors[i]}
              {warnings && warnings[i]}
            </span>
          </div>
        ))}
      </div>
    )
  }
}
