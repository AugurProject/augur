import React, { Component } from 'react';

class SideBar extends Component {
  constructor() {
    super();

    this.currentRAF = null;

    const sidebarWidth = 72;
    const topbarHeight = 42;
    this.sidebarWidth = sidebarWidth;
    this.topbarHeight = topbarHeight

    this.plgram = {
      tl: [85 + sidebarWidth, 0],
      tr: [222 + sidebarWidth, 0],
      bl: [0 + sidebarWidth, topbarHeight],
      br: [110 + sidebarWidth, topbarHeight]
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
    const shapes = [
      {
        color: "#412468",
        points: ([
          [this.sidebarWidth, 0],
          this.plgram['tl'],
          this.plgram['br'],
          this.plgram['bl']
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

  render() {
    return (
      <div onClick={this.props.onClick} className='sidebar'>
        <svg id='paralellogo'>
          {this.renderParalellogram()}
        </svg>
      </div>
    );
  }
}

export default SideBar;
