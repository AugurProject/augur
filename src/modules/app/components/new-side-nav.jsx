import React, { Component } from 'react';

class SideBar extends Component {
  constructor() {
    super();

    this.currentRAF = null;

    const sidebarWidth = 72;
    const topbarHeight = 42;
    this.sidebarWidth = sidebarWidth;
    this.topbarHeight = topbarHeight

    // TODO: de-hardcode values, replace w/ CSS properties
    this.plgram = {
      tl: [85 + sidebarWidth, topbarHeight],
      tr: [222 + sidebarWidth, topbarHeight],
      bl: [0 + sidebarWidth, topbarHeight * 2],
      br: [110 + sidebarWidth, topbarHeight * 2]
    };

    this.xOffsetMax = 110;
  }

  pointsToString(points) {
    return points.map((point) => (point[0]  + ',' + point[1])).join(' ');
  }

  offsetPoint(point) {
    const currentXOffset = this.props.menuScalar * this.xOffsetMax;
    return [point[0] + currentXOffset, point[1]];
  }

  renderParalellogram() {
    const boundOffset = (point) => this.offsetPoint(point);
    // TODO: encode this SVG data more efficiently?
    // it's useful to have points as variables since they'll animate
    const shapes = [
      {
        color: "#412468",
        points: ([
          [this.sidebarWidth, 0],
          [this.sidebarWidth + (85 * 2), 0],
          this.plgram['tl'],
          this.plgram['br'],
          this.plgram['bl']
        ])
      },
      {
        color: '#553580',
        points: ([
          [this.sidebarWidth + (85 * 2), 0],
          this.plgram['tl'],
          this.plgram['tr'],
          [this.sidebarWidth + (85 * 2) + 130, 0],
        ])
      },
      {
        color: "#9592A4",
        points: ([
          this.plgram['tl'],
          this.plgram['bl'],
          this.plgram['br']
        ]).map(boundOffset)
      },
      {
        color: "#C5C3CD",
        points: ([
          this.plgram['tl'],
          this.plgram['tr'],
          this.plgram['br']
        ]).map(boundOffset)
      }
    ];

    if (this.props.menuScalar > 0) {
      shapes.push({
        color: "#5A4774",
        points: [
          this.plgram['tl'],
          boundOffset(this.plgram['bl']),
          boundOffset(this.plgram['tl']),
        ]
      });
    }

    return shapes.map((shape) => {
      const pointString = this.pointsToString(shape.points);
      return (<polygon fill={shape.color} points={pointString} />);
    });
  }

  renderSidebarMenu() {
    return (
      <ul className='sidebar-menu'>
        {this.props.menuData.map((item) => (
          <li onClick={item.onClick}>
            <span class='item-title'>{item.title}</span>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className='sidebar'>
        <svg id='paralellogo'>
          {this.renderParalellogram()}
        </svg>
        {this.renderSidebarMenu()}
      </div>
    );
  }
}

export default SideBar;
