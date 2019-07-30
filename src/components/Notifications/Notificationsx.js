import React, { Component } from "react";
import styled from "styled-components";
// import notifications from "../../JSON/notifications.json";
import Row from "./Row";

// Objetivo de importar notifications e da função render notifications é simular
// uma request padrao para a API

const SearchBar = styled.input`
  display: block;
  margin-top: 40px;
  margin-left: 10%;
  border: 3px solid #00b4cc;
  padding: 5px;
  height: 20px;
  border-radius: 5px;
  outline: none;
  color: black;
`;

class Notifications extends Component {
  state = {
    searchString: "",
    notifications:[],
  };

  componentDidMount(){
      this.getNotifications()
  }

  getNotifications = () => {
    fetch("http://localhost:8080/events", {
    method: "GET",
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic YWRtaW46YWRtaW4="
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer" // no-referrer, *client
  })
    .then(response => {
      console.log("hello");
      return response.json();
    })
    .then(data => {
      console.log(data);
      this.setState({
        notifications: data
      });
    })
    .catch(err => {
      console.log(err);
    });

  }


  renderNotifications = searchString => {
     console.log("render notifications no comando!");
     const search = this.state.searchString;
     const notificationsJson = this.state.notifications;

     if (search === "") {
       return notificationsJson.map((not, i) => (
         <Row notification={not} key={i} id={i} />
       ));
     } else {
       var result = notificationsJson.filter(c =>
         c.name.toLowerCase().includes(search.toLowerCase())
       );

       return result.map((not, i) => <Row notification={not} key={i} id={i} />);
     }
   };

  changeSearch = e =>
    this.setState({
      searchString: e.target.value
    });

  render() {
    return (
      <div className="container">
        <h1>Notifications</h1>
        <SearchBar
          type="text "
          placeholder="pesquisa por nome"
          value={this.state.searchString}
          onChange={this.changeSearch}
        />
        <table>
          <thead>
            <tr>
              <th>nome</th>
              <th>email</th>
              <th>type</th>
              <th>hora</th>
              <th>data</th>
            </tr>
          </thead>
            <tbody>{this.renderNotifications()}</tbody>
        </table>
      </div>
    );
  }
}

export default Notifications;
