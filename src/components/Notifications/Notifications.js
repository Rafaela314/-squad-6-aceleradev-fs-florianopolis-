import React, { Component } from "react";
import styled from "styled-components";
import axios from 'axios';

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

const SearchBar = styled.input`
  display: block;
  width: 200px;
  margin-top: 40px;
  margin-left: 80%;
  border: 3px solid #6bd2c9;
  padding: 5px;
  height: 40px;
  border-radius: 5px;
  outline: none;
  color: black;
`;
class Notifications extends Component {
  state = {
    searchString: "",
    notifications:[],
  }

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

  changeSearch = e =>
    this.setState({
      searchString: e.target.value
    });


  renderTableHeader() {
    if (this.state.notifications[0]) {
      let header = Object.keys(this.state.notifications[0]);
      return header.map((key, index) => {
        return <Th key={index}>{key.toUpperCase()}</Th>;
      });
    } else {
      return null;
    }
  }

 
  renderNotifications = searchString => {
    const search = this.state.searchString;
    const notificationsJson = this.state.notifications;

    if (search === "") {
      return notificationsJson.map((notifications, index) => (
        <tr key={index} id={index} >
          <Td>{notifications.id}</Td>
          <Td>{notifications.name}</Td>
          <Td>{notifications.email}</Td>
          <Td>{notifications.qtLeads}</Td>
          <Td>{notifications.dtEnvio}</Td>
          <Td>{notifications.hrEnvio}</Td>
        </tr>
      ))
    } else {
      let result = notificationsJson.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );

      return result.map((notifications, index) => (
        <tr key={index} id={index} >
          <Td>{notifications.id}</Td>
          <Td>{notifications.name}</Td>
          <Td>{notifications.email}</Td>
          <Td>{notifications.qtLeads}</Td>
          <Td>{notifications.dtEnvio}</Td>
          <Td>{notifications.hrEnvio}</Td>
        </tr>

      ))
    }
  }  

  render() {
    const { notifications } = this.state;

    return (
     <React.Fragment>
       <Main>
       <SearchBar
          type="text "
          placeholder="pesquisa por nome"
          value={this.state.searchString}
          onChange={this.changeSearch}
        />
        
        <Table>
          <tbody>
            <Tr>
              {this.renderTableHeader()}
            </Tr>
            {this.renderNotifications()}
          </tbody>
        </Table>
      </Main>
    </React.Fragment>
      

    );
  }
}
export default Notifications;
