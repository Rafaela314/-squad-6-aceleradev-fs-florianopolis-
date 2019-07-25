import React from 'react';
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

const Formbox = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  top: 20%;
  z-index: 0.5;
  padding: 20px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  z-index: 3;
`;
  
  
  /*
  left: 50%;
  background: #fff;
  flex-flow: row wrap;
  margin: -10px 0 0 -400px;*/
  

const Inputfield = styled.input`
  outline: none; 
  padding: 10px 15px 10px 15px;
  margin-left: 15px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: 0.2s linear;
  &input:focus {
    color: #333;
    border: 1px solid #44c4e7;
  }
`;

const Inputbutton = styled.input`
  cursor: pointer;
  background: #6bd2c9;
  width: 100%;
  padding: 10px 15px;
  border: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  &:hover {
    background: #369cb8;
  }
`;
/*
const Tittle = styled.h2`
  margin: 0 0 20px;
  line-height: 1;
  color: #44c4e7;
  font-size: 18px;
  font-weight: 400;
`;*/

class AddForm extends React.Component {
    state = {
        id: 0,
        name: " ",
        position: " ",
        email:" "
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
      }

      submitFormAdd = e => {
        e.preventDefault()

        this.props.addUserState();
        /*fetch('http://localhost:3000/crud', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.state.id,
            name: this.state.name,
            email: this.state.email,
            position: this.state.position,
           
          })
        })
          .then(response => response.json())
          .then(user => {
            if(Array.isArray(user)) {
              this.props.addUserState(user[0])
           } else {
              console.log('failure')
            }
          })
          .catch(err => console.log(err))*/
      }
      
     /* componentDidMount(){
          // if item exists, populate the state with proper data
          if(this.props.user) {
              const {id, name, email, position} = this.props.user
              this.setState({ id, name, position, email})
          }
      }*/
      render() {
    
          return(
              <Formbox onSubmit={this.submitFormAdd}>
                  <label>
                     Id:
                    <Inputfield type="text" name="id" onChange={this.onChange} />
                  </label>
                  <label>
                     Name:
                    <Inputfield type="text" name="name"  onChange={this.onChange}/>
                  </label>
                  <label>
                     Position:
                    <Inputfield type="text" name="position" onChange={this.onChange}/>
                  </label>
                  <label>
                     Email:
                    <Inputfield type="text" name="email" onChange={this.onChange}/>
                  </label>
                  <Inputbutton type="submit" value="Submit" />
              </Formbox>
          );

      }
}

export default AddForm;