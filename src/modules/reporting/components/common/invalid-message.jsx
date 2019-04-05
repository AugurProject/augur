import React from "react";
import Styles from "modules/reporting/components/common/highlighted-message.styles";

const InvalidMessage = () => (
  <div className={Styles.HighlightedMessage}>
    <div>
      If a timezone isn’t provided in the Market Question and/or Additional
      Details, use the{" "}
      <span className={Styles.bolden}>
        Official Reporting Start Time in{" "}
        <a href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time">
          UTC-0
        </a>
      </span>
    </div>
    <div>
      <span className={Styles.bolden}>
        Guidelines for spotting markets that resolve as invalid:
      </span>
      <ul>
        <li>The question is subjective in nature</li>
        <li>The outcome was not known at reporting start time</li>
        <li>
          The title, details, reporting start time, resolution source, and
          outcomes are in direct conflict
        </li>
        <li>
          There are strong arguments for the market resolving as multiple
          outcomes.
        </li>
        <li>
          The resolution source does not provide a readily available answer.
        </li>
        <li>
          The resolution source provides different answers to different viewers.
        </li>
      </ul>
    </div>
  </div>
);

export default InvalidMessage;
