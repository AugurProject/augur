import React, { Component } from 'react';

import P5 from 'p5';
import debounce from 'utils/debounce';

const pythagoreanDistance = (pointA, pointB) => (
  Math.sqrt(((pointA.x - pointB.x) ** 2) + ((pointA.y - pointB.y) ** 2))
);

const withinRange = (val, rangeA, rangeB) => (
  (val > rangeA && val < rangeB)
);

const detectWebGL= () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl')
    || canvas.getContext('experimental-webgl');

  return gl;
};

export default class GraphBG extends Component {

  componentDidMount() {
    this.hasWebGL = detectWebGL();
    this.p5Renderer = new P5(p => this.sketch(p), this.refs.canvascontainer);
  }

  shouldComponentUpdate() {
    return false;
  }

  setupScreen(p, width, height) {
    this.idealScreen = 1440;
    this.screenScale = Math.max(width, height) / this.idealScreen;
    this.screenMid = {
      x: width / 2,
      y: height / 2
    };

    p.resizeCanvas(width, height, true);

    if (this.hasWebGL) {
      p.perspective(); // forces P5 to acknowledge next ortho() call
      const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
      p.ortho(-width / pixelRatio,
              width / pixelRatio,
              height / pixelRatio,
              -height / pixelRatio, -1, 10000);
    }
  }

  setupScene() {
    this.circles = [];
    this.lines = [];

    for (let i = 0; i < this.circleCount; i++) {
      const angle = Math.random() * 360;
      const rads = angle * (Math.PI / 180);
      const distScalar = 1 - ((i / this.circleCount) ** 2.2);
      const dist = distScalar * Math.min(this.screenMid.x, this.screenMid.y);
      const origin = {
        x: (Math.cos(rads) * dist),
        y: (Math.sin(rads) * dist)
      };
      if (!this.hasWebGL) {
        origin.x += this.screenMid.x;
        origin.y += this.screenMid.y;
      }
      this.circles.push({ origin, x: origin.x, y: origin.y, distScalar, angle, links: 0 });
    }

    this.circles.forEach((circleA, ai) => {
      this.circles.forEach((circleB, bi) => {
        if (circleA === circleB) return;
        const linekey = [ai, bi].sort().join('_');
        if (this.lines[linekey]) return;

        const pDist = pythagoreanDistance(circleA.origin, circleB.origin);
        const centerDist = Math.abs(circleA.distScalar - circleB.distScalar);

        const localLink = pDist < (110 * this.screenScale);
        const minCenterDist = 0;
        const maxCenterDist = 0.35;
        const angleRange = 15;
        const tierLink = withinRange(centerDist,
                                     minCenterDist,
                                     maxCenterDist);
        const angLink = withinRange(circleA.angle,
                                    (circleB.angle - angleRange) % 360,
                                    (circleB.angle + angleRange) % 360);

        if (localLink || (tierLink && angLink)) {
          const linekey = [ai, bi].sort().join('_');
          this.lines[linekey] = { circleIndices: [ai, bi] };
          this.circles[ai].links += 1;
          this.circles[bi].links += 1;
        }
      });
    });
  }

  readjustScene() {
    this.circles.forEach((circle) => {
      const rads = circle.angle * (Math.PI / 180);
      const dist = circle.distScalar * Math.min(this.screenMid.x, this.screenMid.y);
      circle.origin.x = (Math.cos(rads) * dist);
      circle.origin.y = (Math.sin(rads) * dist);

      if (!this.hasWebGL) {
        circle.origin.x += this.screenMid.x;
        circle.origin.y += this.screenMid.y;
      }
    });
  }

  drawScene(p) {
    p.background(35, 26, 58);
    const scaledTime = p.millis() / 2500;

    p.fill(83, 76, 101);
    this.circles.forEach((circle) => {
      const { x, y } = circle.origin;
      const wobX = Math.sin(scaledTime + x) * 10;
      const wobY = Math.cos(scaledTime + y) * 10;
      circle.x = x + wobX;
      circle.y = y + wobY;

      const circleSize = (this.dotSize + (circle.links * 0.8));
      if (this.hasWebGL) {
        p.push();
        p.translate(circle.x, circle.y, 0);
        p.sphere(circleSize, 4, 5);
        p.pop();
      } else {
        p.ellipse(circle.x, circle.y, circleSize);
      }
    });

    Object.keys(this.lines).forEach((linekey) => {
      const line = this.lines[linekey];
      const circleA = this.circles[line.circleIndices[0]];
      const circleB = this.circles[line.circleIndices[1]];
      if (this.hasWebGL) {
        // TODO: figure out why p5 line() function not working
        // with hardware-accel graphics
        p.push();
        p.beginShape(P5.prototype.LINES);
        p.translate(circleA.x, circleA.y, 0);
        p.vertex(0, 0, 0);
        p.vertex((circleB.x - circleA.x),
                 (circleB.y - circleA.y),
                 0);
        p.fill(83, 76, 101); // prevent P5 spamming shader uniform warnings
        p.stroke(83, 76, 101);
        p.endShape();
        p.pop();
      } else {
        p.line(circleA.x, circleA.y, circleB.x, circleB.y);
      }
    });
  }


  handleWindowResize(p) {
    const { offsetWidth, offsetHeight } = this.refs.canvascontainer;
    const width = offsetWidth;
    const height = offsetHeight;

    this.setupScreen(p, width, height);
    this.readjustScene();
    if (!this.hasWebGL) this.drawScene(p);
  }

  sketch(p) {
    p.setup = () => {
      const { offsetWidth, offsetHeight } = this.refs.canvascontainer;
      const width = offsetWidth;
      const height = offsetHeight;

      if (this.hasWebGL) {
        p.createCanvas(width, height, P5.prototype.WEBGL);
      } else {
        p.createCanvas(width, height);
      }
      this.setupScreen(p, width, height);

      this.circles = [];
      this.lines = [];
      this.circleCount = 100;
      this.dotSize = 3;

      this.setupScene();

      if (!this.hasWebGL) {
        p.noLoop();
        this.drawScene(p);
      }

      window.addEventListener('resize', debounce(() => this.handleWindowResize(p), 50));
    };

    if (this.hasWebGL) {
      p.draw = () => this.drawScene(p);
    }
  }

  render() {
    return (
      <div ref="canvascontainer" id="canvas_container" />
    );
  }
}
