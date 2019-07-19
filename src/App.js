import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Loginform from "./components/Loginform";
import Dashboard from "./components/Dashboard/Dashboard";
import Notifications from "./components/Notifications/Notifications";
import Register from "./components/Register";
import Upload from "./components/Upload";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import List from "./components/List/List";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <SideDrawer />
        <div className="container">
          <Switch>
            <Route exact path="/login" component={Loginform} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/notifications" component={Notifications} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/list" component={List} />
            <Route exact path="/upload" component={Upload} />
            <Redirect to="/login" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
