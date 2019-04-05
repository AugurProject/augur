import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.styles";
import { Info } from "modules/common/components/icons";
import Styles from "modules/create-market/components/create-market-form-define/create-market-form-define.styles";

export const MarketCreationTimeDisplay = ({ simple, endTime }) => (
  <div className={Styles.CreateMarketDefine_time_display}>
    <div
      className={classNames({
        [Styles.simple]: simple
      })}
    >
      {simple ? "Reporting start time" : "Official reporting start time"}
    </div>
    <span>
      <div>{endTime.formattedUtc}</div>
      {endTime.formattedUtc && (
        <div>
          <label
            className={classNames(
              TooltipStyles.TooltipHint,
              Styles.CreateMarketDefine_time_display_tooltip
            )}
            data-tip
            data-for="tooltip--market-fees"
          >
            {Info}
          </label>
          <ReactTooltip
            id="tooltip--market-fees"
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
          >
            <p>
              Augur uses UTC standard date time. Users will see UTC when trading
              or reporting on your market.
            </p>
          </ReactTooltip>
        </div>
      )}
    </span>
    <span>{endTime.formattedTimezone}</span>
  </div>
);

MarketCreationTimeDisplay.propTypes = {
  endTime: PropTypes.object.isRequired,
  simple: PropTypes.bool
};

MarketCreationTimeDisplay.defaultProps = {
  simple: false
};
