import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "actions/auth";

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
} from "reactstrap";

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import logo from "assets/img/brand/logo.svg";
import defaultImage from "assets/img/avatars/user.png";
import sygnet from "assets/img/brand/sygnet.svg";

const DefaultHeader = ({ auth: { user }, logout }) => (
  <Fragment>
    <AppSidebarToggler className="d-lg-none" display="md" mobile />
    <AppNavbarBrand
      full={{ src: logo, width: 89, height: 25, alt: "Logo" }}
      minimized={{ src: sygnet, width: 30, height: 30, alt: "Logo" }}
    />
    <AppSidebarToggler className="d-md-down-none" display="lg" />

    <Nav className="ml-auto" navbar>
      <UncontrolledDropdown nav direction="down">
        <DropdownToggle nav>
          <img
            src={defaultImage}
            className="img-avatar"
            alt={user && user.first_name}
          />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={logout}>
            <i className="fa fa-lock"></i> Logout
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Nav>
  </Fragment>
);

DefaultHeader.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(DefaultHeader);
