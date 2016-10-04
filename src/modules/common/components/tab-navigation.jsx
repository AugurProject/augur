import React from 'react';
import classnames from 'classnames';

import Link from '../../link/components/link';
import ValueDenomination from '../../../modules/common/components/value-denomination';

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
									title={navItem.leadingTitle ? `${navItem.leadingTitle}: ${navItem.leadingValue.full}` : ''}
									{...navItem.leadingValue || {}}
								/>
							}

							{navItem.trailingValue &&
								<ValueDenomination
									title={navItem.trailingTitle ? `${navItem.trailingTitle}: ${navItem.trailingValue.full}` : ''}
									className="colorize"
									{...navItem.trailingValue || {}}
								/>
							}
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
