import React, { Component } from 'react';
import styled from 'styled-components';
import AddForm from '../components/AddForm';


const Display = styled.div`
  float: right;
  display: block;
  width: 20px;
  height: 200px;

`;
class Modal extends Component {

    onClose = e => {
        this.props.onClose && this.props.onClose(e);
    };

    render() {
        if(!this.props.show){
            return null;
        }
      return (
        <Display>
            <div>
            <AddForm addUserState={this.props.addUserState}
               />
            </div>
            <div>
                <button
                onClick={this.onClose}
                style={{float: "left", marginRight:"10px"}}
                >X</button>
            </div>  
        </Display>
      );
    }   
}

export default Modal;