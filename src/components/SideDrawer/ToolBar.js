import React from "react";
import styled from "styled-components";
import logo from "../../assets/uati_logo.png";
import BurgerButton from "./BurgerButton";

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #2b313e;
  height: 50px;
`;

const Logo = styled.div`
  position: fixed;
  margin-left: 3rem;

  img {
    height: auto;
    width: 80px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Toolbar = props => (
  <Header>
    <Nav>
      <div>
        <BurgerButton click={props.drawerClickHandler} />
      </div>
      <div />
      <Logo>
        <img src={logo} alt="Logo" />
      </Logo>
      <Spacer />
    </Nav>
  </Header>
);

export default Toolbar;
