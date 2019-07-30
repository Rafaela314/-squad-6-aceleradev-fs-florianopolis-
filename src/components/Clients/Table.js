import React, { Component } from "react";
import styled from "styled-components";
import Row from "./Row";
import axios from "axios";

const auth = localStorage.getItem("token");

const SearchBar = styled.input`
  display: block;
  float: right;
  margin-top: 40px;
  margin-right: 10%;
  border: 3px solid #6bd2c9;
  padding: 8px;
  height: 30px;
  border-radius: 5px 5px 0 0;
  border-bottom: none;
  outline: none;
  color: black;
`;

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      searchString: ""
    };
  }

  componentDidMount() {
    // console.log("componentDidMount coming through!");

    axios
      .get("http://localhost:8080/clients", {
        method: "GET",
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          Authorization: auth
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // no-referrer, *client
      })
      .then(res => {
        const clients = res.data;
        this.setState({
          clients
        });
      });
  }

  renderList = () => {
    var clients = this.state.clients;
    const searchString = this.state.searchString;

    if (searchString === "") {
      return clients.map((client, i) => <Row client={client} key={i} id={i} />);
    } else {
      const result = clients.filter(c =>
        c.name.toLowerCase().includes(searchString.toLowerCase())
      );
      return result.map((client, i) => <Row client={client} key={i} id={i} />);
    }
  };

  changeSearch = e => {
    this.setState({
      searchString: e.target.value
    });
  };

  render() {
    console.log("state", this.state);
    return (
      <div className="container">
        <SearchBar
          type="text"
          placeholder="SEARCH BY NAME"
          value={this.state.searchString}
          onChange={this.changeSearch}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>place</th>
              <th>position</th>
              <th>salary</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>{this.renderList()}</tbody>
        </table>
      </div>
    );
  }
}

export default Notifications;
