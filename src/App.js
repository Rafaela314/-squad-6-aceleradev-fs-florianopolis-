import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";

//import components
import SideBar from "./components/Sidebar";
import Loginform from "./components/Loginform";
import Dashboard from "./components/Dashboard";
import Notifications from "./components/Notifications";
import Register from "./components/Register";
import Upload from "./components/Upload";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SideBar />
      <div className="container">
        <Switch>
          <Route exact path="/login" component={Loginform} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/notifications" component={Notifications} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/upload" component={Upload} />
          <Redirect to="/login" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
