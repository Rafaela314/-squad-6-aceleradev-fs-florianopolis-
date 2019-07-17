import React, { Component } from "react";
import Prospect from "./Prospect";
import PropTypes from "prop-types";
import styled from "styled-components";

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  text-align: center;
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
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #44c4e7;
  font-size: 18px;
  color: white;
  font-weight: 700;
  opacity: 0.65;
`;

class Upload extends Component {
  static propTypes = {
    prospects: PropTypes.array.isRequired
  };
  state = {
    query: ""
  };
  updateQuery = query => {
    this.setState(() => ({
      query: query.trim()
    }));
  };

  renderTableHeader() {
    let header = Object.keys(this.props.prospects[0]);
    return header.map((key, index) => {
      return <Th key={index}>{key.toUpperCase()}</Th>;
    });
  }

  render() {
    const { query } = this.state;
    const { prospects } = this.props;

    const newList =
      query === ""
        ? prospects
        : prospects.filter(c =>
            c.title.toLowerCase().includes(query.toLowerCase())
          );

    return (
      <Main>
        {JSON.stringify(this.state)}
        <div>
          <input
            type="text"
            placeholder="Search Contacts"
            value={query}
            onChange={event => this.updateQuery(event.target.value)}
          />
        </div>

        <Table>
          <tbody>
            <tr>{this.renderTableHeader()}</tr>
            {newList.map((item, index) => (
              <Prospect key={index} prospect={item} />
            ))}
          </tbody>
        </Table>
      </Main>
    );
  }
}

export default Upload;
