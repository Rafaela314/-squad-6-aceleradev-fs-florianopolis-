import React, { Component } from "react";
import styled from "styled-components";
import Prospect from "./Prospect";
import PropTypes from "prop-types";

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

class UploadSave extends Component {
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
  prospects;
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
            <Tr>{this.renderTableHeader()}</Tr>
            {newList.map((item, index) => (
              <Prospect key={index} prospect={item} />
            ))}
          </tbody>
        </Table>
      </Main>
    );
  }
}

export default UploadSave;
