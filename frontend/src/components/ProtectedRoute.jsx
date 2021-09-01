import React from 'react';
import { Redirect } from 'react-router-dom';
import { get } from 'js-cookie';

const ProtectedRoute = ({ component: Component, setToken, ...rest }) => {
  if (!!get('token')) {
    return <Component {...rest} />;
  } else {
    return <Redirect to="/" />;
  }
};

export default ProtectedRoute;
