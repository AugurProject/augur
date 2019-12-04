import React, { useEffect } from 'react';
import { analytics } from './analytics';
import { RouteComponentProps } from 'react-router-dom';

interface ComponentProps extends RouteComponentProps {
  page: Function
}

const withPageAnalytic = <P extends unknown>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: ComponentProps & P) => {
    useEffect(() => {
      props.page(props.location.pathname, {});
    }, [props.location.pathname]);

    return <WrappedComponent {...props} />;
  };
};

export default withPageAnalytic;
