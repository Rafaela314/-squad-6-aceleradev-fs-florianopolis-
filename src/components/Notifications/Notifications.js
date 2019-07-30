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



  render() {
    const { notifications } = this.state;

    return (
     <React.Fragment>
       <Main>
        
        <Table>
          <tbody>
            <Tr>
              {this.renderTableHeader()}
            </Tr>
            {notifications.map((notifications, index) => (
              <tr key={notifications.id} >
                <Td>{notifications.id}</Td>
                <Td>{notifications.name}</Td>
                <Td>{notifications.email}</Td>
                <Td>{notifications.qtLeads}</Td>
                <Td>{notifications.dtEnvio}</Td>
                <Td>{notifications.hrEnvio}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Main>
    </React.Fragment>
      

    );
  }
}
export default Notifications;
