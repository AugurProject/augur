import React, { useState } from 'react';
import classNames from 'classNames';

import { Gear, CheckMark } from 'modules/common/icons';

import Styles from 'modules/app/components/odds-menu.styles';

export const OddsMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={classNames(Styles.OddsMenu, { [Styles.Open]: open })}
    >
      <button onClick={() => setOpen(!open)}>{Gear}</button>
      <ul>
        <li><h4>Odds Settings</h4></li>
        <li className={Styles.Selected}><button onClick={() => null}>Decimal {CheckMark}</button></li>
        <li><button onClick={() => null}>Fractional {CheckMark}</button></li>
        <li><button onClick={() => null}>American {CheckMark}</button></li>
        <li><button onClick={() => null}>0% - 100% {CheckMark}</button></li>
      </ul>
    </div>
  );
};
