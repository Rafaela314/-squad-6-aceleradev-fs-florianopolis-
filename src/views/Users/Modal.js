import React, { Component } from "react";
import styled from "styled-components";
import AddForm from "./AddForm";

const Display = styled.div`
  float: right;
  display: flex;
  width: 100%;
  height: 100px;
  margin: 50px 0px 0px 0px;
`;

const Closebutton = styled.button`
  cursor: pointer;
  background: #6bd2c9;
  border: 0;
  color: #fff;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 400;
  margin: 500px 0px 0px 900px;

  &:hover {
    background: #369cb8;
  }
`;

class Modal extends Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    console.log(this.props);
    if (!this.props.show) {
      return null;
    }
    return (
      <Display>
        <div>
          <AddForm addUserState={this.props.addUserState} />
        </div>
        <div>
          <Closebutton
            onClick={this.onClose}
            style={{ float: "left", marginRight: "10px" }}
          >
            X
          </Closebutton>
        </div>
      </Display>
    );
  }
}

export default Modal;
