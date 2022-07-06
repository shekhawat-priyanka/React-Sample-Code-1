/* eslint-disable */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
// import Alert from "../../Notifications/Alert";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

import {
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "./_nav";
// routes config
import AdminRoutes from "../../Routing/AdminRoutes";
import DefaultFooter from "./DefaultFooter";
import DefaultHeader from "./DefaultHeader";

const index = ({ auth: { isAuthenticated, loading }, alerts, props }) => {
  const createNotification = (type, message) => {
    switch (type) {
      case "info":
        return NotificationManager.info(message, "", 10000);
      case "success":
        return NotificationManager.success(message, "", 10000);
      case "warning":
        return NotificationManager.warning(message, "", 10000);
      case "danger":
        return NotificationManager.error(message, "", 10000);
    }
  };
  useEffect(() => {
    alerts !== null &&
      alerts.length > 0 &&
      alerts.map((alert, idx) => {
        createNotification(`${alert.alertType}`, alert.msg);
      });
  }, [alerts]);
  return (
    <div className="app">
      <AppHeader fixed>
        <DefaultHeader />
      </AppHeader>
      <div className="app-body">
        <AppSidebar fixed display="lg">
          <AppSidebarHeader />
          <AppSidebarForm />
          <AppSidebarNav
            navConfig={navigation}
            {...props}
            router={router}
            location={location}
          />
          <AppSidebarFooter />
          <AppSidebarMinimizer />
        </AppSidebar>
        <main className="main">
          <AppBreadcrumb appRoutes={AdminRoutes} router={router} />
          <Container fluid>
            <NotificationContainer />
            <Switch>
              {AdminRoutes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={route.component}
                  />
                ) : null;
              })}
              {/* <Redirect from="" to="/admin/page-not-found" /> */}
              <Redirect from="/" to="/admin" />
            </Switch>
          </Container>
        </main>
      </div>
      <AppFooter>
        <DefaultFooter />
      </AppFooter>
    </div>
  );
};

index.prototype = {
  auth: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  alerts: state.alert
});

export default connect(mapStateToProps)(withRouter(index));
