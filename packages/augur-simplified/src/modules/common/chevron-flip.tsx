import React from 'react';
import classNames from 'classnames';
import Styles from './chevron-flip.styles.less';
import { Icons } from '@augurproject/augur-comps';

const { ChevronFlipIcon } = Icons;
 
interface ChevronFlipProps {
  pointDown?: boolean;
}

const ChevronFlip = ({ pointDown }: ChevronFlipProps) => (
  <span
    className={classNames(Styles.ChevronFlip, {
      [Styles.pointDown]: pointDown,
    })}
  >
    {ChevronFlipIcon}
  </span>
);

export default ChevronFlip;
