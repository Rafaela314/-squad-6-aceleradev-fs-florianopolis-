import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal';

import userService from '../services/userService';
import pen from "../assets/icons/edit.svg";
import trash from "../assets/icons/delete.svg";
import plus from "../assets/icons/plus_b.svg";

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  text-align: center;
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
  text-align: center;
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
  float: right;
  display: block;
  width: 20px;
  height: 20px;

`;


class Users extends Component {
  state = {
    users: [
      {
        id: 1,
        name: "Danaerys Targaryan",
        position: "gerente de vendas CO",
        email:"Danearys@gmail.com"
      },
      {
        id: 2,
        name: "Arya Startk",
        position: "gerente de vendas NE",
        email:"Arya@gmail.com"
        
      },
      {
        id: 3,
        name: "John Snow",
        position: "gerente de vendas SUL",
        email:"JohnletItSnow@gmail.com"
      },
      {
        id: 4,
        name: "Tyrion Lanister",
        position: "gerente de vendas NORTE",
        email:"Tyriondwarfw@gmail.com"
      }
  
    ],
    userForm: '',
    show: false
  };

  showModal = e => {
    this.setState({
      show: !this.state.show
    });
  };

  /*getUsers(){
    fetch('http://localhost:3000/crud')
      .then(response => response.json())
      .then(users => this.setState({users}))
      .catch(err => console.log(err))
  }*/

  addUserState = (user) => {
    this.setState(prevState => ({
      users: [...prevState.users, user]
    }))
  }

  deleteUserState = (id) => {
    const updatedUsers = this.state.users.filter(user => user.id !== id)
    this.setState({ users: updatedUsers })
  }

  /*deleteUser = id => {
    let confirmDelete = window.confirm('Are you sure?')
    if(confirmDelete){
      fetch('http://localhost:3000/crud', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id
      })
    })
      .then(response => response.json())
      .then(item => {
        this.deleteItemFromState(id)
      })
      .catch(err => console.log(err))
    }

  }*/

  /*componentDidMount(){
    this.getUsers()
  }*/
      

  renderTableHeader() {
    let header = Object.keys(this.state.users[0]);
    return header.map((key, index) => {
      return <Th key={index}>{key.toUpperCase()}</Th>;
    });
  }
  
  render(){

    const { users } = this.state;

    return(
      <Main>
        <Modal onClose={this.showModal} show={this.state.show} addItemToState={this.addUserState}>
          Message in Modal
        </Modal>
        <Table>
          <tbody>
            <Tr>{this.renderTableHeader()}
                <Th>
                  <button onClick={e => {
              this.showModal();
         }}>ADD NEW<Icon src={plus} alt="new user" style={{display: 'inline'}}/></button>
                </Th>
              
            </Tr>
            {users.map((user, index) => (
              <tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.position}</Td>
                <Td>{user.email}</Td>
                <Td style={{align:'center'}}>
                
              <button color="danger" onClick={() => this.deleteUserState(user.id)} style={{margin:'auto', display:'block'}}> <Icon src={trash} alt="delete"/> </button>
                </Td>
              
            </tr>
            ))}
          </tbody>
        </Table>
      </Main>
    );
  };

}
export default Users;

