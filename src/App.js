import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Login from "./components/Login/Loginform";
import Dashboard from "./components/Dashboard/Dashboard";
import Prospects from "./views/Prospects";
import Clients from "./components/Clients/Clients";
import Users from "./components/Users/Users";
import Notifications from "./components/Notifications/Notifications";

import SideDrawer from "./components/SideDrawer/SideDrawer";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App" style={{ height: "100%" }}>
        <div className="container">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/prospects" component={Prospects} />
            <Route exact path="/clients" component={Clients} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/notifications" component={Notifications} />
            <Redirect to="/login" />
          </Switch>
          <SideDrawer />
        </div>
      </div>
    );
  }
}

export default App;
