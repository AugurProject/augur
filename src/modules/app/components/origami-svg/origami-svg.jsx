import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/app/components/origami-svg/origami-svg.styles'

const offsetPoint = (point, offsetPoint) => (
  [point[0] + offsetPoint[0], point[1] + offsetPoint[1]]
)

export default class Origami extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    menuScalar: PropTypes.number.isRequired,
  };

  componentWillMount() {
    this.currentRAF = null

    const sidebarWidth = 72
    const topbarHeight = 42
    const mobileTopbarHeight = 24

    this.sidebarWidth = sidebarWidth
    this.topbarHeight = topbarHeight

    // TODO: de-hardcode values, replace w/ CSS properties
    this.plgram = {
      tl: [85 + sidebarWidth, topbarHeight],
      tr: [222 + sidebarWidth, topbarHeight],
      bl: [0 + sidebarWidth, topbarHeight * 2],
      br: [110 + sidebarWidth, topbarHeight * 2],
    }

    this.mobilePlgram = {
      tl: [94, mobileTopbarHeight],
      tr: [200, mobileTopbarHeight],
      bl: [60, mobileTopbarHeight + 20],
      br: [110, mobileTopbarHeight + 20],
    }

    this.xOffsetMax = 110
  }


  getDesktopShapes() {
    const { menuScalar } = this.props
    const mainXOffset = menuScalar * this.xOffsetMax
    const secondaryXOffset = menuScalar * -27
    const applyMainOffset = point => offsetPoint(point, [mainXOffset, 0])
    const applySecondaryOffset = point => offsetPoint(point, [secondaryXOffset, 0])

    // TODO: encode this SVG data more efficiently?
    // it's useful to have points as variables since they'll animate
    const shapes = [
      {
        color: '#412468',
        points: ([
          [this.sidebarWidth, 0],
          [this.sidebarWidth + (85 * 2), 0],
          this.plgram.tl,
          this.plgram.br,
          this.plgram.bl,
        ]),
      },
      {
        color: '#553580',
        points: ([
          [this.sidebarWidth + (85 * 2), 0],
          this.plgram.tl,
          applySecondaryOffset(this.plgram.tr),
          applySecondaryOffset([this.sidebarWidth + (85 * 2) + 130, 0]),
        ]),
      },
      {
        color: '#9592A4',
        points: ([
          this.plgram.tl,
          this.plgram.bl,
          this.plgram.br,
        ]).map(applyMainOffset),
      },
      {
        color: '#C5C3CD',
        points: ([
          this.plgram.tl,
          this.plgram.tr,
          this.plgram.br,
        ]).map(applyMainOffset),
      },
    ]

    if (menuScalar > 0) {
      shapes.push({
        color: '#5A4774',
        points: [
          this.plgram.tl,
          applyMainOffset(this.plgram.bl),
          applyMainOffset(this.plgram.tl),
        ],
      })
    }

    return shapes
  }

  getMobileShapes() {
    const shapes = [
      {
        color: '#412468',
        points: ([
          [0, 0],
          [190, 0],
          this.mobilePlgram.tl,
          this.mobilePlgram.bl,
          [0, 60],
        ]),
      },
      {
        color: '#553580',
        points: ([
          [147, 0],
          this.mobilePlgram.tl,
          this.mobilePlgram.tr,
          [257, 0],
        ]),
      },
      {
        color: '#9592A4',
        points: ([
          this.mobilePlgram.tl,
          this.mobilePlgram.bl,
          this.mobilePlgram.br,
        ]),
      },
      {
        color: '#C5C3CD',
        points: ([
          this.mobilePlgram.tl,
          this.mobilePlgram.tr,
          this.mobilePlgram.br,
        ]),
      },
    ]

    return shapes
  }


  render() {
    const { isMobile } = this.props
    let shapes

    if (isMobile) shapes = this.getMobileShapes()
    else shapes = this.getDesktopShapes()

    const polygons = shapes.map((shape, index) => {
      const pointString = shape.points.map(point => (point[0] + ',' + point[1])).join(' ')
      return (<polygon fill={shape.color} points={pointString} key={`${shape.color}`} />)
    })

    return (<svg className={Styles.Logo}>{polygons}</svg>)
  }
}
