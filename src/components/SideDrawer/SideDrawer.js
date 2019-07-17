import React from "react";
import styled from "styled-components";

const Sidenav = styled.div`
  height: 100%; /* 100% Full-height */
  width: 50px;
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: #d3d3d3; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 0px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  &:hover {
    background-color: #44c4e7;
    width: 200px;
    color: white;
  }
`;

const Navlink = styled.a`
  /* padding: 80px 80px 80px 80px; */
  text-decoration: none;
  font-size: 15px;
  color: #d3d3d3;
  background-color: #d3d3d3;
  display: block;
  transition: 0.3s;
  height: 100%;
  margin-bottom: 3px solid black;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: black;
    background-color: white;
  }

  ${Sidenav}:hover & {
    /* background-color: white; */
    /* color: black; */
  }
`;

const Sideblock = styled.div`
  margin: 3px solid black;
  height: 25%;
`;

const moveBody = () =>
  document.querySelector("body").classList.toggle("marginBody");
const SideDrawer = props => (
  <Sidenav onMouseOver={moveBody} onMouseOut={moveBody}>
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
);
export default SideDrawer;
