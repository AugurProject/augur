import React, { useEffect } from 'react';
import { analytics } from './analytics';
import { RouteComponentProps } from 'react-router-dom';
import { page } from 'services/analytics/helpers';
import { useLocation } from 'react-router';

const withPageAnalytic = <P extends unknown>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const location = useLocation();
    useEffect(() => {
      page(location.pathname, {});
    }, [location.pathname]);

    return <WrappedComponent {...props} />;
  };
};

export default withPageAnalytic;
