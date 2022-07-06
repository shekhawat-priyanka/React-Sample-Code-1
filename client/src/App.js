import logo from "./logo.svg";
import "./App.scss";
import React, { useEffect, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { renderRoutes } from 'react-router-config';
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Routes from "./views/Routing/Routes";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Switch>
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
