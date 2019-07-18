import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

//import components
//import { getAll } from "./services/funcionarios";
//import SideBar from "./components/Sidebar";
import Loginform from "./components/Loginform";
import Dashboard from "./components/Dashboard/Dashboard";
import Notifications from "./components/Notifications";
import Register from "./components/Register";
import Upload from "./components/Upload";
import SideDrawer from "./components/SideDrawer/SideDrawer";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prospects: [
        {
          id: 1,
          name: "Carlos Santos",
          position: "gerente de vendas INSS",
          salary: 23.0,
          isclient: "yes"
        },
        {
          id: 2,
          name: "Sabrina Oliveira",
          position: "recepcionista TFJ",
          salary: 21.0,
          isclient: "no"
        },
        {
          id: 3,
          name: "Sarah Lima",
          position: "Inspetora PF",
          salary: 19.0,
          isclient: "no"
        },
        {
          "id": 4,
          "name": "Marcos Schuler",
          "position": "caixa BB",
          "salary": 20.000,
          "isclient": "yes"
        }],
        drawerIsOpen: false
    };

    this.drawerToggleClickHandler = this.drawerToggleClickHandler.bind(this);
    this.backdropClickHandler = this.backdropClickHandler.bind(this);
  }

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {drawerIsOpen: !prevState.drawerIsOpen};
    });

  };

  backdropClickHandler = () => {
    this.setState({drawerIsOpen: false})
  };

  render() {
    // let sideDrawer;
    // let backdrop;

    // if (this.state.drawerIsOpen) {
    //   sideDrawer = <SideDrawer />
    //   backdrop = <Backdrop click={this.backdropClickHandler} />
    // }

    return (
      <div className="App">
        <SideDrawer />
        <div className="container">
          <Switch>
            <Route exact path="/login" component={Loginform} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/notifications" component={Notifications} />
            <Route exact path="/register" component={Register} />
            <Route
              exact
              path="/upload"
              render={props => (
                <Upload {...props} prospects={this.state.prospects} />
              )}
            />
            <Redirect to="/login" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
