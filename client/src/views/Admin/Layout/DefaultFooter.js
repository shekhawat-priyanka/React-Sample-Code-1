import React, { Fragment } from "react";
import Moment from "react-moment";
const fronturl = process.env.REACT_APP_CLIENT_URL;
const DefaultFooter = () => (
  <Fragment>
    <span>
      <a href={fronturl} target="_blank">
        {process.env.REACT_APP_APP_NAME}
      </a>{" "}
      &copy; <Moment format="YYYY" />
    </span>
  </Fragment>
);

export default DefaultFooter;
