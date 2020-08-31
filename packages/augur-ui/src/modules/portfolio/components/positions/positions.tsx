import React, { useState } from "react";

import memoize from "memoizee";
import FilterBox from 'modules/portfolio/components/common/filter-box';
import { CompactButton } from "modules/common/buttons";
import { MovementLabel, ValueLabel } from "modules/common/labels";
import { PositionsTable } from "modules/portfolio/components/common/market-positions-table";
import { END_TIME } from "modules/common/constants";
import getLoginAccountPositions from "modules/positions/selectors/login-account-positions";
import getMarketsPositionsRecentlyTraded from "modules/portfolio/selectors/select-markets-positions-recently-traded";

import Styles from "modules/portfolio/components/common/quad.styles.less";
import { MarketData, SizeTypes } from "modules/types";
import NewFilterBox from 'modules/portfolio/components/common/new-filter-box';

const sortByOptions = [
  {
    label: "Most Recently Traded",
    value: "recentlyTraded",
    comp(marketA, marketB) {
      return (
        marketB.recentlyTraded.timestamp - marketA.recentlyTraded.timestamp
      );
    }
  },
  {
    label: "Current Value",
    value: "currentValue",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.currentValue.formatted -
        marketA.myPositionsSummary.currentValue.formatted
      );
    }
  },
  {
    label: "Total Returns",
    value: "totalReturns",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.totalReturns.formatted -
        marketA.myPositionsSummary.totalReturns.formatted
      );
    }
  },
  {
    label: "Expiring Soonest",
    value: END_TIME,
    comp(marketA, marketB) {
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    }
  }
];

function filterComp(input, market) {
  if (!market) return false;
  return market.description ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;
}

function renderToggleContent(market) {
  return <PositionsTable market={market} />;
}

interface PositionsProps {
  markets: MarketData[];
  toggle: Function;
  hide: boolean;
  extend: boolean;
}

const getPositionsMarkets = memoize(
  (marketsPositionsRecentlyTraded, positions) =>
    Array.from(new Set([...positions.markets])).map((m) => ({
      ...m,
      recentlyTraded: marketsPositionsRecentlyTraded[m.id],
    })),
  { max: 1 },
);

const Positions = ({
  toggle,
  hide,
  extend,
}: PositionsProps) => {
  const [showCurrentValue, setCurrentValue] = useState(false);
  const positions = getLoginAccountPositions();
  const timestamps = getMarketsPositionsRecentlyTraded();
  const markets = getPositionsMarkets(timestamps, positions);

  function updateRightContentValue() {
    setCurrentValue(!showCurrentValue);
  }

  function renderRightContent(market) {
    const { currentValue, totalReturns } = market.myPositionsSummary;
    return showCurrentValue ? (
      <ValueLabel value={currentValue} useFull />
    ) : (
        <div className={Styles.Column}>

          <ValueLabel value={totalReturns} useFull />
          <MovementLabel
            showPlusMinus
            showBrackets
            size={SizeTypes.SMALL}
            value={market.myPositionsSummary && market.myPositionsSummary.totalPercent}
            useFull
          />
        </div>
      );
  }

    return (
      <NewFilterBox
        title="Positions"
        sortByOptions={sortByOptions}
        markets={markets}
        filterComp={filterComp}
        toggle={toggle}
        hide={hide}
        extend={extend}
        subheader={
          <CompactButton
            text={showCurrentValue ? "Current Value" : "Total Returns"}
            action={updateRightContentValue}
          />
        }
        renderRightContent={renderRightContent}
        renderToggleContent={renderToggleContent}
        filterLabel="positions"
        pickVariables={[
            "id",
          "description",
          "reportingState",
          "myPositionsSummary",
          "recentlyTraded",
          "endTime",
      ]}
      />
    );
};

export default Positions;


