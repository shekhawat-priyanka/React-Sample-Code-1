import React from "react";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";

const SettingTabs = () => {
  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            to="/admin/settings"
            activeClassName="active"
            className="nav-link"
          >
            Website Setting
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            to="/admin/social-settings"
            activeClassName="active"
            className="nav-link"
          >
            Social Setting
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default SettingTabs;
