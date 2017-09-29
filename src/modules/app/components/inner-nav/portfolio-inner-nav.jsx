import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'

export default class PorfolioInnerNav extends BaseInnerNav {
  getMainMenuData() {
    return [
      {
        label: 'testone',
        visible: true,
        link: {
          pathname: '#'
        }
      },
      {
        label: 'testtwo',
        visible: true,
        link: {
          pathname: '#'
        }
      },
      {
        label: 'testthree',
        visible: true,
        link: {
          pathname: '#'
        }
      }
    ]
  }
}
