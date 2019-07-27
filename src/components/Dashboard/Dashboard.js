import React from "react";
import { Container, Row, Col, Card,  } from "react-bootstrap";
// import { getAll } from "../../services/funcionarios";

import styled from "styled-components";
import PieData from "./Charts/PieData";
import AreaDataRS from "./Charts/AreaDataRS";
import AreaDataN from "./Charts/AreaDataN";
import Top10N from "./Charts/Top10N";
import Top10RS from "./Charts/Top10RS";
import RangeWage from "./Charts/RangeWage";

/*const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  @media only screen and (max-width: 800px) {
    display: inline-block;
  }
`;*/

const Spacer = styled.div`
 height: 40px;
 width: 100% 
 
`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log(this.props);
    // console.log(this.state);
    return (
      <div>
        <Container style={{margin:'100px 0px 0px 0px', width:'100%'}}>
          <Row>
          <Col md={4} sm={12}>
              <Card style={{boxShadow: '0 5px 10px rgba(0,0,0,0.2)', borderRadius: '10px', maxHeight: '299px', width: '300px', textAlign: 'center'}}>
                <Card.Header style={{backgroundColor:'#6bd2c9', height: '50px', justifyContent:'center', fontWeight:'500', padding:'5px 0px 5px'}}>
                <h4>Summary</h4></Card.Header>
                <Card.Body>
                  <Card.Title>
                  Goal vs Actual <br/>
                  (20K+ only)
                  </Card.Title>
                  <Card.Text style={{paddingBottom:'5px'}}>
                  Period: Jul/ 2019 <br/>
                  Market Share: 70% | 53%  <br/>
                  TT Revenue: 2MM | 1.354MM <br/>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} sm={12}>
              <Card style={{boxShadow: '0 5px 10px rgba(0,0,0,0.2)', borderRadius: '10px', maxHeight: '299px', width: '300px', textAlign: 'center'}}>
                <Card.Header style={{backgroundColor:'#0099bf', height: '50px', justifyContent:'center', fontWeight:'500', padding:'5px 0px 5px'}}>
                <h4>Central Tendency</h4></Card.Header>
                <Card.Body>
                  <Card.Title>
                  Gov. workforce wage <br/> (20K+ only) 
                  </Card.Title>
                  <Card.Text style={{paddingBottom:'5px'}}>
                  Mean: 19k <br/>
                  Median: 20k <br/>
                  Mode: 45k <br/>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} sm={12}>
              <Card style={{boxShadow: '0 5px 10px rgba(0,0,0,0.2)', borderRadius: '10px', maxHeight: '299px', width: '300px', textAlign: 'center'}}>
                <Card.Header style={{backgroundColor:'#a8eeff', height: '50px', justifyContent:'center', fontWeight:'500', padding:'5px 0px 5px'}}>
                <h4>Variability</h4></Card.Header>
                <Card.Body>
                  <Card.Title>
                  Gov. workforce wage <br/> (20K+ only) 
                  </Card.Title>
                  <Card.Text style={{paddingBottom:'5px'}}>
                  Range: 19k - 54K <br/>
                  Variance: XXXXX <br/>
                  St Deviation: 15k <br/>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
           
          </Row>
          <Spacer />
          <Row>
            <Col md={4} sm={12}>
            
              <PieData />
            </Col>
            <Col md={8} sm={12}>
           
              <RangeWage />
            </Col>
          </Row>
         
          <Row>
            <Col md={6} sm={12}>
             
              <AreaDataN />
            </Col>
            <Col md={6} sm={12}>
              
              <AreaDataRS />
            </Col>
          </Row>
          <Spacer />
          <Row>
            <Col md={6} sm={12}>
              <Top10N />
            </Col>
            <Col md={6} sm={12}>
              <Top10RS />
            </Col>
          </Row>

        </Container>
      </div>
    );
  }
}

export default Dashboard;
