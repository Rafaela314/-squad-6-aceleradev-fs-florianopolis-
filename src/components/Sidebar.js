import React from "react";
import styled from "styled-components";

const Sidenav = styled.div`
  height: 100%; /* 100% Full-height */
  width: 100px;
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: #44c4e7; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 0px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Navlink = styled.a`
  padding: 8px 8px 8px 8px;
  text-decoration: none;
  font-size: 15px;
  color: #333;
  display: block;
  transition: 0.3s;
  padding: 40px 0;

  &:hover {
    color: #44c4e7;
  }
`;

const Sideblock = styled.div`
  background-color: white;
`;

export default props => {
  return (
    // <Menu>
    <Sidenav>
      <Sideblock>
        <Navlink href="/dashboard">Dashboard</Navlink>
      </Sideblock>
      <Sideblock>
        <Navlink href="/register">Register</Navlink>
      </Sideblock>
      <Sideblock>
        <Navlink href="/upload">Upload</Navlink>
      </Sideblock>
      <Sideblock>
        <Navlink href="/notifications">Notifications</Navlink>
      </Sideblock>
    </Sidenav>

    // </Menu>
  );
};
