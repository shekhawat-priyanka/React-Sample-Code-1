import React from "react";
import { Route, Switch } from "react-router-dom";

import HomePage from "views/Front";
import Login from "views/Auth/Login";
import AdminPanel from "views/Admin/Layout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import NotFoundPage from "views/NotFound";

const Routes = () => {
  return (
    <span>
      <Switch>
        <PublicRoute exact path="/login" restricted={true} component={Login} />
        <PrivateRoute path="/admin*" component={AdminPanel} />
        <Route path="/*" name="Home" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </span>
  );
};

export default Routes;
