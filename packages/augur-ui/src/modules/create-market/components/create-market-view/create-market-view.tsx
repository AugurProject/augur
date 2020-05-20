import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import { LANDING, TEMPLATE } from 'modules/create-market/constants';

import Form from 'modules/create-market/components/form';
import Landing from 'modules/create-market/landing';
import Styles from 'modules/create-market/components/create-market-view/create-market-view.styles.less';
import parseQuery from 'modules/routes/helpers/parse-query';
import { CREATE_MARKET_FORM_PARAM_NAME } from 'modules/routes/constants/param-names';
import makeQuery from 'modules/routes/helpers/make-query';
import makePath from 'modules/routes/helpers/make-path';
import { CREATE_MARKET } from 'modules/routes/constants/views';
import { CREATE_MARKET_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';

export const CreateMarketView = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [true]);
  const page = parseQuery(location.search)[CREATE_MARKET_FORM_PARAM_NAME] || LANDING;

  function updatePage(nextPage) {
    history.push({
      pathname: makePath(CREATE_MARKET, null),
      search: makeQuery({
        [CREATE_MARKET_FORM_PARAM_NAME]: nextPage,
      }),
    });
  }

  return (
    <section className={Styles.CreateMarketView}>
      <HelmetTag {...CREATE_MARKET_VIEW_HEAD_TAGS} />
      {page === LANDING ? (
        <Landing updatePage={nextPage => updatePage(nextPage)} />
      ) : (
        <Form
          isTemplate={page === TEMPLATE}
          updatePage={nextPage => updatePage(nextPage)}
        />
      )}
    </section>
  );
};

export default CreateMarketView;
