import React from 'react';

// NOTE -- To employ, just set the width or height on the containing element and this SVG will respond appropriately
const ScalarIcon = () => (
  <svg
    className="scalar-icon"
    viewBox="0 0 361.85 150"
  >
    <defs>
      <style>
        {'.scalar-icon-line { fill: none; stroke: #000; stroke-miterlimit: 10; stroke-width: 10px; }'}
      </style>
    </defs>
    <g>
      <line className="scalar-icon-line" y1="75" x2="361.85" y2="75" />
      <rect width="10" height="150" rx="5" ry="5" />
      <rect x="351.85" width="10" height="150" rx="5" ry="5" />
      <circle cx="118.13" cy="75" r="25" />
      <circle cx="90.13" cy="80.06" />
    </g>
  </svg>
);

export default ScalarIcon;
