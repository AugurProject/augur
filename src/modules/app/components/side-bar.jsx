import React from 'react';

import Checkbox from 'modules/common/components/checkbox';
import NullStateMessage from 'modules/common/components/null-state-message';

const SideBar = (p) => {
	const nullMessage = 'No Tags Available';

	return (
		<article className="side-bar" >
			<h3>All Tags</h3>
			<div className="tags">
				{p.tags.length ? p.tags.map(tag =>
					<Checkbox
						key={tag.value}
						className="tag"
						text={tag.name}
						text2={`(${tag.numMatched})`}
						isChecked={tag.isSelected}
						onClick={tag.onClick}
					/>
				) : <NullStateMessage message={nullMessage} />
			}
			</div>
		</article>
	);
};


// TODO -- Prop Validations
// SideBar.propTypes = {
// 	filters: React.PropTypes.array
// };

export default SideBar;
