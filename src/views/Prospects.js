import React, { Component } from "react";
import { render } from "react-dom";

import styled from "styled-components";
import Prospect from "../components/Prospect";
import Loading from "../components/Loading";
import PropTypes from "prop-types";

const auth = localStorage.getItem("token");

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  text-align: center;
  margin: 100px auto;
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border: 3px solid #ddd;
  width: 100%;
  tbody:before {
    content: "-";
    display: block;
    line-height: 0.6em;
    color: transparent;
  }
`;

const Th = styled.th`
  border: 1px solid black;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #6bd2c9;
  font-size: 18px;
  color: white;
  font-weight: 700;
  opacity: 0.65;
`;

const Tr = styled.tr`
  border-bottom: 2px solid black;
`;

const SearchBar = styled.input`
  display: block;
  width: 200px;
  margin-top: 40px;
  margin-left: 80%;
  border: 3px solid #6bd2c9;
  padding: 5px;
  height: 40px;
  border-radius: 5px;
  outline: none;
  color: black;
`;

class Prospects extends Component {
  static propTypes = {
    prospects: PropTypes.array.isRequired
  };

  state = {
    searchString: "",
    prospects: [],
    loading: true
  };

  changeSearch = e =>
    this.setState({
      searchString: e.target.value
    });

  getProspects = () => {
    fetch("http://localhost:8080/leads", {
      method: "GET",
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: auth
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          loading: false,
          prospects: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getProspects();
  }

  renderTableHeader() {
    if (this.state.prospects[0]) {
      let header = Object.keys(this.state.prospects[0]);
      return header.map((key, index) => {
        return <Th key={index}>{key.toUpperCase()}</Th>;
      });
    } else {
      return null;
    }
  }

  renderProspects = searchString => {
    const search = this.state.searchString;
    const prospectsJson = this.state.prospects;

    if (search === "") {
      return prospectsJson.map((item, index) => (
          <Prospect key={index} prospect={item} id={index}/>
        ))
    } else {
      let result = prospectsJson.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );

      return result.map((item, index) => (
        <Prospect key={index} prospect={item} id={index}/>
      

      ))
    }
  } 


  render() {

    const { prospects, loading } = this.state;

    return (
      <Main>
        {loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <Table>
              <tbody>
                <Tr>{this.renderTableHeader()}</Tr>
                {this.renderProspects()}
              </tbody>
            </Table>
          </React.Fragment>
        )}
      </Main>
    );
  }
}

export default Prospects;
