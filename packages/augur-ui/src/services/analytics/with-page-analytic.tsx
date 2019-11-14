import React, { useEffect } from 'react';
import { analytics } from './analytics';
import { RouteComponentProps } from 'react-router-dom';

const withPageAnalytic = <P extends unknown>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: RouteComponentProps & P) => {
    useEffect(() => {
      analytics.page();
    }, [props.location.pathname]);

    return <WrappedComponent {...props} />;
  };
};

export default withPageAnalytic;
