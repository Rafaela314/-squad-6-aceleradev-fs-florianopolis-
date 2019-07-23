import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Loginform from "./components/Loginform";
import Dashboard from "./components/Dashboard/Dashboard";
import Notifications from "./components/Notifications/Notifications";
import Users from "./components/Users";
import Upload from "./components/Upload";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import ToolBar from "./components/SideDrawer/ToolBar";
import List from "./components/List/List";
import UploadSave from "./components/UploadSave";

import "./App.css";

class App extends React.Component {
  state = {
    prospects: [
      {
        id: 1,
        name: "Carlos Santos",
        position: "gerente de vendas",
        place: "INSS",
        salary: 23.0,
        isclient: "yes"
      },
      {
        id: 2,
        name: "Sabrina Oliveira",
        position: "recepcionista",
        place: "TFJ",
        salary: 21.0,
        isclient: "no"
      },
      {
        id: 3,
        name: "Sarah Lima",
        position: "Inspetora",
        place: "Polícia Federal",
        salary: 19.0,
        isclient: "no"
      },
      {
        id: 4,
        name: "Marcos Schuler",
        position: "caixa",
        place: "Banco do Brasil",
        salary: 20.0,
        isclient: "yes"
      }
    ],
    drawerIsOpen: false
  };

  // drawerToggleClickHandler = () => {
  //   this.setState(prevState => {
  //     return { drawerIsOpen: !prevState.drawerIsOpen };
  //   });
  // };

  // backdropClickHandler = () => {
  //   this.setState({ drawerIsOpen: false });
  // };

  render() {
    // let sideDrawer;
    // let backdrop;

    // if (this.state.drawerIsOpen) {
    //   sideDrawer = <SideDrawer />;
    //   backdrop = <Backdrop click={this.backdropClickHandler} />;
    // }

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
            <Route exact path="/list" component={List} />
            <Route exact path="/upload" component={Upload} />
            <Route
              exact
              path="/uploadSave"
              render={props => (
                <UploadSave {...props} prospects={this.state.prospects} />
              )}
            />
            <Redirect to="/login" />
          </Switch>
          <SideDrawer />
        </div>
      </div>
    );
  }
}

export default App;
