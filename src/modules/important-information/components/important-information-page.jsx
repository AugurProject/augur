/*
 * Author: priecint
 */

import React, {PropTypes} from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';

const ImportantInformationPage = (p) => (
	<main className="page important-information">
		<SiteHeader {...p.siteHeader} />

		<article className="page-content">
			<div className="l-container">
				{ p.content }
			</div>
		</article>

		<SiteFooter />
	</main>
);

ImportantInformationPage.propTypes = {
	siteHeader: PropTypes.object.isRequired,
	content: PropTypes.element.isRequired
};

export default ImportantInformationPage;
