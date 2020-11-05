import React from 'react';
import { Compact, Classic, Expanded } from 'modules/common/icons';
import { MARKET_CARD_FORMATS } from 'modules/common/constants';
import classNames from 'classnames';
// @ts-ignore
import Styles from 'modules/filter-sort/market-card-format-switcher.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const MarketCardFormatSwitcher = () => {
  const { marketsList: { marketCardFormat }, actions: { updateMarketsList } } = useAppStatusStore();

  const ViewSwitcher = ({ handleClick, type, selected = false }) => (
    <span
      className={classNames(Styles.ViewSwitcher, {
        [Styles.selected]: selected,
      })}
      onClick={handleClick}
    >
      {type}
    </span>
  );

  return (
    <div className={Styles.MarketCardFormats}>
      <div>
        VIEW
      </div>
      <ViewSwitcher
        handleClick={() => 
          updateMarketsList({ marketCardFormat: MARKET_CARD_FORMATS.COMPACT })
        }
        type={Compact}
        selected={marketCardFormat === MARKET_CARD_FORMATS.COMPACT}
      />
      <ViewSwitcher
        handleClick={() => 
          updateMarketsList({ marketCardFormat: MARKET_CARD_FORMATS.CLASSIC })
        }
        type={Classic}
        selected={marketCardFormat === MARKET_CARD_FORMATS.CLASSIC}
      />
      <ViewSwitcher
        handleClick={() => 
          updateMarketsList({ marketCardFormat: MARKET_CARD_FORMATS.EXPANDED })
        }
        type={Expanded}
        selected={marketCardFormat === MARKET_CARD_FORMATS.EXPANDED}
      />
    </div>
  );
};

export default MarketCardFormatSwitcher;
