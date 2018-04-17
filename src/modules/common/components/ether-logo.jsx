import React from 'react'

// NOTE -- To employ, just set the width or height on the containing element and this SVG will respond appropriately
const EtherLogo = () => (
  <svg
    className="ether-logo logo"
    viewBox="0 0 1269 1269"
  >
    <defs>
      <style>
        {`
          .ether-logo-cls-1 {
            fill: #8a94b0;
          }

          .ether-logo-cls-2, .ether-logo-cls-3 {
            fill: #616b8d;
          }

          .ether-logo-cls-3 {
            opacity: 0.8;
            isolation: isolate;
          }

          .ether-logo-cls-4 {
            fill: #434e73;
          }
        `}
      </style>
    </defs>
    <polygon className="ether-logo-cls-1" points="634.4 0 238.4 657 634.4 477 634.4 0" />
    <polygon className="ether-logo-cls-2" points="634.4 477 238.4 657 634.4 891 634.4 477" />
    <polygon className="ether-logo-cls-2" points="1030.4 657 634.4 0 634.4 477 1030.4 657" />
    <polygon className="ether-logo-cls-1" points="238.4 711 634.4 1269 634.4 945 238.4 711" />
    <polygon className="ether-logo-cls-3" points="634.4 945 634.4 1269 1030.6 711 634.4 945" />
    <polygon className="ether-logo-cls-4" points="634.4 891 1030.4 657 634.4 477 634.4 891" />
  </svg>
)

export default EtherLogo
