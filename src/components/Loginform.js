import React from "react";
import styled from "styled-components";

const Formbox = styled.form`
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  width: 285px;
  margin: -140px 0 0 -182px;
  padding: 40px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
`;

const Inputfield = styled.input`
  outline: none;
  display: block;
  width: 100%;
  margin: 0 0 20px;
  padding: 10px 15px;
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
  background: #44c4e7;
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

const Tittle = styled.h2`
  margin: 0 0 20px;
  line-height: 1;
  color: #44c4e7;
  font-size: 18px;
  font-weight: 400;
`;

class Loginform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <section>
        <Formbox>
          <Tittle>Login</Tittle>
          <Inputfield
            name="userName"
            type="text"
            placeholder="usuário"
            value={this.state.userName}
            onChange={this.handleInputChange}
          />
          <Inputfield
            name="password"
            type="text"
            placeholder="senha"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <Inputbutton type="submit" value="Submit" />
        </Formbox>
      </section>
    );
  }
}

export default Loginform;
