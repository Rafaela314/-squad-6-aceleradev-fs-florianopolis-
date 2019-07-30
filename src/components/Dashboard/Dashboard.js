import React from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
// import { getAll } from "../../services/funcionarios";

import styled from "styled-components";
import PieData from "./Charts/PieData";
import AreaDataRS from "./Charts/AreaDataRS";
import AreaDataN from "./Charts/AreaDataN";
import Top10N from "./Charts/Top10N";
import Top10RS from "./Charts/Top10RS";
import RangeWage from "./Charts/RangeWage";

// Falta Revisar o código e formatar com boas práticas

const auth = localStorage.getItem("token");

const Spacer = styled.div`
  height: 40px;
  width: 100%;
`;

class Dashboard extends React.Component {
  state = {
    statistics: null,
    ranks: null,
    users: []
  };

  getDash = () => {
    axios("http://localhost:8080/dashboard", {
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
        console.log(response);
        var statistics = response.data.statistics;
        var ranks = response.data.ranks;
        this.setState({
          statistics,
          ranks
        });
        console.log("Dash state", this.state);
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 400) {
            alert(err.response.data.message);
          }
        } else {
          console.log("Erro", err);
        }
      });
  };

  componentDidMount() {
    this.getDash();
  }

  // Basicamente eu pegue a resposta que tava vindo no GET da requisição do axios
  // ali em cima e salvei no state, e depois joguei esse state como props para cada
  // um dos components depentendo do que cada um vai utilizar

  render() {
    return (
      <div>
        <Container style={{ margin: "100px 0px 0px 0px", width: "100%" }}>
          <Row>
            <Col md={4} sm={12}>
              <Card
                style={{
                  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                  borderRadius: "10px",
                  maxHeight: "299px",
                  width: "300px",
                  textAlign: "center"
                }}
              >
                <Card.Header
                  style={{
                    backgroundColor: "#6bd2c9",
                    height: "50px",
                    justifyContent: "center",
                    fontWeight: "500",
                    padding: "5px 0px 5px"
                  }}
                >
                  <h4>Summary</h4>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    Goal vs Actual <br />
                    (20K+ only)
                  </Card.Title>
                  <Card.Text style={{ paddingBottom: "5px" }}>
                    Period: Jul/ 2019 <br />
                    Market Share: 70% | 53% <br />
                    TT Revenue: 2MM | 1.354MM <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} sm={12}>
              <Card
                style={{
                  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                  borderRadius: "10px",
                  maxHeight: "299px",
                  width: "300px",
                  textAlign: "center"
                }}
              >
                <Card.Header
                  style={{
                    backgroundColor: "#0099bf",
                    height: "50px",
                    justifyContent: "center",
                    fontWeight: "500",
                    padding: "5px 0px 5px"
                  }}
                >
                  <h4>Central Tendency</h4>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    Gov. workforce wage <br /> (20K+ only)
                  </Card.Title>
                  <Card.Text style={{ paddingBottom: "5px" }}>
                    Mean: 19k <br />
                    Median: 20k <br />
                    Mode: 45k <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} sm={12}>
              <Card
                style={{
                  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                  borderRadius: "10px",
                  maxHeight: "299px",
                  width: "300px",
                  textAlign: "center"
                }}
              >
                <Card.Header
                  style={{
                    backgroundColor: "#a8eeff",
                    height: "50px",
                    justifyContent: "center",
                    fontWeight: "500",
                    padding: "5px 0px 5px"
                  }}
                >
                  <h4>Variability</h4>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    Gov. workforce wage <br /> (20K+ only)
                  </Card.Title>
                  <Card.Text style={{ paddingBottom: "5px" }}>
                    Range: 19k - 54K <br />
                    Variance: XXXXX <br />
                    St Deviation: 15k <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Spacer />
          <Row>
            <Col md={4} sm={12}>
              <PieData data={this.state.statistics} />
              {/* passando o statistics pra esse camarada */}
            </Col>
            <Col md={8} sm={12}>
              <RangeWage data={this.state.statistics} />
              {/* passando o statistics pra esse camarada */}
            </Col>
          </Row>

          <Row>
            <Col md={6} sm={12}>
              <AreaDataN data={this.state.statistics} />
              {/* passando o statistics pra esse camarada */}
            </Col>
            <Col md={6} sm={12}>
              <AreaDataRS data={this.state.statistics} />
              {/* passando o statistics pra esse camarada */}
            </Col>
          </Row>
          <Spacer />
          <Row>
            <Col md={6} sm={12}>
              <Top10N data={this.state.ranks} />
              {/* passando o ranks pra esse camarada */}
            </Col>
            <Col md={6} sm={12}>
              <Top10RS data={this.state.ranks} />
              {/* passando o ranks pra esse camarada */}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
