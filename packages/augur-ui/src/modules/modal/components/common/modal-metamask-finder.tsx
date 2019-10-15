import React from 'react';

import { DirectionArrow } from 'modules/common/icons';
import Styles from 'modules/modal/components/common/common.styles.less';

interface ModalMetaMaskFinderProps {
  handleClick: Function;
}

const ModalMetaMaskFinder = ({ handleClick }: ModalMetaMaskFinderProps) => (
  <article onClick={() => handleClick()} className={Styles.ModalMetaMaskFinder}>
    <div>
      <img src="images/metamask-help.png" />
    </div>
    <div>Click the Metamask logo to open your wallet</div>
    <div>{DirectionArrow}</div>
  </article>
);

export default ModalMetaMaskFinder;
