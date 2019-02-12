import React from "react";

import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { each, isEqual } from "lodash";
import ReportingHeader from "modules/reporting/containers/reporting-header";
import MarketPreview from "modules/market/containers/market-preview";
import Paginator from "modules/common/components/paginator/paginator";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";

export const ReportSection = ({
  title,
  items,
  totalItemsLength,
  nullMessage,
  paginationName,
  setSegment,
  lower,
  boundedLength,
  history,
  location,
  paginationCount,
  addNullPadding
}) => {
  let theChildren;
  if (items.length === 0) {
    theChildren = (
      <NullStateMessage
        message={nullMessage || "No Markets Available"}
        key={title}
        addNullPadding={addNullPadding}
      />
    );
  } else {
    const itemLength = boundedLength + (lower - 1);
    const newItems = items.slice(lower - 1, itemLength);

    theChildren = newItems.map(item => (
      <MarketPreview key={item.id} {...item} />
    ));
  }

  return (
    <article>
      <MarketsHeaderLabel title={title} />
      <article>
        <section>{theChildren}</section>
        {totalItemsLength > paginationCount && (
          <Paginator
            itemsLength={totalItemsLength}
            itemsPerPage={paginationCount}
            location={location}
            history={history}
            setSegment={setSegment}
            pageParam={paginationName}
          />
        )}
      </article>
    </article>
  );
};

ReportSection.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  paginationName: PropTypes.string.isRequired,
  paginationCount: PropTypes.number.isRequired,
  totalItemsLength: PropTypes.number.isRequired,
  nullMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setSegment: PropTypes.func.isRequired,
  lower: PropTypes.number.isRequired,
  boundedLength: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  addNullPadding: PropTypes.bool
};

ReportSection.defaultProps = {
  items: [],
  addNullPadding: false
};

class ReportingReporting extends React.Component {
  constructor(props) {
    super(props);

    const PAGINATION_LENGTH = 10;
    const paginations = {
      designated: {
        lower: 1,
        boundedLength: PAGINATION_LENGTH
      },
      open: {
        lower: 1,
        boundedLength: PAGINATION_LENGTH
      },
      upcoming: {
        lower: 1,
        boundedLength: PAGINATION_LENGTH
      }
    };

    this.state = {
      paginations,
      PAGINATION_LENGTH
    };

    this.setDrSegment = this.setDrSegment.bind(this);
    this.setOrSegment = this.setOrSegment.bind(this);
    this.setUrSegment = this.setUrSegment.bind(this);
  }

  componentDidMount() {
    const { loadReporting, universe } = this.props;
    if (universe) loadReporting(null);
  }

  componentWillReceiveProps(nextProps) {
    const { universe, loadReporting, loadMarketsInfo, marketIds } = this.props;
    const { paginations } = this.state;
    if (nextProps.universe !== universe && nextProps.universe) {
      loadReporting();
    }
    if (!isEqual(nextProps.marketIds, marketIds)) {
      // need to load first 10 of each market type
      let initMarketIds = [];
      each(Object.keys(paginations), key => {
        const { lower, boundedLength } = paginations[key];
        const keyMarketIds = nextProps.marketIds[key];
        const marketIdLength = boundedLength + (lower - 1);
        const newMarketIdArray = keyMarketIds.slice(lower - 1, marketIdLength);
        initMarketIds = [...initMarketIds, ...newMarketIdArray];
      });
      loadMarketsInfo(initMarketIds);
    }
  }

  setDrSegment(lower, upperBound, boundedLength) {
    this.keyedSetSegment(lower, upperBound, boundedLength, "designated");
  }

  setOrSegment(lower, upperBound, boundedLength) {
    this.keyedSetSegment(lower, upperBound, boundedLength, "open");
  }

  setUrSegment(lower, upperBound, boundedLength) {
    this.keyedSetSegment(lower, upperBound, boundedLength, "upcoming");
  }

  keyedSetSegment(lower, upperBound, boundedLength, key) {
    const { marketIds, loadMarketsInfo } = this.props;
    const { paginations } = this.state;
    paginations[key] = { lower, boundedLength };
    const keyMarketIds = marketIds[key];
    const marketIdLength = boundedLength + (lower - 1);
    const newMarketIdArray = keyMarketIds.slice(lower - 1, marketIdLength);
    loadMarketsInfo(newMarketIdArray);
    this.setState(paginations);
  }

  render() {
    const { history, location, markets, marketIds } = this.props;
    const { designated, open, upcoming } = markets;
    const { paginations, PAGINATION_LENGTH } = this.state;

    return (
      <section>
        <Helmet>
          <title>Reporting: Markets</title>
        </Helmet>
        <ReportingHeader heading="Markets" />
        <ReportSection
          location={location}
          history={history}
          paginationCount={PAGINATION_LENGTH}
          totalItemsLength={marketIds.designated.length}
          title="Designated Reporting"
          items={designated}
          nullMessage="There are no markets available for you to report on. "
          paginationName="designatereporting"
          lower={paginations.designated.lower}
          boundedLength={paginations.designated.boundedLength}
          setSegment={this.setDrSegment}
        />
        <ReportSection
          location={location}
          history={history}
          paginationCount={PAGINATION_LENGTH}
          totalItemsLength={marketIds.open.length}
          title="Open Reporting"
          items={open}
          nullMessage="There are no markets in Open Reporting."
          paginationName="openreporting"
          lower={paginations.open.lower}
          boundedLength={paginations.open.boundedLength}
          setSegment={this.setOrSegment}
        />
        <ReportSection
          location={location}
          history={history}
          paginationCount={PAGINATION_LENGTH}
          totalItemsLength={marketIds.upcoming.length}
          title="Upcoming Reporting"
          items={upcoming}
          buttonText="View"
          nullMessage="There are no upcoming markets for you to report on."
          paginationName="upcomingreporting"
          lower={paginations.upcoming.lower}
          boundedLength={paginations.upcoming.boundedLength}
          setSegment={this.setUrSegment}
          addNullPadding
        />
      </section>
    );
  }
}

ReportingReporting.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  marketIds: PropTypes.object.isRequired,
  markets: PropTypes.object.isRequired,
  loadReporting: PropTypes.func.isRequired,
  loadMarketsInfo: PropTypes.func.isRequired,
  universe: PropTypes.string
};

ReportingReporting.defaultProps = {
  universe: null
};

export default ReportingReporting;
