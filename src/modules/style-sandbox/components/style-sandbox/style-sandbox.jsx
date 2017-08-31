import React from 'react';

import Styles from 'modules/style-sandbox/components/style-sandbox/style-sandbox.styles';

import NavPanel from 'modules/common/components/nav-panel/nav-panel';
import AccIcon from 'modules/common/components/nav-account-icon';

const StyleSandbox = (p) => {
  const navPanelProps = {
    flipNav: true,
    items: [
      { title: 'hello1', iconComponent: AccIcon, onClick: () => alert('one click') },
      { title: 'hello2', iconComponent: AccIcon, active: true },
      { title: 'hello3', iconComponent: AccIcon },
      { title: 'hello4', iconComponent: AccIcon },
      { title: 'hello5', iconComponent: AccIcon },
      { title: 'hello6', iconComponent: AccIcon }
    ]
  };

  return (
    <div className={Styles.StyleSandbox}>
      <div className={Styles['StyleSandbox__nav-panel-wrap']}>
        <NavPanel {...navPanelProps}>
          Placeholder - content will come when appropriate component is available
        </NavPanel>
      </div>
    </div>
  );
};

export default StyleSandbox;
