import React from "react";
import styled from "styled-components";

// import logo from "../../assets/uati_logo.png";
// import BurgerButton from "./BurgerButton";

import dash from "../../assets/icons/dash_w.svg";
import target from "../../assets/icons/objective_w.svg";
import clients from "../../assets/icons/clients_w.svg";
import users from "../../assets/icons/group_w.svg";
import bell from "../../assets/icons/bell_w.svg";

import ToolBar from "./ToolBar";

// TOOLBAR ===========
const Line = styled.hr`
  background-color: #2b313e;
  margin: 0;
  padding: 0;
  border: 0;
  height: 4px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #2b313e;
  height: 50px;

  &:hover {
    color: black;
    /* background-color: white; */
  }
`;

const Logo = styled.div`
  position: fixed;
  margin-left: 3rem;

  img {
    height: auto;
    width: 80px;
  }

  /* ${Header}:hover & {
    background-color: yellow;
    width: 200px;
    color: white;

  } */
`;

// SIDENAV ================

const Hoveri = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 50px;
  background-color: transparent;
  height: 50px;
`;

const Sidenav = styled.div`
  height: 100vh; /* 100% Full-height */
  width: 0px;
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: white /*#d3d3d3*/; /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 0px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  overflow: hidden;

  /* &:hover {
    background-color: #d3d3d3;
    width: 200px;
    color: white;
  } */

  ${Hoveri}:hover & {
    /* background-color: white; */
    /* color: black; */
    /* border: none; */
    /* background-color: yellow; */
    width: 200px;
    color: white;
  }
`;

const Navlink = styled.a`
  /* padding: 80px 80px 80px 80px; */

  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  font-size: 20px;
  color: #d3d3d3;
  background-color: #2b313e;
  display: block;
  transition: 0.3s;
  height: 100%;
  margin-bottom: 3px solid black;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  /* border-top: 1px solid #b1b1b1; */

  &:hover {
    text-decoration: none;

    color: black;
    background-color: #6bd2c9;
  }

  ${Logo}:hover & {
    background-color: white;
    /* color: black; */
    /* border: none; */
  }
`;

const Sideblock = styled.div`
  /* margin: 3px solid #b1b1b1; */
  /* position: fixed; */
  background-color: #2b313e;
  height: 19.5%;
`;

const Icon = styled.img`
  filter: brightness(1);
  display: block;
  width: 30px;
  height: 30px;
  ${Navlink}:hover & {
    /* color: red; */
    /* background-color: yellow; */
    filter: brightness(0.9);
  }
`;

const Inv = styled.h4`
  color: transparent;
`;

// const Toolbar = props => (
//   <Header>
//     <Nav>
//       <div>
//         <BurgerButton click={props.drawerClickHandler} />
//       </div>
//       <div />
//       <Logo>
//         <img src={logo} alt="Logo" />
//       </Logo>
//       <Spacer />
//     </Nav>
//   </Header>
// );

const moveBody = () =>
  document.querySelector("body").classList.toggle("marginBody");

const SideDrawer = props => (
  <div>
    <ToolBar />
    <Hoveri>
      <Sidenav onMouseOver={moveBody} onMouseOut={moveBody}>
        <Sideblock>
          <Navlink href="/dashboard">
            <Inv>.</Inv>
            <Icon src={dash} alt="dash" />
            <h4>Dashboard</h4>
          </Navlink>
        </Sideblock>
        <Line />
        <Sideblock>
          <Navlink href="/prospects">
            <Inv>.</Inv>
            <Icon src={target} alt="prospects" />
            <h4>Prospects</h4>
          </Navlink>
        </Sideblock>
        <Line />
        <Sideblock>
          <Navlink href="/clients">
            <Inv>.</Inv>
            <Icon src={clients} alt="list" />
            <h4>clients</h4>
          </Navlink>
        </Sideblock>
        <Line />
        <Sideblock>
          <Navlink href="/users">
            <Inv>.</Inv>
            <Icon src={users} alt="users" />
            <h4>Users</h4>
          </Navlink>
        </Sideblock>
        <Line />

        <Line />
        <Sideblock>
          <Navlink href="/notifications">
            <Inv>.</Inv>
            <Icon src={bell} alt="notifications" />
            <h4>notifications</h4>
          </Navlink>
        </Sideblock>
        <Line />
      </Sidenav>
    </Hoveri>
  </div>
);
export default SideDrawer;
