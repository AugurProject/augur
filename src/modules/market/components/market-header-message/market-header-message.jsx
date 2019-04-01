import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { SmallClose, Info } from "modules/common/components/icons";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip.styles";
import Styles from "modules/market/components/market-header-message/market-header-message.styles";

const MarketHeaderMessage = ({ marketId, dismiss, show, loggedIn }) => (
  <>
    {show && (
      <div className={Styles.MarketHeaderMessage}>
        <div style={{ display: "inline-block" }}>
          <span className={Styles.MarketHeaderMessage__bolding}>
            Always make sure that the{" "}
            <span className={Styles.bolden}>title</span>,{" "}
            <span className={Styles.bolden}>details</span>,{" "}
            <span className={Styles.bolden}>reporting start time</span>,{" "}
            <span className={Styles.bolden}>resolution source</span> and{" "}
            <span className={Styles.bolden}>outcomes</span> are not in direct
            conflict with each other{" "}
            <span
              className={classNames(
                TooltipStyles.TooltipHint,
                Styles.MarketHeaderMessage__tooltip__location
              )}
              data-tip
              data-for="tooltip--message"
            >
              {Info}
            </span>
            <ReactTooltip
              id="tooltip--message"
              className={classNames(
                TooltipStyles.Tooltip,
                TooltipStyles.WideTooltip
              )}
              effect="solid"
              place="top"
              type="light"
            >
              <div
                style={{ color: "#372e4b" }}
                className={Styles.MarketHeaderMessage__tooltip}
              >
                {
                  <div>
                    <p>
                      Markets on Augur are created by the community, this means
                      that errors can be made in the creation of a market, which
                      can result in the market being resolved as invalid. If a
                      market resolves as invalid, each share is worth equal
                      amounts at resolution.
                    </p>
                    <p>
                      If the reporting start time (UTC) isn’t after the actual
                      end of the event, or if the title/description and
                      reporting start time don’t match up, there is a high
                      probability that the market will resolve as invalid.
                    </p>
                  </div>
                }
              </div>
            </ReactTooltip>
          </span>
        </div>
        {loggedIn && (
          <button onClick={() => dismiss(marketId)}>{SmallClose}</button>
        )}
      </div>
    )}
  </>
);

MarketHeaderMessage.propTypes = {
  loggedIn: PropTypes.bool,
  marketId: PropTypes.string,
  dismiss: PropTypes.func.isRequired,
  show: PropTypes.bool
};

MarketHeaderMessage.defaultProps = {
  loggedIn: false,
  show: true,
  marketId: ""
};

export default MarketHeaderMessage;
