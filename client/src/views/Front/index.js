import React, { Fragment } from "react";
import { connect } from "react-redux";
import Header from "./Layout/Header";
import { Route, Switch } from "react-router-dom";
import FrontRoutes from "views/Routing/FrontRoutes";

const Home = () => {
  return (
    <div className="home">
      <Fragment>
        <Header />
        <section className="landing">
          <div className="dark-overlay">
            <Switch>
              {FrontRoutes.map((route, idx) => {
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
            </Switch>
          </div>
        </section>
      </Fragment>
    </div>
  );
};

export default connect()(Home);
