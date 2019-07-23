import React, { Component } from 'react';

import Styles from 'modules/create-market/components/visibility.styles';
import { LargeSubheaders, ContentBlock, SmallHeaderLink, SmallSubheaders, SmallSubheadersTooltip } from "modules/create-market/components/common";

export interface VisibilityProps {
}

export const Visibility = (props: VisibilityProps) => (
	<ContentBlock dark>
	  <div className={Styles.Visibility}>
	  	<LargeSubheaders
	        link
	        header="Market visibility"
	        subheader="To ensure your market is visible to users you must pass the spread filter check. To improve the ranking or visiblity of your market, ensure you add good liquidity to each outcome."
	    />
          <SmallSubheadersTooltip 
          	header="default Spread filter check" 
          	subheader="Fail" 
          	text="Info text" 
          />

          <SmallSubheaders
          	header="How to pass spread filter check" 
          	subheader="New suggestion: Tighten spread to less than 15% on [Outcome: X] to pass spread filter check" 
          />

          <SmallSubheadersTooltip 
          	header="Market ranking" 
          	subheader="600 / 600" 
          	text="Info text" 
          />
          
          <SmallSubheaders
          	header="default Spread filter check" 
          	subheader="1. Add Buy and Sell orders to any outcomes that do not have orders" 
          />
	  </div>
	</ContentBlock>
);
