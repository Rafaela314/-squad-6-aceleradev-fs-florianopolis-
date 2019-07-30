import React, { Component } from "react";
import styled from "styled-components";
import Row from "./Row";
import axios from "axios";

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
      users: [],
      searchString: ""
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    axios
      .get("http://localhost:8080/users", {
        method: "GET",
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic YWRtaW46YWRtaW4="
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // no-referrer, *client
      })
      .then(res => {
        const users = res.data;
        this.setState({
          users: users
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderList = () => {
    var users = this.state.users;
    const searchString = this.state.searchString;

    if (searchString === "") {
      return users.map((user, i) => <Row user={user} key={i} id={i} />);
    } else {
      const result = users.filter(c =>
        c.name.toLowerCase().includes(searchString.toLowerCase())
      );
      return result.map((user, i) => <Row user={user} key={i} id={i} />);
    }
  };

  changeSearch = e => {
    this.setState({
      searchString: e.target.value
    });
  };

  render() {
    console.log("state table", this.state);
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
              <th>email</th>
              <th>position</th>
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
