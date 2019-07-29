import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Loginform from "./components/Loginform";
import Dashboard from "./views/Dashboard";
import Notifications from "./components/Notifications/Notifications";
import Users from "./components/Users";
import Upload from "./views/Upload/Upload";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import ToolBar from "./components/SideDrawer/ToolBar";
import List from "./components/List/List";
import Prospects from "./views/Prospects";

import "./App.css";

class App extends React.Component {
   
  render() {
    return (
      <div className="App" style={{ height: "100%" }}>
        {/* <ToolBar /> */}
        <div className="container">
          {/* {sideDrawer}
          {backdrop} */}
          <Switch>
            <Route exact path="/login" component={Loginform} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/notifications" component={Notifications} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/clients" component={Upload} />
            <Route exact path="/prospects" component={Prospects} />
            <Redirect to="/login" />
          </Switch>
          <SideDrawer />
        </div>
      </div>
    );
  }
}

export default App;
