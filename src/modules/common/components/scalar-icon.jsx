import React from 'react'

// NOTE -- To employ, just set the width or height on the containing element and this SVG will respond appropriately
const ScalarIcon = () => (
  <svg viewBox="0 0 400 400">
    <defs>
      <style>
        {'.scalar-line-cls-1 { fill: none; stroke: #000; stroke-miterlimit: 10; stroke-width: 10px; }'}
      </style>
    </defs>
    <g>
      <line className="scalar-line-cls-1" x1="36.36" y1="200" x2="363.64" y2="200" />
      <rect x="36.36" y="132.17" width="9.04" height="135.67" rx="4.52" ry="4.52" />
      <rect x="354.59" y="132.17" width="9.04" height="135.67" rx="4.52" ry="4.52" />
      <circle cx="143.2" cy="200" r="22.61" />
    </g>
  </svg>

)

export default ScalarIcon
