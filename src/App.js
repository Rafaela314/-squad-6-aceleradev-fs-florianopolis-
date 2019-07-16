import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";

//import components
import { getAll } from "./services/funcionarios";
import SideBar from "./components/Sidebar";
import Loginform from "./components/Loginform";
import Dashboard from "./components/Dashboard";
import Notifications from "./components/Notifications";
import Register from "./components/Register";
import Upload from "./components/Upload";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prospects: [
        {
          "userId": 1,
          "id": 1,
          "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
          "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
        },
        {
          "userId": 1,
          "id": 2,
          "title": "qui est esse",
          "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
        },
        {
          "userId": 1,
          "id": 3,
          "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
          "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
        }]
    }
  }

  render() {

    return (
      <div className="App">
        <SideBar />
        <div className="container">
          <Switch>
            <Route exact path="/login" component={Loginform} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/notifications" component={Notifications} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/upload" render={(props) => (<Upload {...props} prospects={this.state.prospects}/>
            )} />
            <Redirect to="/login" />
          </Switch>
        </div>
      </div>
    );
  }
}

  

export default App;
