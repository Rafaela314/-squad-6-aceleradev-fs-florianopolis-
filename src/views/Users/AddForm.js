import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const Formbox = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  top: 20%;
  z-index: 0.5;
  padding: 20px;
`;

/*
  left: 50%;
  background: #fff;
  flex-flow: row wrap;
  margin: -10px 0 0 -400px;*/

const Inputfield = styled.input`
  outline: none;
  padding: 10px 15px 10px 15px;
  margin-left: 15px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: 0.2s linear;
  &input:focus {
    color: #333;
    border: 1px solid #44c4e7;
  }
`;

const Inputbutton = styled.input`
  cursor: pointer;
  background: #6bd2c9;
  width: 100%;
  padding: 10px 15px;
  border: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  &:hover {
    background: #369cb8;
  }
`;

class AddForm extends React.Component {
  state = {
    id: 0,
    name: " ",
    position: " ",
    email: " "
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitFormAdd = e => {
    e.preventDefault();
    fetch("http://localhost:8080/users", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        email: this.state.email,
        position: this.state.position
      })
    })
      .then(response => response.json())
      .then(user => {
        if (Array.isArray(user)) {
          this.props.addUserState(user[0]);
        } else {
          console.log("checkout");
        }
      })
      .catch(err => console.log(err));
      
  };


  /*.then(user => {
    if (Array.isArray(user)) {
      this.props.addUserState(user[0]);
    } else {
      console.log("checkout");
    }
  })*/

  /*postUsers = () => {
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
      .then(user => {
        if (Array.isArray(user)) {
          this.props.addUserState(user[0]);
        } else {
          console.log("checkout");
        }
      })
      .catch(err => {
        console.log(err);
        err.preventDefault();
      });
  };

  /*changeName = e => {
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

  submitFormAdd = e => {
    e.preventDefault();
    this.postUsers()
  }
*/

  componentDidMount() {
    if (this.props.user) {
      const { id, name, position, email } = this.props.user;
      this.setState({ id, name, position, email });
    }
  }

  render() {
    return (
      <Formbox onSubmit={this.submitFormAdd}>
        <label>
          Id:
          <Inputfield type="text" name="id" onChange={this.onChange} />
        </label>
        <label>
          Name:
          <Inputfield type="text" name="name" onChange={this.onChange} />
        </label>
        <label>
          Position:
          <Inputfield type="text" name="position" onChange={this.onChange} />
        </label>
        <label>
          Email:
          <Inputfield type="text" name="email" onChange={this.onChange} />
        </label>
        <Inputbutton type="submit" value="Submit" />
      </Formbox>
    );
  }
}

export default AddForm;
