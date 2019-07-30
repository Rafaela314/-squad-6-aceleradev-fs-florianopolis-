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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic YWRtaW46YWRtaW4="
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
          alert("User added!please refresh the page");
        }
      })
      .catch(err => console.log(err));
      
  };
/*

 if (Array.isArray(user)) {
          this.props.addUserState(user[0]);
        } else {
          console.log("checkout");
        }
  addUserState = (user) => {
    this.setState(prevState => ({
      users: [...prevState.users, user]
    }))
  }

  deleteUserState = id => {
    const updatedUsers = this.state.users.filter(user => user.id !== id);
    this.setState({ users: updatedUsers });
  };

  deleteUser = id => {
    let confirmDelete = window.confirm('Are you sure you want to delete this user?')
    if(confirmDelete){
      axios.delete('http://localhost:8080/users/'+ id)
      .then(console.log('Deleted'))
      .catch(err => console.log(err))
    }
    
  }*/
  

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
