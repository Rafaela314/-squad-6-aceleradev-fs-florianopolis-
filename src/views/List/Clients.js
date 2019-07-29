import React, { Component } from "react";
import styled from "styled-components";
import Row from "./Row";
import list from "../../JSON/list.json";

// Objetivo de importar LIST e da função renderList é simular
// uma request padrao para a API

const SearchBar = styled.input`
  display: block;
  margin-top: 40px;
  margin-left: 10%;
  border: 3px solid #00b4cc;
  padding: 5px;
  height: 20px;
  border-radius: 5px;
  outline: none;
  color: black;
`;

class Clients extends Component {
  state = {
    searchString: ""
  };

  renderList = () => {
    const searchItem = this.state.searchString;
    if (searchItem === "") {
      return list.registered.map((person, i) => (
        <Row props={person} key={i} id={i} />
      ));
    } else {
      const result = list.registered.filter(c =>
        c.name.toLowerCase().includes(searchItem.toLowerCase())
      );
      return result.map((person, i) => <Row props={person} key={i} id={i} />);
    }
  };

  changeSearch = e => {
    this.setState({
      searchString: e.target.value
    });
  };

  render() {
    console.log(list.registered);
    return (
      <div className="container">
        <h1>Registered people</h1>
        <SearchBar
          type="text"
          placeholder="pesquisa por nome"
          value={this.state.searchString}
          onChange={this.changeSearch}
        />
        <table>
          <thead>
            <tr>
              <th>nome</th>
              <th>email</th>
              <th>ID</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>{this.renderList()}</tbody>
        </table>
      </div>
    );
  }
}

export default Clients;
