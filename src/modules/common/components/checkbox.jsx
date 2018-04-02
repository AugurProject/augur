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
    const {
      text,
      title,
    } = this.props
    if (this.labelText) {
      if (this.labelText.offsetWidth < this.labelText.scrollWidth) {
        this.setState({
          // isLabelTruncated: true,
          dataTip: title || text,
        })
      } else {
        this.setState({
          // isLabelTruncated: false,
          dataTip: title || '',
        })
      }
    }
  }

  render() {
    const {
      className,
      isChecked,
      onClick,
      tabIndex,
      text,
      text2,
    } = this.props
    // console.log('p -- ', p);

    return (
      <article className="checkbox-container">
        <button
          className={classnames('checkbox unstyled', className, { checked: isChecked })}
          type="button"
          onClick={onClick}
          data-tip={this.state.dataTip}
          data-place="right"
        >
          <span className="checkbox-box">
            {isChecked &&
              <i className="fa fa-check" />
            }
          </span>
          <span className="checkbox-label" tabIndex={tabIndex} ref={(label) => { this.labelText = label }}>
            {text}
          </span>
          {text2 != null &&
          <span className="checkbox-label2">
            {text2}
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
