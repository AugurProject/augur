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
import parseQuery from 'modules/routes/helpers/parse-query';
import updateQuery from 'modules/routes/helpers/update-query';

interface MarketsListFiltersProps {
  maxFee: string;
  maxLiquiditySpread: string;
  showInvalid: string;
  isSearching: boolean;
  updateMaxFee: Function;
  updateMaxSpread: Function;
  updateShowInvalid: Function;
  history: History;
  location: Location;
}

interface MarketsListFiltersState {
  selectedFee: string;
  selectedSpread: string;
  showInvalidDefault: string;
}

export default class MarketsListFilters extends React.Component<
  MarketsListFiltersProps,
  MarketsListFiltersState
> {
  constructor(props) {
    super(props);

    this.state = {
      selectedFee: null,
      selectedSpread: null,
      showInvalidDefault: null,
    };
  }

  componentDidMount() {
    const filterOptions = parseQuery(this.props.location.search);
    this.setState(
      {
        selectedFee: filterOptions.maxFee || this.props.maxFee,
        selectedSpread: filterOptions.spread || this.props.maxLiquiditySpread,
        showInvalidDefault:
          filterOptions.showInvalid || this.props.showInvalid,
      },
      () => {
        this.props.updateMaxFee(this.state.selectedFee);
        this.props.updateMaxSpread(this.state.selectedSpread);
        this.props.updateShowInvalid(this.state.showInvalidDefault);
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      const filterOptions = parseQuery(nextProps.location.search);
      this.setState({
        selectedFee:  filterOptions.maxFee ? filterOptions.maxFee : this.state.selectedFee,
        selectedSpread: filterOptions.spread ? filterOptions.spread : this.state.selectedSpread,
      });
    }
  }

  render() {
    if (!this.state.selectedFee) return null;

    return (
      <div className={Styles.Filters}>
        <div className={classNames(Styles.FiltersGroup, {
          [Styles.Searching]: this.props.isSearching,
        })}>
          <div>Filters</div>

          <div className={Styles.Filter}>
            <span>Fees</span>
            {this.generateTooltip('...')}
          </div>

          <RadioBarGroup
            radioButtons={feeFilters}
            defaultSelected={this.state.selectedFee}
            onChange={(value: string) => {
              updateQuery(MAXFEE_PARAM_NAME, value, this.props.location, this.props.history);
              this.props.updateMaxFee(value);
            }}
          />

          <div className={Styles.Filter}>
            <span>Liquidity Spread</span>
            {this.generateTooltip('...')}
          </div>

          <RadioBarGroup
            radioButtons={spreadFilters}
            defaultSelected={this.state.selectedSpread}
            onChange={(value: string) => {
              updateQuery(SPREAD_PARAM_NAME, value, this.props.location, this.props.history);
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
              updateQuery(
                SHOW_INVALID_MARKETS_PARAM_NAME,
                value,
                this.props.location,
                this.props.history
              );
              this.props.updateShowInvalid(value);
            }}
          />
        </div>
      </div>
    );
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
          data-for='tooltip--confirm'
        >
          {helpIcon}
        </label>
        <ReactTooltip
          id='tooltip--confirm'
          className={TooltipStyles.Tooltip}
          effect='solid'
          place='top'
          type='light'
        >
          <p>{tipText}</p>
        </ReactTooltip>
      </span>
    );
  }
}
