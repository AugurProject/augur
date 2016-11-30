import React from 'react';

const NullStateMessage = p => (
	<article className="null-state-message">
		{!p.message ?
			<span>No Data Available</span> :
			<span>{p.message}</span>
		}
	</article>
);

export default NullStateMessage;
