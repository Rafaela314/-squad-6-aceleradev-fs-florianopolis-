import React from "react";
import axios from 'axios';
import { Container, Row, Col, Card,  } from "react-bootstrap";
// import { getAll } from "../../services/funcionarios";

import styled from "styled-components";
import PieData from "./Dashboard/Charts/PieData";
import AreaDataRS from "./Dashboard/Charts/AreaDataRS";
import AreaDataN from "./Dashboard/Charts/AreaDataN";
import Top10N from "./Dashboard/Charts/Top10N";
import Top10RS from "./Dashboard/Charts/Top10RS";
import RangeWage from "./Dashboard/Charts/RangeWage";

const Spacer = styled.div`
 height: 40px;
 width: 100% 
 
`;

class Dashboard extends React.Component {
 
  state = {
    statistics: [],
    users: [],
      
  }

  getDash = () => {
    axios("http://localhost:8080/dashboard", {
    method: "GET",
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
    "Content-Type": "application/json",
    Authorization: "Basic YWRtaW46YWRtaW4="
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer" // no-referrer, *client
    })
    .then(response => {
    console.log("Statistics", response.data.statistics);
    console.log("Ranks", response.data.ranks);
    //return response.json(); não faz - dá erro
    })
    .then(data => {
    //não está fazendo -
    console.log("data", data);
    /*this.setState({
    users: data
    });*/
    })
    .catch(err => {
    if (err.response) {
    if (err.response.status === 400) {
    //precisa - vai passar aqui qdo não tiver
    alert(err.response.data.message); 
    }
  } else {
  console.log("Erro", err);
  }
  });
};

componentDidMount() {
/* axios.get('/dashboard').then(response => response.data)
.then((data)=> {
this.setState({users: data})
console.log(this.state.users)
})*/
this.getDash();
}



    /*request login*/

  /*  axios.post('/login', {
    "password": "admin",
    "username": "admin"
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });*/
  
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
