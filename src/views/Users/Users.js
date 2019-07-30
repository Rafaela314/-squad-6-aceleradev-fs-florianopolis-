import React, { Component } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import axios from 'axios';

import trash from "../../assets/icons/delete.svg";
import plus from "../../assets/icons/plus_b.svg";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
`;

const Table = styled.table`
  /* text-align: left; */
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border: 3px solid #ddd;
  width: 100%;
  tbody:before {
    content: "-";
    display: block;
    line-height: 0.6em;
    color: transparent;
  }
`;

const Th = styled.th`
  border: 1px solid black;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #6bd2c9;
  font-size: 18px;
  color: white;
  font-weight: 700;
  opacity: 0.65;
`;

const Tr = styled.tr`
  border-bottom: 2px solid black;
`;

const Td = styled.td`
  border-bottom: 2px solid #ddd;
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const Icon = styled.img`
  display: block;
  width: 20px;
  height: 20px;
`;

const Addnew = styled.button`
  display: inline-block;
  width: 120px;
  height: 50px;
  background-color: transparent;
  margin-left: 3px;
`;

const Mailbutton = styled.button`
  cursor: pointer;
  background: #6bd2c9;
  width: 100px;
  padding: 10px 15px;
  border: 1;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  &:hover {
    background: #369cb8;
  }
`;

class Users extends Component {
  state = {
    users: [],
    userForm: "",
    show: false
  };

 
    /* get users that will receive notifications
    axios.get('/users').then(response => response.data)
    .then((data)=> {
    this.setState({users: data})
    console.log(this.state.users)
    })*/

  
    getUsers =() => {
      fetch("http://localhost:8080/users", {
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
          users: data
        });
      })
      .catch(err => {
        console.log(err);
      });
    }
    
    
  

  showModal = e => {
    this.setState({
      show: !this.state.show
    });
  };

  addUserToState = (user) => {
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
      .then(user => {
        this.deleteUserState(id)
      })
      .catch(err => console.log(err))
    }
    
  }
//authorized.POST("events", sentEmail) 
  sendMail = id => {
    fetch("http://localhost:8080/events", {
      method: "POST",
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.log(err);
      });
      alert('report enviado');
  }

    
  componentDidMount(){
    console.log("componentDidMount coming through!");
    this.getUsers()
  }


  renderTableHeader() {
    if (this.state.users[0]) {
      let header = Object.keys(this.state.users[0]);
      return header.map((key, index) => {
        return <Th key={index}>{key.toUpperCase()}</Th>;
      });
    } else {
      return null;
    }
  }



  render() {
    const { users } = this.state;

    return (
     <React.Fragment>
       <Main>
        <div style={{width:'110px'}}>
          <Modal
            onClose={this.showModal}
            show={this.state.show}
            addUserState={this.addUserState}
            style={{ flexDirection: "row" }}
           >
            Message in Modal
          </Modal>
        </div>
        
        <Table>
          <tbody>
            <Tr>
              {this.renderTableHeader()}
              <Th>
                <Addnew
                  onClick={e => {
                    this.showModal();
                  }}
                >
                  ADD NEW
                  <Icon
                    src={plus}
                    alt="new user"
                    style={{ display: "inline" }}
                  />
                </Addnew>
              </Th>
            </Tr>
            {users.map((user, index) => (
              <tr key={user.id} >
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.position}</Td>
                <Td>{user.email}</Td>
                <Td style={{ align: "center" }}>
                  <button
                    onClick={() => this.deleteUser(user.id)}
                    style={{ margin: "auto", display: "block" }}
                  >
                    {" "}
                    <Icon src={trash} alt="delete" />{" "}
                  </button>
                  
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Main>
      <Mailbutton
        onClick={() => this.sendMail()}>
          Send Report
      </Mailbutton>
    </React.Fragment>
      

    );
  }
}
export default Users;
