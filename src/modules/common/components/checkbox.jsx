import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import debounce from 'utils/debounce'

export default class Checkbox extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    text2: PropTypes.string,
    isChecked: PropTypes.bool,
    labelTruncated: PropTypes.bool,
    tabIndex: PropTypes.number,
    onClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      // isLabelTruncated: false,
      dataTip: this.props.title || this.props.text,
    }
    this.isLabelTruncated = debounce(this.isLabelTruncated.bind(this), 100)
  }

  componentDidMount() {
    this.isLabelTruncated()
    window.addEventListener('resize', this.isLabelTruncated)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.isLabelTruncated)
  }

  isLabelTruncated() {
    if (this.labelText) {
      if (this.labelText.offsetWidth < this.labelText.scrollWidth) {
        this.setState({
          // isLabelTruncated: true,
          dataTip: this.props.title || this.props.text,
        })
      } else {
        this.setState({
          // isLabelTruncated: false,
          dataTip: this.props.title || '',
        })
      }
    }
  }

  render() {
    const p = this.props

    // console.log('p -- ', p);

    return (
      <article className="checkbox-container">
        <button
          className={classnames('checkbox unstyled', p.className, { checked: p.isChecked })}
          type="button"
          onClick={p.onClick}
          data-tip={this.state.dataTip}
          data-place="right"
        >
          <span className="checkbox-box">
            {p.isChecked &&
              <i className="fa fa-check" />
            }
          </span>
          <span className="checkbox-label" tabIndex={p.tabIndex} ref={(label) => { this.labelText = label }}>
            {p.text}
          </span>
          {p.text2 != null &&
          <span className="checkbox-label2">
            {p.text2}
          </span>
          }
        </button>
      </article>
    )
  }

}

Checkbox.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  text2: PropTypes.string,
  isChecked: PropTypes.bool,
  tabIndex: PropTypes.number,
  onClick: PropTypes.func,
}
