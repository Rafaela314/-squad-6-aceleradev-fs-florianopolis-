import React from "react";
import { getAll } from "../../services/funcionarios";

import styled from "styled-components";

import PieData from "./Charts/PieData";
import LineData from "./Charts/LineData";

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  @media only screen and (max-width: 800px) {
    display: inline-block;
  }
`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  async componentDidMount() {
    try {
      const prospects = await getAll();
      this.props.addProspects(prospects);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div>
        <h1>Dashboard</h1>
        <ChartsWrapper>
          <PieData />
          <PieData />
          <PieData />
        </ChartsWrapper>
        <ChartsWrapper>
          <LineData />
          <LineData />
        </ChartsWrapper>

        <ol className="books-grid">
          {this.props.prospects &&
            this.props.prospects.map(p => <p>{this.props.title}</p>)}
        </ol>
      </div>
    );
  }
}

export default Dashboard;
