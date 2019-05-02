import React from "react";

import Styles from "modules/common/components/dashline/dashline.styles";

export const DashlineNormal = () => (
  <svg width="100%" height="1">
    <line x1="0" x2="100%" y1="0" y2="0" className={Styles.Dashline__normal} />
  </svg>
);

export const DashlineLong = () => (
  <svg width="100%" height="1">
    <line x1="0" x2="100%" y1="0" y2="0" className={Styles.Dashline__long} />
  </svg>
);
