import React, { Component } from "react";
import styled from "styled-components";

import axios from "axios";
import Table from "./Table";

const Wrapper = styled.div`
  padding-top: 50px;
  height: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
  flex-direction: column;
`;

class Upload extends Component {
  state = {
    users: [],
    searchString: "",
    createUser: {
      name: "",
      email: "",
      position: ""
    }
  };

  componentDidMount() {
    // console.log("componentDidMount coming through!");
    // console.log(this.state.createUser);
  }

  postUsers = () => {
    let user = this.state.createUser;
    axios
      .post(
        "http://localhost:8080/users",
        {
          name: user.name,
          email: user.email,
          position: user.position
        },
        {
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic YWRtaW46YWRtaW4=",
            "Cache-Control": "no-cache"
          },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer" // no-referrer, *client
        }
      )
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        err.preventDefault();
      });
  };

  changeName = e => {
    this.setState({
      createUser: {
        name: e.target.value,
        email: this.state.createUser.email,
        position: this.state.createUser.position
      }
    });
  };

  changeEmail = e => {
    this.setState({
      createUser: {
        name: this.state.createUser.name,
        email: e.target.value,
        position: this.state.createUser.position
      }
    });
  };

  changePosition = e => {
    this.setState({
      createUser: {
        name: this.state.createUser.name,
        email: this.state.createUser.email,
        position: e.target.value
      }
    });
  };

  render() {
    console.log("state", this.state);
    return (
      <div>
        <h1>Create a new user</h1>
        <Wrapper>
          <form>
            <input
              placeholder="name"
              onChange={this.changeName}
              value={this.state.createUser.name}
            />
            <input
              placeholder="email"
              onChange={this.changeEmail}
              value={this.state.createUser.email}
            />
            <input
              placeholder="position"
              onChange={this.changePosition}
              value={this.state.createUser.position}
            />
            <button onClick={this.postUsers}>submit</button>
          </form>
        </Wrapper>
        <Table />
      </div>
    );
  }
}

export default Upload;
