import React from 'react';
import styled from "styled-components";

const Nav = styled.nav`
    height: 100%;
    background: #2B313E;
    box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 70%;
    max-width: 400px;
    z-index: 200;
        a {
            color: white;
            text-decoration: none;
            font-size: 2rem;
        }   

`;

const List = styled.ul`
    height: 100%;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
        li {
            margin: 1rem 0;
            padding: 30px;
            &:hover, &.active {
                background-color: #6BD2C9;
                color: white;
            }
        }
`;

const SideDrawer = props => (
    <Nav>
        <List >
            <li>
                <a className="menu-item" href="/dashboard">Dashboard</a>
            </li>
            <li> 
                <a className="menu-item" href="/register">Register</a>
            </li>
            <li>
                <a className="menu-item" href="/upload">Upload</a>
            </li>
            <li>
            <a className="menu-item" href="/notifications">Notifications</a>
            </li>
        </List>
    </Nav>
);
export default SideDrawer;
