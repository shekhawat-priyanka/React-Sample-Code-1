import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({
  auth: { isAuthenticated, loading, user },
  ...rest
}) => {
  if (!isAuthenticated && !loading) {
    return <Redirect to="/login" />;
  } else if (user !== null) {
    var isAdmin = false;
    user.role.map(row => {
      if (row.user_type === 1) isAdmin = true;
      else isAdmin = false;
    });
    if (isAdmin) {
      return <Route {...rest} render={props => <Component {...props} />} />;
    } else {
      return <Redirect to="/" />;
    }
  } else {
    return <Route {...rest} render={props => <Component {...props} />} />;
  }
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
