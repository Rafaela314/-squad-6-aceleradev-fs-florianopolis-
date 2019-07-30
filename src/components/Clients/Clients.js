import React, { Component } from "react";
import styled from "styled-components";

import axios from "axios";
import Table from "./Table";

const auth = localStorage.getItem("token");

const Wrapper = styled.div`
  padding-top: 50px;
  height: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
  flex-direction: column;
`;

class Upload extends Component {
  state = {
    clients: [],
    searchString: ""
  };

  // componentDidMount() {
  //   console.log("componentDidMount coming through!");
  //   console.log(this);
  //   console.log(<Table />);

  //   axios
  //     .get("http://localhost:8080/clients", {
  //       method: "GET",
  //       credentials: "same-origin", // include, *same-origin, omit
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Basic YWRtaW46YWRtaW4="
  //       },
  //       redirect: "follow", // manual, *follow, error
  //       referrer: "no-referrer" // no-referrer, *client
  //     })
  //     .then(res => {
  //       const users = res.data;
  //       console.log(users);
  //       // this.setState({
  //       //   users
  //       // });
  //     });
  // }

  uploadCSV = () => {
    var formData = new FormData();
    var file = document.querySelector("#file");

    // console.log(file.files[0]);
    formData.append("file", file.files[0]);
    console.log(formData);
    axios
      .post(
        "http://localhost:8080/clients",

        formData,
        {
          headers: {
            "content-type":
              "multipart/form-data; boundary=--------------------------210852888477784036698929",
            Authorization: auth
          }
        }
      )
      .catch(err => console.log(err));
  };

  render() {
    // console.log("state", this.state.clients);
    return (
      <div>
        <h1>Upload CSV file</h1>
        <Wrapper>
          <input type="file" id="file" name="FileCSV" />
          <label id="file">Choose a file</label>
          <button onClick={this.uploadCSV}>confirm</button>
        </Wrapper>
        <Table />
      </div>
    );
  }
}

export default Upload;
