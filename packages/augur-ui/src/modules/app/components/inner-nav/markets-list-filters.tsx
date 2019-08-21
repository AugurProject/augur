import React from 'react';
import classNames from 'classnames';
import {
  feeFilters,
  spreadFilters,
  invalidFilters,
  MAXFEE_PARAM_NAME,
  SPREAD_PARAM_NAME,
  SHOW_INVALID_MARKETS_PARAM_NAME,
} from 'modules/common/constants';
import Styles from 'modules/app/components/inner-nav/markets-list-filters.styles.less';
import { helpIcon } from 'modules/common/icons';
import { RadioBarGroup } from 'modules/common/form';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import parseQuery from "modules/routes/helpers/parse-query";
import makeQuery from "modules/routes/helpers/make-query";

interface MenuItem {
  label: string;
  value: string;
  description?: string;
}

interface MarketsListFiltersProps {
  isMobile: boolean;
  mobileMenuState: number;
  subMenuScalar: number;
  maxFee: string;
  maxLiquiditySpread: string;
  showInvalid: string;
  menuItems: MenuItem[];
  submenuItems: MenuItem[];
  updateMobileMenuState: Function;
  updateMaxFee: Function;
  updateMaxSpread: Function;
  updateShowInvalid: Function;
  history: History;
  location: Location;
}

interface MarketsListFiltersState {
  feeDefault: string;
  spreadDefault: string;
  showInvalidDefault: string;
}

export default class MarketsListFilters extends React.Component<MarketsListFiltersProps, MarketsListFiltersState> {
  constructor(props) {
    super(props);

    this.state = {
      feeDefault: null,
      spreadDefault: null,
      showInvalidDefault: null,
    };
  }

  componentDidMount() {
    const existingParams = parseQuery(window.location.hash.split("#!/markets")[1]);

    this.setState(
      {
        feeDefault: existingParams.maxFee || this.props.maxFee,
        spreadDefault: existingParams.spread || this.props.maxLiquiditySpread,
        showInvalidDefault: existingParams.showInvalid || this.props.showInvalid,
      },
      () => {
        this.props.updateMaxFee(this.state.feeDefault);
        this.props.updateMaxSpread(this.state.spreadDefault);
        this.props.updateShowInvalid(this.state.showInvalidDefault);
      }
    );
  }

  render() {
    if (!this.state.feeDefault) return null;

    return (
      <div className={Styles.Filters}>
        <span>Filters</span>

        <div className={Styles.Filter}>
          <span>Fees</span>
          {this.generateTooltip('...')}
        </div>

        <RadioBarGroup
          radioButtons={feeFilters}
          defaultSelected={this.state.feeDefault}
          onChange={(value: string) => {
            this.updateQuery(MAXFEE_PARAM_NAME, value, this.props.location);
            this.props.updateMaxFee(value);
          }}
        />

        <div className={Styles.Filter}>
          <span>Liquidity Spread</span>
          {this.generateTooltip('...')}
        </div>

        <RadioBarGroup
          radioButtons={spreadFilters}
          defaultSelected={this.state.spreadDefault}
          onChange={(value: string) => {
            this.updateQuery(SPREAD_PARAM_NAME, value, this.props.location);
            this.props.updateMaxSpread(value);
          }}
        />

        <div className={Styles.Filter}>
          <span>Invalid Markets</span>
          {this.generateTooltip('...')}
        </div>

        <RadioBarGroup
          radioButtons={invalidFilters}
          defaultSelected={this.state.showInvalidDefault}
          onChange={(value: string) => {
            this.updateQuery(SHOW_INVALID_MARKETS_PARAM_NAME, value, this.props.location);
            this.props.updateShowInvalid(value);
          }}
        />
      </div>
    );
  }

  updateQuery(filterType, value, location) {
    const { history } = this.props;
    let updatedSearch = parseQuery(location.search);
    if (value === "") {
      delete updatedSearch[filterType];
    } else {
      updatedSearch[filterType] = value;
    }

    updatedSearch = makeQuery(updatedSearch);

    history.push({
      ...location,
      search: updatedSearch,
    });
  }

  generateTooltip(tipText: string) {
    return (
      <span className={Styles.Filter_TooltipContainer}>
        <label
          className={classNames(
            TooltipStyles.TooltipHint,
            Styles.Filter_TooltipHint
          )}
          data-tip
          data-for="tooltip--confirm"
        >
          {helpIcon}
        </label>
        <ReactTooltip
          id="tooltip--confirm"
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          type="light"
        >
          <p>{tipText}</p>
        </ReactTooltip>
      </span>
    );
  }
}

