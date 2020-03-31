import React, { useState } from 'react';
import classNames from 'classNames';

import { Gear } from 'modules/common/icons';

import Styles from 'modules/app/components/odds-menu.styles';

export const OddsMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={classNames(Styles.OddsMenu, { [Styles.Open]: open })}
      onClick={() => setOpen(!open)}
    >
      {Gear}
    </div>
  );
};
