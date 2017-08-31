import React from 'react';

import classNames from 'classnames';
import Styles from 'modules/common/components/nav-panel/nav-panel.styles';


const NavPanel = p => (
  <div className={Styles.NavPanel}>
    <aside className={Styles.NavPanel__controls}>
      {p.items && p.items.map((item, ind) => {
        const Icon = item.iconComponent;
        return (
          <button
            className={classNames(
              {
                [Styles.NavPanel__control]: true,
                [Styles['NavPanel__control--active']]: item.active
              })}
            key={`${item.title}${ind - p.items.length}`}
            onClick={item.onClick}
          >
            <Icon className={Styles.NavPanel__icon} />
            {item.title}
          </button>
        );
      })}
    </aside>
    <div className={Styles.NavPanel__content}>
      {p.children}
    </div>
  </div>
);

export default NavPanel;
