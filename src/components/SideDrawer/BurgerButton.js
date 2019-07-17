import React from 'react';
import styled from "styled-components";


const BurgerBt = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 24px;
    width: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    box-sizing: border-box;
        div {
            width: 30px;
            height: 2px;
            background: white;

        }
    &focus {
        outline: none;
    }

`;

const BurgerButton = (props) => (
    <BurgerBt onClick={props.click}>
        <div />
        <div />
        <div />
    </BurgerBt>
)

export default BurgerButton;