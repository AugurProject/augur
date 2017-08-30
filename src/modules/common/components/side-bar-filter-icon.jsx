import React from 'react'

// NOTE -- This stateless component is a responsive SVG
// To employ, just set the width or height on the containing element and this SVG will respond appropriately
const SideBarFilterIcon = () => (
  <svg
    className="side-bar-filter-icon"
    viewBox="0 0 400 400"
  >
    <g>
      <polygon fill="#FFFFFF" points="323.1,81.4 370.2,28.8 29.8,28.8 77,81.4" />
      <polygon fill="#FFFFFF" points="114.3,122.9 161.5,175.5 238.8,175.5 285.9,122.9" />
      <rect fill="#FFFFFF" x="161.5" y="220.8" width="77.3" height="52.6" />
      <polygon fill="#FFFFFF" points="169.2,318.6 238.8,371.2 238.8,318.6" />
    </g>
  </svg>
)

export default SideBarFilterIcon
