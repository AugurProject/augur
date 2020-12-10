import React from 'react';
import Styles from 'modules/portfolio/activity.styles.less';
import { ADD_LIQUIDITY, BUY, SELL, USDC } from 'modules/constants';
import { UsdIcon } from 'modules/common/icons';

const fakeActivityData = [
  {
    date: '04/12',
    activity: [
      {
        type: BUY,
        currency: USDC,
        description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
        subheader: '100 Yes @ .40',
        time: '02:58 PM',
        value: '- 400.00 USDC',
      },
      {
        type: BUY,
        currency: USDC,
        description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
        subheader: '100 Yes @ .40',
        time: '02:58 PM',
        value: '- 400.00 USDC',
      },
      {
        type: SELL,
        currency: USDC,
        description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
        subheader: '100 Yes @ .40',
        time: '02:58 PM',
        value: '- 400.00 USDC',
      },
    ],
  },
  {
    date: '03/12',
    activity: [
      {
        type: ADD_LIQUIDITY,
        currency: USDC,
        description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
        subheader: '100 Yes @ .40',
        time: '02:58 PM',
        value: '- 400.00 USDC',
      },
    ],
  },
  {
    date: '30/11',
    activity: [
      {
        type: BUY,
        currency: USDC,
        description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
        subheader: '100 Yes @ .40',
        time: '02:58 PM',
        value: '- 400.00 USDC',
      },
      {
        type: BUY,
        currency: USDC,
        description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
        subheader: '100 Yes @ .40',
        time: '02:58 PM',
        value: '- 400.00 USDC',
      },
      {
        type: SELL,
        currency: USDC,
        description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
        subheader: '100 Yes @ .40',
        time: '02:58 PM',
        value: '- 400.00 USDC',
      },
    ],
  },
];

interface ActivityItem {
  type: string;
  currency: string;
  description: string;
  subheader: string;
  time: string;
  value: string;
}

interface ActivityCardProps {
  activity: ActivityItem;
}

const ActivityCard = ({ activity }: ActivityCardProps) => (
  <div className={Styles.ActivityCard}>
    <div>{activity.type}</div>
    <div>{activity.value}</div>
    <div>{UsdIcon}</div>
    <span>{activity.description}</span>
    <div>{activity.subheader}</div>
    <div>{activity.time}</div>
    <div>get info</div>
  </div>
);

export const Activity = () => (
  <div className={Styles.Activity}>
    <span>your activity</span>
    <div>
      {fakeActivityData.map((activityGroup) => (
        <div>
          <span>{activityGroup.date}</span>
          <div>
            {activityGroup.activity.map((activityItem) => (
              <ActivityCard activity={activityItem} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Activity;
