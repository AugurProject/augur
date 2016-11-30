import React from 'react';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';

const TabNavigation = p => (
	<div className="tab-navigator">
		{!!p.navItems && p.navItems.map((navItem, i) => {
			if (typeof navItem.page === 'string') navItem.page = [navItem.page];

			return (
				<Link
					key={`${i}`}
					className={classnames('nav-item', { active: navItem.page.indexOf(p.activeView) > -1 })}
					href={navItem.link.href}
					onClick={navItem.link.onClick}
				>
					<span className="nav-label">{navItem.label}</span>

					{(!!navItem.leadingValue || !!navItem.trailingValue) &&
						<section className="nav-values">
							{navItem.leadingValue &&
								<ValueDenomination
									data-tip data-for={`tab-${i}-leading-tooltip`}
									{...navItem.leadingValue || {}}
								/>
							}
							{navItem.trailingValue &&
								<ValueDenomination
									data-tip data-for={`tab-${i}-trailing-tooltip`}
									className="colorize"
									{...navItem.trailingValue || {}}
								/>
							}
							<ReactTooltip id={`tab-${i}-leading-tooltip`} type="light" effect="solid" place="top">
								<span className="tooltip-text">
									{navItem.leadingTitle ? `${navItem.leadingTitle}: ${navItem.leadingValue.full}` : ''}
								</span>
							</ReactTooltip>
							<ReactTooltip id={`tab-${i}-trailing-tooltip`} type="light" effect="solid" place="top">
								<span className="tooltip-text">
									{navItem.trailingTitle ? `${navItem.trailingTitle}: ${navItem.trailingValue.full}` : ''}
								</span>
							</ReactTooltip>
						</section>
					}
				</Link>
			);
		})}
	</div>
);


// TODO -- Prop Validations
// TabNavigation.propTypes = {
// 	activeView: React.PropTypes.string,
// 	navItems: React.PropTypes.array
// };

export default TabNavigation;
