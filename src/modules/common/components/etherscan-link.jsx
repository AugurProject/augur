import React from 'react'
import PropTypes from 'prop-types'

const EtherscanLink = p => (
  <span>
    { p.baseUrl &&
      <a
        href={p.baseUrl + p.txhash}
        target="blank"
      >
        {p.label}
      </a>
    }
    { !p.baseUrl && p.showNonLink &&
      <span>
        {p.label}
      </span>
    }
  </span>
)

EtherscanLink.propTypes = {
  baseUrl: PropTypes.string,
  txhash: PropTypes.string,
  label: PropTypes.string,
  showNonLink: PropTypes.bool,
}

export default EtherscanLink
