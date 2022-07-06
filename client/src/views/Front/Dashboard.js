import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "views/Spinner";

const Dashboard = ({ isAuthenticated, loading }) => {
  return loading ? (
    <Spinner />
  ) : isAuthenticated ? (
    <div className="landing-inner">
      <h1 className="x-large">{process.env.REACT_APP_APP_NAME}</h1>
      <p className="lead">Welcome to our website.</p>{" "}
    </div>
  ) : (
    <div className="landing-inner">
      <h1 className="x-large">{process.env.REACT_APP_APP_NAME}</h1>
      <p className="lead">Your profile.</p>
      <div className="buttons">
        <Link to="/login" className="btn btn-light">
          Login
        </Link>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(Dashboard);
